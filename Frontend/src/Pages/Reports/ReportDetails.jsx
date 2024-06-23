import React, { useState, useEffect } from 'react';

// Sample API responses for testing
const sampleApiResponses = {
  scanGithub: {
    "Test/Test.java": {
      "ssn": ["987-65-4321"]
    }
  },
  scanDirectory: {
    "ssn": {
      "/home/ayush/Progs/Cognizant/codebase/inner directory/vul.txt": ["777-45-6789"],
      "/home/ayush/Progs/Cognizant/codebase/main.py": ["123-45-6789", "987-65-4321"],
      "/home/ayush/Progs/Cognizant/codebase/user_data.py": ["123-45-6789", "987-65-4321"]
    },
    "creditCard": {
      "/home/ayush/Progs/Cognizant/codebase/inner directory/vul.txt": ["1234567890123456", "1234567890123456"],
      "/home/ayush/Progs/Cognizant/codebase/user_data.py": ["1234567890123456"]
    }
  },
  githubRepoStats: {
    "TypeScript": 89.50732772061116,
    "JavaScript": 5.922312797897456,
    "CSS": 3.7551784043832686,
    "HTML": 0.8151810771081118
  },
  localDirectoryPath: {
    "1": 0.00263431351961832,
    "": 16.19034626259665,
    "sample": 0.012745836434859166,
    "js": 41.41721543622033,
    "json": 3.3355737594382844,
    "mjs": 0.9202665720843901,
    "ts": 10.768851287553764,
    "map": 20.98794173298671,
    "md": 2.0029862839043013,
    "yml": 0.008903381606553146,
    "gz": 0.005134328702942372,
    "txt": 0.03730231441216397,
    "cjs": 0.5168620994724071,
    "markdown": 0.015811318297316974,
    "bnf": 0.0013462456707069063,
    "html": 0.00023597359494620246,
    "flow": 0.27734183226852244,
    "mts": 0.055196616216943856,
    "tsx": 0.04930815070250291,
    "snap": 0.03450597294025541,
    "cts": 0.0488856818470347,
    "node": 2.943184468992235,
    "mdx": 0.24615960722205996,
    "jst": 0.027085310212546253,
    "def": 0.009113800457346189,
    "closure-compiler": 0.006175548597693472,
    "esprima": 0.0006693168096285144,
    "bsd": 0.0013386336192570288,
    "php": 0.0025081709527346356,
    "pyc": 0.0036652027731160154,
    "py": 0.0032666575079188576,
    "coffee": 5.437179607055356e-7,
    "css": 0.009451449310944325,
    "lock": 0.056522744323104654,
    "applescript": 0.0014631450322585963
  }
};

const reportMetadata = {
  1: { username: 'ayushsingh01042003', repoScanned: 'DSA', timestamp: '2024-06-16 22:21:04', path: '/path/to/repo1' },
  2: { username: 'ayushsingh01042003', repoScanned: 'Cognizant/codebase', timestamp: '2024-06-17 14:12:30', path: '/home/ayush/Progs/Cognizant/codebase' },
  3: { username: 'ayushsingh01042003', repoScanned: 'Chat-app', timestamp: '2024-06-18 10:45:20', path: '/path/to/repo3' },
  4: { username: 'ayushsingh01042003', repoScanned: 'chat-app', timestamp: '2024-06-19 09:30:15', path: '/home/ayush/Progs/chat-app/' }
};

const ReportDetails = ({ selectedReportId, onReportClick }) => {
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    if (selectedReportId === 1) {
      setReportDetails(sampleApiResponses.scanGithub);
    } else if (selectedReportId === 2) {
      setReportDetails(sampleApiResponses.scanDirectory);
    } else if (selectedReportId === 3) {
      setReportDetails(sampleApiResponses.githubRepoStats);
    } else if (selectedReportId === 4) {
      setReportDetails(sampleApiResponses.localDirectoryPath);
    }
  }, [selectedReportId]);

  const formatReportDetails = () => {
    if (!reportDetails) return '';

    let formattedDetails = '';

    if (selectedReportId === 1) {
      formattedDetails = Object.entries(reportDetails).map(([file, vulnerabilities]) => {
        return `File: ${file}\n${Object.entries(vulnerabilities).map(([type, instances]) => `  ${type.toUpperCase()}: ${instances.join(', ')}`).join('\n')}`;
      }).join('\n\n');
    } else if (selectedReportId === 2) {
      formattedDetails = Object.entries(reportDetails).map(([type, files]) => {
        return `${type.toUpperCase()}:\n${Object.entries(files).map(([file, instances]) => `  Path: ${file}\n  Instances: ${instances.join(', ')}`).join('\n')}`;
      }).join('\n\n');
    } else if (selectedReportId === 3) {
      formattedDetails = Object.entries(reportDetails).map(([language, percentage]) => {
        return `${language}: ${percentage}%`;
      }).join('\n');
    } else if (selectedReportId === 4) {
      formattedDetails = Object.entries(reportDetails).map(([extension, size]) => {
        return `.${extension}: ${size}`;
      }).join('\n');
    }

    return formattedDetails;
  };

  const handleDownloadReport = () => {
    const metadata = reportMetadata[selectedReportId];
    const formattedDetails = `
Username: ${metadata.username}
Repository Scanned: ${metadata.repoScanned}
Timestamp: ${metadata.timestamp}

Vulnerabilities Found:

${formatReportDetails()}
`;
    const data = new Blob([formattedDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${selectedReportId}.txt`;
    a.click();
  };

  return (
    <div className="flex w-full h-full">
      {/* Recent Scans */}
      <section className="w-1/3 bg-[#1C1C1C] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '100vh', minHeight: 0 }}>
        <h2 className="text-lg text-gray-300 mb-4">Recent Scans</h2>
        <ul>
          {[1, 2, 3, 4].map(id => (
            <li
              key={id}
              className={`mb-2 cursor-pointer hover:text-white p-2 rounded ${id === selectedReportId ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              onClick={() => onReportClick(id)}
            >
              <div>Report {id}</div>
              <div className="text-sm text-gray-500">{reportMetadata[id].path}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Separator Line */}
      <div className="w-px bg-gray-600"></div>

      {/* Report Details */}
      <section className="flex-1 bg-[#2C2C2E] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{ maxHeight: '100vh', minHeight: 0 }}>
        <h2 className="text-lg text-gray-300 mb-4">Report {selectedReportId}</h2>
        <div className="bg-[#1C1C1C] p-4 rounded-lg text-gray-300">
          {reportDetails ? (
            <pre className="whitespace-pre-wrap">
              <strong>Username:</strong> {reportMetadata[selectedReportId].username}<br/>
              <strong>Repository Scanned:</strong> {reportMetadata[selectedReportId].repoScanned}<br/>
              <strong>Timestamp:</strong> {reportMetadata[selectedReportId].timestamp}
              <br/>
              <br/>
              <strong>Vulnerabilities Found:</strong><br/>
              {formatReportDetails()}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <button
          className="mt-4 p-2 bg-[#A8C5DA] hover:bg-black hover:text-white text-black rounded transition duration-300"
          onClick={handleDownloadReport}
        >
          Download Report
        </button>
      </section>
    </div>
  );
};

export default ReportDetails;