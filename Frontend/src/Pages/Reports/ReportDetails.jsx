import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportDetails = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [scanDetails, setScanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (!scanDetails) return '';
  
    let formattedDetails = '';
  
    if (scanDetails.reportData) {
      if (scanDetails.reportData.scanDetails) {
        formattedDetails += 'Vulnerabilities:\n';
        Object.entries(scanDetails.reportData.scanDetails).forEach(([type, files]) => {
          formattedDetails += `${type.toUpperCase()}:\n`;
          Object.entries(files).forEach(([file, instances]) => {
            formattedDetails += `  Path: ${file}\n  Instances: ${instances.join(', ')}\n`;
          });
          formattedDetails += '\n';
        });
      }
  
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
  
    const formattedDetails = `
  Username: ${scanDetails.username}
  Project: ${scanDetails.project.projectName}
  Timestamp: ${scanDetails.timestamp}
  
  ${formatScanDetails()}
  `;
  
    const data = new Blob([formattedDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${scanDetails._id}.pdf`;
    a.click();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex w-full h-full">
      <section className="w-1/3 bg-[#1C1C1C] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '100vh', minHeight: 0 }}>
        <h2 className="text-lg text-gray-300 mb-4">Recent Projects</h2>
        <ul>
          {projects.map(project => (
            <li key={project._id} className="mb-4">
              <div
                className={`cursor-pointer hover:text-white p-2 rounded ${project._id === selectedProjectId ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                onClick={() => setSelectedProjectId(project._id)}
              >
                <div>{project.projectName}</div>
                <div className="text-sm text-gray-500">{new Date(project.createdAt).toLocaleString()}</div>
              </div>
              {project._id === selectedProjectId && (
                <ul className="ml-4 mt-2">
                  {project.scans.map(scan => (
                    <li
                      key={scan._id}
                      className={`cursor-pointer hover:text-white p-1 rounded ${scan._id === selectedScanId ? 'bg-gray-600 text-white' : 'text-gray-500'}`}
                      onClick={() => setSelectedScanId(scan._id)}
                    > 
                      Scan: {new Date(scan.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="w-px bg-gray-600"></div>

      <section className="flex-1 bg-[#2C2C2E] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '100vh', minHeight: 0 }}>
        <h2 className="text-lg text-gray-300 mb-4">Scan Details</h2>
        <div className="bg-[#1C1C1C] p-4 rounded-lg text-gray-300">
          {scanDetails && scanDetails.project ? (
            <pre className="whitespace-pre-wrap">
              <strong>Username:</strong> {scanDetails.username}<br/>
              <strong>Project:</strong> {scanDetails.project.projectName}<br/>
              <strong>Timestamp:</strong> {new Date(scanDetails.timestamp).toLocaleString()}
              <br/>
              <br/>
              <strong>Vulnerabilities Found and Language Statistics:</strong><br/>
              {formatScanDetails()}
            </pre>
          ) : (
            <p>Select a project and scan to view details</p>
          )}
        </div>
        {scanDetails && (
          <button
            className="mt-4 p-2 bg-[#A8C5DA] hover:bg-black hover:text-white text-black rounded transition duration-300"
            onClick={handleDownloadReport}
          >
            Download Report
          </button>
        )}
      </section>
    </div>
  );
};

export default ReportDetails;