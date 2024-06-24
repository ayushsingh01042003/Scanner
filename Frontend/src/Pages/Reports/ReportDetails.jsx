import React, { useState, useEffect } from 'react';

// Updated dummy data
const sampleReports = [
  {
    id: 1,
    username: 'ayushsingh01042003',
    repositoryScanned: 'DSA',
    timestamp: '2024-06-16 22:21:04',
    reportData: {
      "ssn": {
        "/home/ayush/DSA/test.java": ["123-45-6789", "987-65-4321"],
        "/home/ayush/DSA/main.py": ["456-78-9012"]
      },
      "creditCard": {
        "/home/ayush/DSA/user_data.py": ["1234567890123456", "9876543210987654"]
      }
    },
    stats: {
      "Java": 60.5,
      "Python": 39.5
    }
  },
  {
    id: 2,
    username: 'ayushsingh01042003',
    repositoryScanned: 'Cognizant/codebase',
    timestamp: '2024-06-17 14:12:30',
    reportData: {
      "ssn": {
        "/home/ayush/Cognizant/codebase/vul.txt": ["777-45-6789"],
        "/home/ayush/Cognizant/codebase/main.py": ["123-45-6789", "987-65-4321"]
      },
      "creditCard": {
        "/home/ayush/Cognizant/codebase/user_data.py": ["1234567890123456"]
      }
    },
    stats: {
      "Python": 80.2,
      "JavaScript": 19.8
    }
  },
  {
    id: 3,
    username: 'ayushsingh01042003',
    repositoryScanned: 'Chat-app',
    timestamp: '2024-06-18 10:45:20',
    reportData: {
      "emailAddress": {
        "/src/users.js": ["user@example.com", "admin@chatapp.com"]
      }
    },
    stats: {
      "JavaScript": 70.5,
      "HTML": 20.3,
      "CSS": 9.2
    }
  }
];

const ReportDetails = () => {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    if (selectedReportId) {
      setReportDetails(sampleReports.find(report => report.id === selectedReportId));
    }
  }, [selectedReportId]);

  const formatReportDetails = () => {
    if (!reportDetails) return '';

    let formattedDetails = Object.entries(reportDetails.reportData).map(([type, files]) => {
      return `${type.toUpperCase()}:\n${Object.entries(files).map(([file, instances]) => `  Path: ${file}\n  Instances: ${instances.join(', ')}`).join('\n')}`;
    }).join('\n\n');

    formattedDetails += '\n\nLanguage Statistics:\n';
    formattedDetails += Object.entries(reportDetails.stats).map(([language, percentage]) => {
      return `${language}: ${percentage.toFixed(2)}%`;
    }).join('\n');

    return formattedDetails;
  };

  const handleDownloadReport = () => {
    if (!reportDetails) return;

    const formattedDetails = `
Username: ${reportDetails.username}
Repository Scanned: ${reportDetails.repositoryScanned}
Timestamp: ${reportDetails.timestamp}

${formatReportDetails()}
`;
    const data = new Blob([formattedDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${reportDetails.id}.txt`;
    a.click();
  };

  return (
    <div className="flex w-full h-full">
      <section className="w-1/3 bg-[#1C1C1C] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '100vh', minHeight: 0 }}>
        <h2 className="text-lg text-gray-300 mb-4">Recent Scans</h2>
        <ul>
          {sampleReports.map(report => (
            <li
              key={report.id}
              className={`mb-2 cursor-pointer hover:text-white p-2 rounded ${report.id === selectedReportId ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedReportId(report.id)}
            >
              <div>{report.repositoryScanned}</div>
              <div className="text-sm text-gray-500">{report.timestamp}</div>
            </li>
          ))}
        </ul>
      </section>

      <div className="w-px bg-gray-600"></div>

      <section className="flex-1 bg-[#2C2C2E] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '100vh', minHeight: 0 }}>
        <h2 className="text-lg text-gray-300 mb-4">Report Details</h2>
        <div className="bg-[#1C1C1C] p-4 rounded-lg text-gray-300">
          {reportDetails ? (
            <pre className="whitespace-pre-wrap">
              <strong>Username:</strong> {reportDetails.username}<br/>
              <strong>Repository Scanned:</strong> {reportDetails.repositoryScanned}<br/>
              <strong>Timestamp:</strong> {reportDetails.timestamp}
              <br/>
              <br/>
              <strong>Vulnerabilities Found and Language Statistics:</strong><br/>
              {formatReportDetails()}
            </pre>
          ) : (
            <p>Select a report to view details</p>
          )}
        </div>
        {reportDetails && (
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