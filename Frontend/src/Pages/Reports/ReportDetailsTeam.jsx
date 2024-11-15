import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import EmailModal from '../../components/EmailModal';
import { MdDelete, MdKeyboardArrowDown } from 'react-icons/md';

const ReportDetailsTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [scans, setScans] = useState([]);
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

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchScans();
    }
  }, [selectedMember]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team/members');
      setTeamMembers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch team members');
      setLoading(false);
    }
  };

  const fetchScans = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedMember === 'all') {
        response = await api.get('/getAllScans');
      } else {
        response = await api.get(`/getUserScans/${selectedMember}`);
      }
      
      setScans(response.data);
      setSelectedScanId(null);
      setScanDetails(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError('Failed to fetch scans');
      setLoading(false);
    }
  };

  const fetchScanDetails = async (scanId) => {
    try {
      setLoading(true);
      const response = await api.get(`/getReport/${scanId}`);
      setScanDetails(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scan details:', err);
      setError('Failed to fetch scan details');
      setLoading(false);
    }
  };

  const formatScanDetails = () => {
    if (!scanDetails || !scanDetails.reportData) {
      return 'Error: Scan details not available';
    }

    let formattedDetails = '';
    formattedDetails += `Scan Type: ${scanDetails.scanType}\n`;
    formattedDetails += `Username: ${scanDetails.username}\n`;
    formattedDetails += `Project: ${scanDetails.project.projectName}\n`;
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

  const formatDynamicScanResults = (reportData) => {
    let formattedDetails = 'Dynamic Scan Results:\n';
    formattedDetails += 'Vulnerabilities:\n';
  
    if (reportData.vulnerabilities && Array.isArray(reportData.vulnerabilities)) {
      reportData.vulnerabilities.forEach((vulnerability, index) => {
        formattedDetails += `${index + 1}:\n`;
        Object.entries(vulnerability).forEach(([key, value]) => {
          formattedDetails += `  ${key}: ${value}\n`;
        });
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
  
    return formattedDetails;
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
      await api.post('/email', {
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

  const handleDeleteScan = async (scanId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      try {
        await api.delete(`/deleteScan/${scanId}`);
        setScans(scans.filter(scan => scan._id !== scanId));
        setSelectedScanId(null);
        setScanDetails(null);
      } catch (error) {
        console.error('Error deleting scan:', error);
        alert('Failed to delete scan. Please try again.');
      }
    }
  };

  const renderScans = () => {
    return scans.map(scan => (
      <li
        key={scan._id}
        className={`cursor-pointer hover:text-white p-2 rounded flex justify-between items-center ${
          scan._id === selectedScanId ? 'bg-[#121212] text-white' : 'text-gray-500'
        }`}
        onClick={() => {
          setSelectedScanId(scan._id);
          fetchScanDetails(scan._id);
        }}
      >
        <div>
          <span className="mr-2">[{scan.scanType}]</span>
          <span className="mr-2">User: {scan.username}</span>
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
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full block p-8">
          <h1 className="text-lg text-[#a4ff9e]">Scanner</h1>
          <h1 className="text-4xl font-bold text-white">Member Reports</h1>
        </div>

        <div className="flex w-[95%] h-full mx-auto">
          <section className="w-1/3 bg-[#2C2D2F] text-white p-6 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg" style={{ maxHeight: '100vh', minHeight: 0 }}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Member</label>
              <div className="relative">
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full bg-[#1C1C1C] text-white p-2 rounded appearance-none cursor-pointer"
                >
                  <option value="">Select a member...</option>
                  {/* <option value="all">All Members</option> */}
                  {teamMembers.map(member => (
                    <option key={member._id} value={member._id}>{member.username}</option>
                  ))}
                </select>
                <MdKeyboardArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {scans.length > 0 && (
              <div>
                <h2 className="text-xl mb-4 text-grey-300">Scans</h2>
                <ul className="space-y-2">{renderScans()}</ul>
              </div>
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

export default ReportDetailsTeam;