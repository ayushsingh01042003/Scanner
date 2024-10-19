import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import EmailModal from '../../components/EmailModal';
import { MdDelete } from 'react-icons/md';

const ReportDetails = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [scanDetails, setScanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [reportType, setReportType] = useState('static');
  const [splunkResults, setSplunkResults] = useState(null);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    if (selectedScanId) {
      fetchScanDetails(selectedScanId);
    }
  }, [selectedScanId]);

  useEffect(() => {
    if (reportType === 'dynamic' && selectedScanId) {
      if (scanDetails && scanDetails.reportData && scanDetails.reportData.splunkQuery) {
        const { index, fieldRegexPairs } = scanDetails.reportData.splunkQuery;
        fetchSplunkResults(index, fieldRegexPairs);
      }
    }
  }, [reportType, selectedScanId, scanDetails]);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/getAllProjects');
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch projects');
      setLoading(false);
    }
  };

  const fetchScanDetails = async (scanId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/getReport/${scanId}`);
      const scanData = response.data;

      if (scanData.project && typeof scanData.project === 'string') {
        const projectResponse = await axios.get(`http://localhost:3000/getProject/${scanData.project}`);
        scanData.project = projectResponse.data;
      }

      setScanDetails(scanData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scan details:', err);
      setError('Failed to fetch scan details');
      setLoading(false);
    }
  };

  const fetchSplunkResults = async (index, fieldRegexPairs) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/splunk-search', {
        index,
        fieldRegexPairs
      });
      setSplunkResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Splunk results:', err);
      setError('Failed to fetch Splunk results');
      setLoading(false);
    }
  };

  const formatSplunkResults = () => {
    if (!splunkResults || !splunkResults.results) return '';

    let formattedResults = 'Splunk Search Results:\n\n';
    splunkResults.results.forEach((result, index) => {
      formattedResults += `Result ${index + 1}:\n`;
      Object.entries(result).forEach(([field, value]) => {
        formattedResults += `  ${field}: ${value}\n`;
      });
      formattedResults += '\n';
    });
    return formattedResults;
  };

  const formatScanDetails = () => {
    if (!scanDetails || !scanDetails.reportData) {
      console.error('Missing scanDetails or reportData');
      return 'Error: Scan details not available';
    }
  
    let formattedDetails = '';
  
    formattedDetails += `Username: ${scanDetails.username}\n`;
    formattedDetails += `Project: ${scanDetails.project.projectName}\n`;
    formattedDetails += `Timestamp: ${new Date(scanDetails.timestamp).toLocaleString()}\n\n`;
  
    try {
      if (scanDetails.scanType === 'dynamic') {
        formattedDetails += formatDynamicScanResults(scanDetails.reportData);
      } else {
        formattedDetails += formatStaticScanResults(scanDetails.reportData);
      }
    } catch (error) {
      console.error('Error formatting scan details:', error);
      formattedDetails += `Error formatting scan details: ${error.message}\n`;
    }
  
    return formattedDetails || 'No scan details available';
  };
  
  const formatDynamicScanResults = (reportData) => {
    let formattedDetails = 'Dynamic Scan Results:\n';
    formattedDetails += 'Dynamic Scan Statistics:\n';
    formattedDetails += 'Vulnerabilities:\n';
  
    if (reportData.vulnerabilities && Array.isArray(reportData.vulnerabilities)) {
      reportData.vulnerabilities.forEach((vulnerability, index) => {
        formattedDetails += `${index}:\n`;
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
    let formattedDetails = 'Vulnerabilities Found and Language Statistics:\n';
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

  const handleDownloadReport = () => {
    if (!scanDetails || !scanDetails.project) return;

    const formattedDetails =
      `Username: ${scanDetails.username}
    Project: ${scanDetails.project.projectName}
    Timestamp: ${scanDetails.timestamp}
    
    ${formatScanDetails()}
    `;

    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(formattedDetails, 10, 10);

    doc.save(`report-${scanDetails._id}.pdf`);
  };

  const handleSendEmail = async () => {
    try {
      const formattedDetails =
        `Username: ${scanDetails.username}
      Project: ${scanDetails.project.projectName}
      Timestamp: ${scanDetails.timestamp}
      
      ${formatScanDetails()}`;

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

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action will delete all scans associated with the project.')) {
      try {
        await axios.delete(`http://localhost:3000/deleteProject/${projectId}`);
        setProjects(projects.filter(project => project._id !== projectId));
        setSelectedProjectId(null);
        setSelectedScanId(null);
        setScanDetails(null);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleDeleteScan = async (scanId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      try {
        await axios.delete(`http://localhost:3000/deleteScan/${scanId}`);
        setProjects(projects.map(project => {
          if (project._id === selectedProjectId) {
            project.scans = project.scans.filter(scan => scan._id !== scanId);
          }
          return project;
        }));
        setSelectedScanId(null);
        setScanDetails(null);
      } catch (error) {
        console.error('Error deleting scan:', error);
        alert('Failed to delete scan. Please try again.');
      }
    }
  };

  const renderProjectList = () => {
    return projects
      .filter(project => {
        if (reportType === 'static') {
          return !project.scans.some(scan => scan.scanType === 'dynamic');
        } else {
          return project.scans.some(scan => scan.scanType === 'dynamic');
        }
      })
      .map(project => (
        <li key={project._id} className="mb-4">
          <div
            className={`cursor-pointer hover:text-white p-2 rounded flex items-center justify-between ${project._id === selectedProjectId ? 'bg-[#1c1c1c] text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedProjectId(project._id)}
          >
            <div className="flex-1">
              <div className="flex items-center">
                <div>{project.projectName}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(project.createdAt).toLocaleString()}</div>
            </div>
            <button
              className="ml-4 p-1 hover:bg-red-700 transition duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProject(project._id);
              }}
            >
              <MdDelete />
            </button>
          </div>
          {project._id === selectedProjectId && (
            <ul className="ml-4 mt-2">
              {project.scans
                .filter(scan => reportType === 'dynamic' ? scan.scanType === 'dynamic' : scan.scanType !== 'dynamic')
                .map(scan => (
                  <li
                    key={scan._id}
                    className={`cursor-pointer hover:text-white p-1 rounded flex justify-between items-center ${scan._id === selectedScanId ? 'bg-[#121212] text-white' : 'text-gray-500'}`}
                    onClick={() => setSelectedScanId(scan._id)}
                  >
                    Scan: {new Date(scan.timestamp).toLocaleString()} | Run by: {scan.username}
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full block p-8">
          <h1 className="text-lg text-[#a4ff9e]">Scanner</h1>
          <h1 className="text-4xl font-bold text-white ">Reports</h1>
        </div>
        <div className="mb-8">
          <div className="flex space-x-4">
            <button
              aria-pressed={reportType === 'static'}
              className={`ml-9 bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-12 rounded-2xl transition duration-300 ${reportType === 'static' ? 'bg-[#2C2D2F]' : ''}`}
              onClick={() => setReportType('static')}
            >
              Static
            </button>
            <button
              aria-pressed={reportType === 'dynamic'}
              className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-12 rounded-2xl transition duration-300 ${reportType === 'dynamic' ? 'bg-[#2C2D2F]' : ''}`}
              onClick={() => setReportType('dynamic')}
            >
              Dynamic
            </button>
          </div>  
        </div>

        <div className="flex w-[95%] h-full mx-auto">
          <section className="w-1/3 bg-[#2C2D2F] text-white p-6 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg" style={{ maxHeight: '100vh', minHeight: 0 }}>
            <h2 className="text-xl mb-4 text-grey-300">Recent Projects</h2>
            <ul>
              {renderProjectList()}
            </ul>
          </section>

          <div className="bg-[#121212] w-[20px]"></div>

          <section className="flex-1 bg-[#2C2D2F] text-white p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg mb-4" style={{ maxHeight: '100vh', minHeight: 0 }}>
            <h2 className="text-xl mb-4 text-grey-300">Scan Details</h2>
            <div className="bg-[#1C1C1C] p-4 rounded-lg text-gray-300">
              {scanDetails && scanDetails.project ? (
                <pre className="whitespace-pre-wrap">
                  <strong>Username:</strong> {scanDetails.username}<br />
                  <strong>Project:</strong> {scanDetails.project.projectName}<br />
                  <strong>Timestamp:</strong> {new Date(scanDetails.timestamp).toLocaleString()}
                  <br />
                  <br />
                  <strong>{reportType === 'dynamic' ? 'Dynamic Scan Results:' : 'Vulnerabilities Found and Language Statistics:'}</strong><br />
                  {formatScanDetails()}
                </pre>
              ) : (
                <p>Select a project and scan to view details</p>
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
                  className="mt-4 p-2 bg-[#a4ff9e] hover:bg-black hover:text-[#aeff9e] text-black py-3 px-7 rounded-lg w-54 transition duriation-300 font-bold"
                  style={{ margin: "10px" }}
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