import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'daisyui/dist/full.css';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Report = ({ data }) => {
  const chartRef = useRef();

  const handleDownload = async () => {
    window.print();
  };

  // Example language data
  const languages = {
    JavaScript: 60,
    Python: 20,
    Java: 10,
    CSharp: 5,
    Other: 5,
  };

  const chartData = {
    datasets: [{
      data: Object.values(languages),
      backgroundColor: ['#4FD1C5', '#F56565', '#F6E05E', '#68D391', '#D53F8C'],
    }],
    labels: Object.keys(languages),
  };

  // Dummy data
  const dummyData = {
    owner: "John Doe",
    repo: "example-repo",
    severityLevel: "High",
    errorsFound: 25,
    filesScanned: 1000,
    linesScanned: 50000,
    directoryInfo: "/src",
    scannedExtensions: ".js, .jsx",
    sensitiveInfo: "API Key",
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-lg max-w-7xl w-full printable">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Code Analysis Report</h1>
          <p className="text-gray-400">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary and Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Summary */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="mb-4 text-gray-300">
              <p className="font-semibold">Repository Information:</p>
              <ul className="list-disc ml-6">
                <li><strong>Owner:</strong> {dummyData.owner}</li>
                <li><strong>Repo:</strong> {dummyData.repo}</li>
              </ul>
            </div>
            <div className="mb-4 text-gray-300">
              <p className="font-semibold">Severity Level:</p>
              <p>{dummyData.severityLevel}</p>
            </div>
            <div className="mb-4 text-gray-300">
              <p className="font-semibold">Errors Found:</p>
              <p>{dummyData.errorsFound}</p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Detailed Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
              <div>
                <p className="font-semibold">Files Scanned:</p>
                <p>{dummyData.filesScanned}</p>
              </div>
              <div>
                <p className="font-semibold">Lines Scanned:</p>
                <p>{dummyData.linesScanned}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Directory Info:</p>
                <p>{dummyData.directoryInfo}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Scanned file extensions:</p>
                <p>{dummyData.scannedExtensions}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Sensitive Information found:</p>
                <p>{dummyData.sensitiveInfo}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Results Overview */}
        <div className="mt-8 bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Results Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <Doughnut ref={chartRef} data={chartData} />
            </div>
            {/* Results Analysis */}
            <div className="bg-gray-800 p-6 rounded-lg text-gray-300">
              <h3 className="text-lg font-bold mb-4">Results Analysis</h3>
              <div className="mb-4">
                <p className="font-semibold">Issues Found:</p>
                <ul className="list-disc ml-6">
                  <li>Memory Leaks</li>
                  <li>Performance Bottlenecks</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Suggestions:</p>
                <ul className="list-disc ml-6">
                  <li>Code Refactoring</li>
                  <li>Optimization Techniques</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Security Vulnerabilities:</p>
                <ul className="list-disc ml-6">
                  <li>XSS Vulnerabilities</li>
                  <li>Authentication Issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
          >
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default Report;
