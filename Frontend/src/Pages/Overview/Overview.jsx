import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Overview = () => {
  const [scanOption, setScanOption] = useState('github');
  const [url, setUrl] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);
  const [localItems, setLocalItems] = useState([]);
  const [numFiles, setNumFiles] = useState(0);
  const [repoInfo, setRepoInfo] = useState({
    Java: 0,
    Python: 0,
    HTML: 0,
    JavaScript: 0,
  });
  const [scanStats, setScanStats] = useState({ totalFiles: 0, filesWithPII: 0 });
  const [results, setResults] = useState({});
  const [repoDetails, setRepoDetails] = useState({ owner: '', repo: '' });
  const [projectName, setProjectName] = useState('');
  const [localDirectoryPath, setLocalDirectoryPath] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanDone, setScanDone] = useState(false);

  const generateColors = (count) => {
    const hueStep = 360 / count;
    return Array.from({ length: count }, (_, i) => {
      const hue = i * hueStep;
      return `hsl(${hue}, 70%, 60%)`;
    });
  };

  const [chartData, setChartData] = useState(() => {
    const initialColors = generateColors(4);
    return {
      labels: ['Java', 'Python', 'HTML', 'JavaScript'],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: initialColors,
          hoverBackgroundColor: initialColors
        }
      ]
    };
  });

  useEffect(() => {
    const topLanguages = Object.entries(repoInfo)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const colors = generateColors(topLanguages.length);

    setChartData({
      labels: topLanguages.map(([lang]) => lang),
      datasets: [{
        data: topLanguages.map(([, value]) => typeof value === 'number' ? value : parseFloat(value)),
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }]
    });
  }, [repoInfo]);

  const handleScanClick = async () => {
    if (scanOption === 'github') {
      try {
        const response = await fetch('http://localhost:3000/github-repo-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(repoDetails),
        });

        const scanResponse = await fetch('http://localhost:3000/scan-github', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            owner: repoDetails.owner,
            repo: repoDetails.repo,
            regexPairs: Object.fromEntries(keyValuePairs.map(pair => [pair.key, pair.value]))
          }),
        });

        if (!response.ok || !scanResponse.ok) {
          throw new Error('Failed to fetch repository stats or scan data');
        }

        const data = await response.json();
        const scandata = await scanResponse.json();

        setStatsData(data);
        setScanData(scandata);
        setRepoInfo(data);
        setResults(scandata);
        setNumFiles(Object.keys(scandata).length);
        setScanDone(true);

        const topLanguages = Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        const colors = generateColors(topLanguages.length);

        setChartData({
          labels: topLanguages.map(([lang]) => lang),
          datasets: [{
            data: topLanguages.map(([, value]) => value),
            backgroundColor: colors,
            hoverBackgroundColor: colors
          }]
        });
      } catch (error) {
        console.error('Error during GitHub scan:', error);
        alert('Failed to scan GitHub repository. Please try again.');
      }
    } else if (scanOption === 'local') {
      try {
        if (!localDirectoryPath) {
          throw new Error('No directory selected');
        }

        const statsResponse = await fetch('http://localhost:3000/local-directory-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ directoryPath: localDirectoryPath }),
        });

        const scanResponse = await fetch('http://localhost:3000/scan-directory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            directoryPath: localDirectoryPath,
            regexPairs: Object.fromEntries(keyValuePairs.map(pair => [pair.key, pair.value]))
          }),
        });

        if (!statsResponse.ok || !scanResponse.ok) {
          throw new Error('Failed to fetch local directory stats or scan data');
        }

        const statsData = await statsResponse.json();
        const scanData = await scanResponse.json();

        setStatsData(statsData);
        setScanData(scanData);
        setRepoInfo(statsData);

        const processedResults = Object.entries(scanData).reduce((acc, [piiType, files]) => {
          Object.entries(files).forEach(([filePath, piiInstances]) => {
            if (!acc[filePath]) {
              acc[filePath] = 0;
            }
            acc[filePath] += piiInstances.length;
          });
          return acc;
        }, {});

        setResults(processedResults);
        setNumFiles(Object.keys(scanData).reduce((sum, key) => sum + Object.keys(scanData[key]).length, 0));
        setScanDone(true);

        const topLanguages = Object.entries(statsData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        const colors = generateColors(topLanguages.length);

        setChartData({
          labels: topLanguages.map(([lang]) => lang),
          datasets: [{
            data: topLanguages.map(([, value]) => value),
            backgroundColor: colors,
            hoverBackgroundColor: colors
          }]
        });
      } catch (error) {
        console.error('Error during local directory scan:', error);
        alert('Failed to scan local directory. Please try again.');
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!projectName) {
      alert('Please enter a project name');
      return;
    }

    if (!statsData || !scanData) {
      alert('Please perform a scan before generating a report');
      return;
    }

    const reportData = {
      statsData,
      scanData
    };

    try {
      const response = await fetch('http://localhost:3000/createReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          username: 'hardcodeduser', // Hardcoded username as requested
          reportData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      console.log('Report generated:', data);
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const handleAddKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const handleRemoveKeyValuePair = (index) => {
    if (keyValuePairs.length > 1) {
      const newKeyValuePairs = keyValuePairs.filter((_, idx) => idx !== index);
      setKeyValuePairs(newKeyValuePairs);
    }
  };

  const handleKeyValuePairChange = (index, field, value) => {
    const newKeyValuePairs = keyValuePairs.map((pair, idx) =>
      idx === index ? { ...pair, [field]: value } : pair
    );
    setKeyValuePairs(newKeyValuePairs);
  };

  return (
    <div className="bg-[#1C1C1C] text-white min-h-screen p-8 w-full overflow-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-[#2C2D2F] rounded-lg p-6 flex-1">
          <h2 className="text-xl mb-4 text-gray-300">Input Information</h2>
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-[#282828] text-white rounded-lg py-2 px-4 mb-4 w-full focus:outline-none"
          />
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setScanOption('github')}
              className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-2 px-4 rounded transition duration-300 ${
                scanOption === 'github' ? 'bg-gray-700' : ''
              }`}            >
              GitHub
            </button>
            <button
              onClick={() => setScanOption('local')}
              className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-2 px-4 rounded transition duration-300 ${
                scanOption === 'local' ? 'bg-gray-700' : ''
              }`}            >
              Local
            </button>
          </div>
          {scanOption === 'github' ? (
            <>
              <input
                type="text"
                placeholder="GitHub Owner"
                value={repoDetails.owner}
                onChange={(e) => setRepoDetails({ ...repoDetails, owner: e.target.value })}
                className="bg-[#282828] text-white rounded-lg py-2 px-4 mb-4 w-full focus:outline-none"
              />
              <input
                type="text"
                placeholder="GitHub Repo"
                value={repoDetails.repo}
                onChange={(e) => setRepoDetails({ ...repoDetails, repo: e.target.value })}
                className="bg-[#282828] text-white rounded-lg py-2 px-4 mb-4 w-full focus:outline-none"
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="Local Directory Path"
              value={localDirectoryPath}
              onChange={(e) => setLocalDirectoryPath(e.target.value)}
                className="bg-[#282828] text-white rounded-lg py-4 px-4 w-full mb-2 focus:outline-none"
            />
          )}
          <div className="mb-4">
            <h3 className="text-lg mb-2 text-gray-300">Key-Value Pairs for Regex</h3>
            {keyValuePairs.map((pair, index) => (
              <div key={index} className="flex mb-2 space-x-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={pair.key}
                  onChange={(e) => handleKeyValuePairChange(index, 'key', e.target.value)}
                  className="bg-[#282828] text-white rounded-lg py-2 px-4 flex-1 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={pair.value}
                  onChange={(e) => handleKeyValuePairChange(index, 'value', e.target.value)}
                  className="bg-[#282828] text-white rounded-lg py-2 px-4 flex-1 focus:outline-none"
                />
                <button
                  onClick={() => handleRemoveKeyValuePair(index)}
                  className="bg-[#282828] hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddKeyValuePair}
                className="bg-[#282828] hover:bg-green-700 text-white py-2 px-4 rounded mt-2"
            >
              Add Key-Value Pair
            </button>
          </div>
          <button
            onClick={handleScanClick}
            className="bg-[#A8C5DA] hover:bg-black hover:text-white text-black py-3 px-6 rounded-lg w-64 transition duration-300"
            >
            Scan
          </button>
        </div>
        {scanDone && (
          <div className="bg-[#2C2D2F] rounded-lg p-6 flex-1">
            <h2 className="text-xl mb-4 text-gray-300">Repository Overview</h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="space-y-2 text-center md:text-left">
                <p>Total Files Scanned: {numFiles}</p>
                <p>Files with PII: {Object.keys(results).length}</p>
              </div>
              <div className="w-64 h-64">
                <Doughnut data={chartData} />
              </div>
            </div>
            <button
              onClick={handleGenerateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
