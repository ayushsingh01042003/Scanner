import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import EmailModal from '../../components/EmailModal';
import { MdDelete } from 'react-icons/md'; // Import the delete icon from react-icons/md

const ReportDetails = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [scanDetails, setScanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    if (selectedScanId) {
      fetchScanDetails(selectedScanId);
    }
  }, [selectedScanId]);

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

      // Fetch project details if not included in the scan data
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

  const formatScanDetails = () => {
    if (!scanDetails || !scanDetails.reportData) return '';

    let formattedDetails = '';

    // Handle dynamic scan (based on logStats)
    if (scanDetails.reportData.logStats) {
      formattedDetails += 'Dynamic Scan Statistics:\n';
      formattedDetails += `Total Lines: ${scanDetails.reportData.logStats.totalLines}\n`;
      if (scanDetails.reportData.vulnerabilities) {
        formattedDetails += 'Vulnerabilities:\n';
        Object.entries(scanDetails.reportData.vulnerabilities).forEach(([type, instances]) => {
          formattedDetails += `${type.toUpperCase()}:\n`;
          instances.forEach(instance => {
            // Extract line number from the instance string
            const match = instance.match(/\(line (\d+)\)/);
            const lineNumber = match ? match[1] : 'Unknown';
            const content = instance.replace(/\(line \d+\)/, '').trim();
            formattedDetails += `  Line: ${lineNumber}, Content: ${content}\n`;
          });
          formattedDetails += '\n';
        });
      }
    } else {
      // Handle regular scan (based on scanDetails)
      if (scanDetails.reportData.scanDetails) {
        formattedDetails += 'Vulnerabilities:\n';
        Object.entries(scanDetails.reportData.scanDetails).forEach(([type, files]) => {
          formattedDetails += `${type.toUpperCase()}:\n`;
          Object.entries(files).forEach(([file, instances]) => {
            formattedDetails += `  Path: ${file}\n`;
            if (Array.isArray(instances)) {
              formattedDetails += `  Instances: ${instances.join(', ')}\n`;
            } else if (typeof instances === 'object') {
              formattedDetails += `  Instances: ${JSON.stringify(instances)}\n`;
            } else {
              formattedDetails += `  Instances: ${instances}\n`;
            }
          });
          formattedDetails += '\n';
        });
      }

      // Handle regular scan language statistics
      if (scanDetails.reportData.stats) {
        formattedDetails += 'Language Statistics:\n';
        Object.entries(scanDetails.reportData.stats).forEach(([language, percentage]) => {
          formattedDetails += `${language}: ${percentage.toFixed(2)}%\n`;
        });
      }
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
    ;`

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full block p-8">
          <h1 className="text-lg text-[#a4ff9e]">Scanner</h1>
          <h1 className="text-4xl font-bold text-white mb-6">Reports</h1>
        </div>
        <div className="flex w-[95%] h-full mx-auto">
          <section className="w-1/3 bg-[#2C2D2F] text-white p-6 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg" style={{ maxHeight: '100vh', minHeight: 0 }}>
            <h2 className="text-xl mb-4 text-grey-300">Recent Projects</h2>
            <ul>
              {projects.map(project => (
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
                        e.stopPropagation(); // Prevent the click event from triggering the onClick of the project name
                        handleDeleteProject(project._id);
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                  {project._id === selectedProjectId && (
                    <ul className="ml-4 mt-2">
                      {project.scans.map(scan => (
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
                                e.stopPropagation(); // Prevent the click event from triggering the onClick of the scan item
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
              ))}
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
                  <strong>Vulnerabilities Found and Language Statistics:</strong><br />
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

                <button className="mt-4 p-2 bg-[#a4ff9e] hover:bg-black hover:text-[#aeff9e] text-black py-3 px-7 rounded-lg w-54 transition duriation-300 font-bold "
                  style={{ margin: "10px" }} onClick={() => setIsEmailModalOpen(true)}
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
      </div></>
  );
};

export default ReportDetails;