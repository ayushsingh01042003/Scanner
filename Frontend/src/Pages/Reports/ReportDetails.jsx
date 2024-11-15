import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import EmailModal from '../../components/EmailModal';
import { MdDelete } from 'react-icons/md';

const ReportDetails = () => {
  const [projectsMap, setProjectsMap] = useState({});
  const [personalScans, setPersonalScans] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [scanDetails, setScanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [splunkResults, setSplunkResults] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Required for cookies to be sent
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      setError('Your session has expired. Please log in again.');
      // Redirect to login page if you have one
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      setError('You do not have permission to access these scans.');
    }
  };

  useEffect(() => {
    fetchPersonalScans();
  }, []);

  useEffect(() => {
    if (selectedScanId) {
      const scan = personalScans.find(scan => scan._id === selectedScanId);
      if (scan) {
        setScanDetails(scan);
      } else {
        fetchScanDetails(selectedScanId);
      }
    }
  }, [selectedScanId, personalScans]);

  useEffect(() => {
    if (scanDetails?.reportData?.splunkQuery && scanDetails.scanType === 'dynamic') {
      const { index, fieldRegexPairs } = scanDetails.reportData.splunkQuery;
      fetchSplunkResults(index, fieldRegexPairs);
    }
  }, [scanDetails]);

  const fetchPersonalScans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/personal/scans');
      const scans = response.data;
      
      // Group scans by project
      const projectGroups = scans.reduce((groups, scan) => {
        const projectId = scan.project._id;
        if (!groups[projectId]) {
          groups[projectId] = {
            projectId,
            projectName: scan.project.projectName,
            scans: []
          };
        }
        groups[projectId].scans.push(scan);
        return groups;
      }, {});

      // Sort scans within each project by timestamp
      Object.values(projectGroups).forEach(project => {
        project.scans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });

      setProjectsMap(projectGroups);
      setPersonalScans(scans);
      setError(null);
    } catch (err) {
      console.error('Error fetching personal scans:', err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanDetails = async (scanId) => {
    try {
      setLoading(true);
      const response = await api.get(`/getReport/${scanId}`);
      const scanData = response.data;

      // Ensure we have complete project and user data
      if (!scanData.project || typeof scanData.project === 'string') {
        const projectResponse = await api.get(`/getProject/${scanData.project}`);
        scanData.project = projectResponse.data;
      }

      // Make sure we always fetch fresh user data
      if (scanData.user) {
        try {
          const userResponse = await api.get(`/getUser/${typeof scanData.user === 'string' ? scanData.user : scanData.user._id}`);
          scanData.user = userResponse.data;
        } catch (userErr) {
          console.error('Error fetching user details:', userErr);
          scanData.user = { username: 'User Unavailable' };
        }
      } else {
        scanData.user = { username: 'User Unavailable' };
      }

      setScanDetails(scanData);
      setError(null);
    } catch (err) {
      console.error('Error fetching scan details:', err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSplunkResults = async (index, fieldRegexPairs) => {
    try {
      setLoading(true);
      const response = await api.post('/splunk-search', {
        index,
        fieldRegexPairs
      });
      setSplunkResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching Splunk results:', err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (scanId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      try {
        await api.delete(`/deleteScan/${scanId}`);
        setPersonalScans(prevScans => prevScans.filter(scan => scan._id !== scanId));
        
        const updatedProjectsMap = { ...projectsMap };
        Object.keys(updatedProjectsMap).forEach(projectId => {
          updatedProjectsMap[projectId].scans = updatedProjectsMap[projectId].scans
            .filter(scan => scan._id !== scanId);
          
          if (updatedProjectsMap[projectId].scans.length === 0) {
            delete updatedProjectsMap[projectId];
          }
        });
        
        setProjectsMap(updatedProjectsMap);
        setSelectedScanId(null);
        setScanDetails(null);
        setError(null);
      } catch (err) {
        console.error('Error deleting scan:', err);
        handleAuthError(err);
        alert('Failed to delete scan. Please try again.');
      }
    }
  };

  const formatDynamicScanResults = (reportData) => {
    let formattedDetails = 'Dynamic Scan Results:\n';
    formattedDetails += 'Vulnerabilities:\n';
  
    if (reportData.vulnerabilities && Array.isArray(reportData.vulnerabilities)) {
      reportData.vulnerabilities.forEach((vulnerability, index) => {
        formattedDetails += `${index + 1}:\n`;
        Object.entries(vulnerability).forEach(([key, value]) => {
          if (key !== 'filePath') {
            formattedDetails += `  ${key}: ${value}\n`;
          }
        });
        if (vulnerability.filePath) {
          formattedDetails += `  filePath: ${vulnerability.filePath}\n`;
        }
        formattedDetails += '\n';
      });
    }
  
    return formattedDetails;
  };
  
  const formatStaticScanResults = (reportData) => {
    let formattedDetails = 'Static Scan Results:\n';
    formattedDetails += 'Vulnerabilities:\n';
  
    if (reportData.scanDetails) {
      Object.entries(reportData.scanDetails).forEach(([vulnerabilityType, files]) => {
        formattedDetails += `${vulnerabilityType.toUpperCase()}:\n`;
        Object.entries(files).forEach(([filePath, instances]) => {
          formattedDetails += `  Path: ${filePath}\n`;
          instances.forEach(instance => {
            formattedDetails += `    ${instance}\n`;
          });
        });
        formattedDetails += '\n';
      });
    }
  
    if (reportData.stats) {
      formattedDetails += 'Language Statistics:\n';
      Object.entries(reportData.stats).forEach(([language, percentage]) => {
        formattedDetails += `${language}: ${typeof percentage === 'number' ? percentage.toFixed(2) : percentage}%\n`;
      });
    }
  
    return formattedDetails;
  };

  const formatScanDetails = () => {
    if (!scanDetails || !scanDetails.reportData) {
      return 'Error: Scan details not available';
    }
  
    let formattedDetails = '';
    formattedDetails += `Scan Type: ${scanDetails.scanType}\n`;
    // Use optional chaining and provide a more descriptive fallback
    formattedDetails += `Username: ${scanDetails.user?.username || 'User Unavailable'}\n`;
    formattedDetails += `Project: ${scanDetails.project?.projectName || 'Project Unavailable'}\n`;
    formattedDetails += `Timestamp: ${new Date(scanDetails.timestamp).toLocaleString()}\n\n`;
  
    try {
      if (scanDetails.scanType === 'dynamic') {
        formattedDetails += formatDynamicScanResults(scanDetails.reportData);
        if (splunkResults) {
          formattedDetails += '\nSplunk Results:\n' + formatSplunkResults();
        }
      } else {
        formattedDetails += formatStaticScanResults(scanDetails.reportData);
      }
    } catch (error) {
      console.error('Error formatting scan details:', error);
      formattedDetails += `Error formatting scan details: ${error.message}\n`;
    }
  
    return formattedDetails;
  };

  const renderProjectList = () => {
    return Object.values(projectsMap).map(project => (
      <li key={project.projectId} className="mb-4">
        <div
          className={`cursor-pointer hover:text-white p-2 rounded flex items-center justify-between ${
            project.projectId === selectedProjectId ? 'bg-[#1c1c1c] text-white' : 'text-gray-400'
          }`}
          onClick={() => setSelectedProjectId(project.projectId)}
        >
          <div className="flex-1">
            <div className="flex items-center">
              <div>{project.projectName}</div>
            </div>
            <div className="text-sm text-gray-500">
              {project.scans.length} scan{project.scans.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        {project.projectId === selectedProjectId && (
          <ul className="ml-4 mt-2">
            {project.scans.map(scan => (
              <li
                key={scan._id}
                className={`cursor-pointer hover:text-white p-1 rounded flex justify-between items-center ${
                  scan._id === selectedScanId ? 'bg-[#121212] text-white' : 'text-gray-500'
                }`}
                onClick={() => setSelectedScanId(scan._id)}
              >
                <div>
                  <span className="mr-2">[{scan.scanType}]</span>
                  {new Date(scan.timestamp).toLocaleString()}
                </div>
                {scan._id === selectedScanId && (
                  <button
                    className="ml-4 p-1 hover:bg-red-700 transition duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScan(scan._id);
                    }}
                  >
                    <MdDelete />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };


  const handleDownloadReport = () => {
    if (!scanDetails) return;

    const formattedDetails = formatScanDetails();
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(formattedDetails, 10, 10);
    doc.save(`report-${scanDetails._id}.pdf`);
  };

  const handleSendEmail = async () => {
    try {
      const formattedDetails = formatScanDetails();
      await axios.post('http://localhost:3000/email', {
        jsonData: formattedDetails,
        receiverEmail: email
      });
      alert('Email sent successfully!');
      setIsEmailModalOpen(false);
      setEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full block p-8">
          <h1 className="text-lg text-[#a4ff9e]">Scanner</h1>
          <h1 className="text-4xl font-bold text-white">My Reports</h1>
        </div>

        <div className="flex w-[95%] h-full mx-auto">
          <section className="w-1/3 bg-[#2C2D2F] text-white p-6 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg" style={{ maxHeight: '100vh', minHeight: 0 }}>
            <h2 className="text-xl mb-4 text-grey-300">My Projects</h2>
            {Object.keys(projectsMap).length > 0 ? (
              <ul>{renderProjectList()}</ul>
            ) : (
              <p className="text-gray-400">No scans found</p>
            )}
          </section>

          <div className="bg-[#121212] w-[20px]"></div>

          <section className="flex-1 bg-[#2C2D2F] text-white p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg mb-4" style={{ maxHeight: '100vh', minHeight: 0 }}>
            <h2 className="text-xl mb-4 text-grey-300">Scan Details</h2>
            <div className="bg-[#1C1C1C] p-4 rounded-lg text-gray-300">
              {scanDetails ? (
                <pre className="whitespace-pre-wrap">{formatScanDetails()}</pre>
              ) : (
                <p>Select a scan to view details</p>
              )}
            </div>
            {scanDetails && (
              <>
                <button
                  className="mt-4 p-2 bg-[#a4ff9e] hover:bg-black hover:text-[#a4ff9e] text-black py-3 px-6 rounded-lg w-54 transition duration-300 font-bold"
                  onClick={handleDownloadReport}
                >
                  Download Report
                </button>

                <button
                  className="mt-4 p-2 bg-[#a4ff9e] hover:bg-black hover:text-[#aeff9e] text-black py-3 px-7 rounded-lg w-54 transition duration-300 font-bold ml-4"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  Email Report
                </button>

                <EmailModal
                  isOpen={isEmailModalOpen}
                  onClose={() => setIsEmailModalOpen(false)}
                  email={email}
                  setEmail={setEmail}
                  onSend={handleSendEmail}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ReportDetails;
