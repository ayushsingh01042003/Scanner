import React, { useState, useEffect, useRef, Suspense, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { infinity } from 'ldrs'
import { AuthContext } from '../Auth/AuthContext';

infinity.register()

ChartJS.register(ArcElement, Tooltip, Legend);

const Loading = () => (
  <div className="flex justify-center items-center h-full w-full">
    <l-infinity
      size="120"
      stroke="6"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="1.3"
      color="#a4ff9e"
    ></l-infinity>
  </div>
);

const Overview = () => {
  const [scanOption, setScanOption] = useState('github');
  const [url, setUrl] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);
  const [scanReportData, setScanReportData] = useState({ keyCounts: {}, keyPercentages: {} });
  const [numFiles, setNumFiles] = useState(0);
  const [repoInfo, setRepoInfo] = useState({
  });
  const [results, setResults] = useState({});
  const [repoDetails, setRepoDetails] = useState({ owner: '', repo: '' });
  const [projectName, setProjectName] = useState('');
  const [localDirectoryPath, setLocalDirectoryPath] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [scanData, setScanData] = useState(null);
  const { username } = useContext(AuthContext);

  const [indexing, setIndexing] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPII, setTotalPII] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }]
  });

  const generateColors = (count) => {
    const hueStep = 360 / count;
    return Array.from({ length: count }, (_, i) => {
      const hue = i * hueStep;
      return `hsl(${hue}, 70%, 60%)`;
    });
  };

  const debounceTimeouts = useRef({});

  const handleKeyValuePairChange = (index, keyOrValue, newValue) => {
    const updatedKeyValuePairs = [...keyValuePairs];
    updatedKeyValuePairs[index] = {
      ...updatedKeyValuePairs[index],
      [keyOrValue]: newValue
    };
    setKeyValuePairs(updatedKeyValuePairs);

    if (keyOrValue === 'key') {
      if (debounceTimeouts.current[index]) {
        clearTimeout(debounceTimeouts.current[index]);
      }
      debounceTimeouts.current[index] = setTimeout(async () => {
        if (newValue !== '') {
          try {
            const response = await fetch('https://scanx-3b1r.onrender.com/regexValue', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: newValue })
            });

            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            const updatedPairs = [...keyValuePairs];
            updatedPairs[index] = { ...updatedPairs[index], key: newValue, value: data };
            setKeyValuePairs(updatedPairs);
          } catch (error) {
            console.error('API Error:', error);
          }
        }
      }, 1000);
    }
  };

  const handleKeyValuePairChangeSplunk = (index, keyOrValue, newValue) => {
    const updatedKeyValuePairs = [...keyValuePairs];
    updatedKeyValuePairs[index] = {
      ...updatedKeyValuePairs[index],
      [keyOrValue]: newValue
    };
    setKeyValuePairs(updatedKeyValuePairs);

    if (keyOrValue === 'key') {
      if (debounceTimeouts.current[index]) {
        clearTimeout(debounceTimeouts.current[index]);
      }
      debounceTimeouts.current[index] = setTimeout(async () => {
        if (newValue !== '') {
          try {
            const response = await fetch('https://scanx-3b1r.onrender.com/regexValue-splunk', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: newValue })
            });

            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            const updatedPairs = [...keyValuePairs];
            updatedPairs[index] = { ...updatedPairs[index], key: newValue, value: data };
            setKeyValuePairs(updatedPairs);
          } catch (error) {
            console.error('API Error:', error);
          }
        }
      }, 1000);
    }
  };

  
  const [aiMessage, setAiMessage] = useState('');

  // for normal static scans
  const handleAiMessageChange = (e) => {
    const newValue = e.target.value;
    setAiMessage(newValue);
  
    if (debounceTimeouts.current.aiMessage) {
      clearTimeout(debounceTimeouts.current.aiMessage);
    }
  
    debounceTimeouts.current.aiMessage = setTimeout(async () => {
      if (newValue !== '') {
        try {
          const response = await fetch('https://scanx-3b1r.onrender.com/mistral-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newValue }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to get response from AI chat');
          }
  
          const data = await response.json();
  
          if (typeof data.pii === 'object' && data.pii !== null) {
            const updatedKeyValuePairs = Object.entries(data.pii).map(([key, value]) => ({
              key,
              value: value.replace(/^\^|\$$/g, '')
            }));
            setKeyValuePairs(updatedKeyValuePairs);
          } else {
            console.error('Unexpected PII data format:', data.pii);
          }
        } catch (error) {
          console.error('Error in AI chat:', error);
        }
      }
    }, 1000);
  };

  // for dynamic scans splunk based.
  const handleAiMessageChangeSplunk = (e) => {
    const newValue = e.target.value;
    setAiMessage(newValue);
  
    if (debounceTimeouts.current.aiMessage) {
      clearTimeout(debounceTimeouts.current.aiMessage);
    }
  
    debounceTimeouts.current.aiMessage = setTimeout(async () => {
      if (newValue !== '') {
        try {
          const response = await fetch('https://scanx-3b1r.onrender.com/mistral-chat-splunk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newValue }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to get response from AI chat');
          }
  
          const data = await response.json();
  
          if (typeof data.pii === 'object' && data.pii !== null) {
            const updatedKeyValuePairs = Object.entries(data.pii).map(([key, value]) => ({
              key,
              value: value.replace(/^\^|\$$/g, '')
            }));
            setKeyValuePairs(updatedKeyValuePairs);
          } else {
            console.error('Unexpected PII data format:', data.pii);
          }
        } catch (error) {
          console.error('Error in AI chat:', error);
        }
      }
    }, 1000);
  };

 
  useEffect(() => {
    if (scanOption === 'dynamic' && statsData) {
      const logLevels = ['info', 'warn', 'error', 'debug'];
      const data = logLevels.map(level => statsData[`${level}Count`] || 0);
      const colors = generateColors(logLevels.length);
  
      setChartData({
        labels: logLevels.map(level => level.charAt(0).toUpperCase() + level.slice(1)),
        datasets: [{
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }]
      });
    } else if (Object.values(repoInfo).length > 0) {
      const topLanguages = Object.entries(repoInfo)
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
    }
  }, [scanOption, repoInfo, statsData]);

  useEffect(() => {

    if (Object.values(repoInfo).length === 0) {
      const topLanguages = Object.entries(repoInfo)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const colors = generateColors(topLanguages.length);

      setChartData({
        labels: scanOption === 'dynamic'
          ? ['Total Lines']
          : topLanguages.map(([lang]) => lang),
        datasets: [{
          data: scanOption === 'dynamic'
            ? [statsData.totalLines]
            : topLanguages.map(([, value]) => value),
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }]
      });
    }
  }, [repoInfo]);

  useEffect(() => {
    const fetchScanReportData = async () => {
      try {
        const response = await fetch('https://scanx-3b1r.onrender.com/api/scanReports');
        if (!response.ok) {
          throw new Error('Failed to fetch scan report data');
        }
        const data = await response.json();
        setScanReportData(data);
      } catch (error) {
        console.error('Error fetching scan report data:', error);
      }
    };

    fetchScanReportData();
  }, []);

  const handleScanClick = async () => {
    setIsLoading(true);
    if (scanOption === 'github') {
      try {
        const response = await fetch('https://scanx-3b1r.onrender.com/github-repo-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(repoDetails),
        });

        const scanResponse = await fetch('https://scanx-3b1r.onrender.com/scan-github', {
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
      finally {
        setIsLoading(false);
      }
    } else if (scanOption === 'local') {
      try {
        if (!localDirectoryPath) {
          throw new Error('No directory selected');
        }

        const statsResponse = await fetch('https://scanx-3b1r.onrender.com/local-directory-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ directoryPath: localDirectoryPath }),
        });

        const scanResponse = await fetch('https://scanx-3b1r.onrender.com/scan-directory', {
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
      finally {
        setIsLoading(false);
      }
    }
    else if (scanOption === 'dynamic') {
      try {
        setIsLoading(true);
        console.log('Sending request to /splunk-search');
        const scanResponse = await fetch('https://scanx-3b1r.onrender.com/splunk-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            index: indexing,
            fieldRegexPairs: Object.fromEntries(keyValuePairs.map(pair => [pair.key, pair.value]))
          }),
        });
        if (!scanResponse.ok) {
          throw new Error('Failed to fetch dynamic log stats or scan data');
        }
        const scanData = await scanResponse.json();
        setScanData(scanData);
    
        const processedResults = {};
        let totalPIICount = 0;
        scanData.results.forEach(result => {
          const filePath = result.filePath || result.source;
          if (!processedResults[filePath]) {
            processedResults[filePath] = 0;
          }
          const piiCount = Object.keys(result).filter(key =>
            key !== 'filePath' && key !== 'source' && result[key]
          ).length;
          processedResults[filePath] += piiCount;
          totalPIICount += piiCount;
        });
        setResults(processedResults);
        setTotalPII(totalPIICount);
        setNumFiles(Object.keys(processedResults).length);
    
        // Update chart data
        const chartLabels = Object.keys(processedResults);
        const chartDataValues = Object.values(processedResults);
        const colors = generateColors(chartLabels.length);
        setChartData({
          labels: chartLabels,
          datasets: [{
            data: chartDataValues,
            backgroundColor: colors,
            hoverBackgroundColor: colors
          }]
        });
    
        // Set statsData for dynamic scan
        setStatsData({
          totalPII: totalPIICount,
          numFiles: Object.keys(processedResults).length,
          results: processedResults,
          chartData: {
            labels: chartLabels,
            datasets: [{
              data: chartDataValues,
              backgroundColor: colors,
              hoverBackgroundColor: colors
            }]
          }
        });
    
        console.log('Dynamic scan completed. scanData:', scanData);
        console.log('Dynamic scan completed. statsData:', statsData);
    
      } catch (error) {
        console.error('Error during dynamic log scan:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const InfoButton = ({ pii }) => {
    const scanCount = scanReportData.keyCounts[pii.key] || 0;
    const usagePercentage = scanReportData.keyPercentages[pii.key] || '0%';

    return (
      <div className="relative inline-block group">
        <button className="bg-[#a4ff9e] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-black hover:text-[#a4ff9e] transition-colors duration-300">
          i
        </button>
        <div className="absolute z-10 w-64 p-3 bg-[#2C2D2F] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -top-2 left-8 fade-in">
          <p className="mb-1"><span className="font-bold">Usage:</span> {usagePercentage}</p>
          <p><span className="font-bold">Total scans:</span> {scanCount}</p>
        </div>
      </div>
    );
  };

  const handleGenerateReport = async () => {
    if (!projectName) {
      alert('Please enter a project name');
      return;
    }

    if (!statsData || !scanData) {
      console.error('Stats Data or Scan Data is missing');
      alert('Please perform a scan before generating a report');
      return;
    }
  
    const reportData = {
      scanDetails: scanData,
      stats: statsData,
      logStats: scanOption === 'dynamic' ? statsData : null,
      vulnerabilities: scanOption === 'dynamic' ? scanData.results : null,
    };
    console.log('Report Data:', reportData);

    try {
      const response = await fetch('https://scanx-3b1r.onrender.com/createReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          username: username,
          reportData,
          scanType: scanOption
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
  
      const result = await response.json();
      console.log('Report generation response:', result);
  
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
      const piiToRemove = keyValuePairs[index];
      const scanCount = scanReportData.keyCounts[piiToRemove.key] || 0;
      if (scanCount > 1) {
      
        if (window.confirm(
          `This PII (${piiToRemove.key}) has been used in ${scanCount} scans. Are you sure you want to remove it?`
        )) {
          const newKeyValuePairs = keyValuePairs.filter((_, idx) => idx !== index);
          setKeyValuePairs(newKeyValuePairs);
        }
      } else {
        const newKeyValuePairs = keyValuePairs.filter((_, idx) => idx !== index);
        setKeyValuePairs(newKeyValuePairs);
      }
    }
  };

  return (
    <>
      <div className="bg-[#121212] text-white min-h-screen p-8 w-full overflow-hidden ">
        <h1 className="text-lg text-[#a4ff9e]">Scanner</h1>
        <h1 className="text-4xl font-bold text-white mb-6">Overview</h1>
        {/* buttons */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <button
              className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-12 rounded-2xl transition duration-300 ${scanOption === 'github' ? 'bg-[#2C2D2F]' : ''}`}
              onClick={() => setScanOption('github')}
            >
              GitHub
            </button>
            <button
              className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-9 rounded-2xl transition duration-300 ${scanOption === 'local' ? 'bg-[#2C2D2F]' : ''}`}
              onClick={() => setScanOption('local')}
            >
              Local Directory
            </button>
            <button
              className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-9 rounded-2xl transition duration-300 ${scanOption === 'local' ? 'bg-[#2C2D2F]' : ''}`}
              onClick={() => setScanOption('dynamic')}
            >
              Dynamic
            </button>
          </div>
        </div>

        <div className="flex mb-8">
          {/* inputs */}
          <div className="bg-[#121212] rounded-lg w-[97%] p-6 mx-auto">
            <h2 className="text-xl mb-4 text-grey-300 ">Input Information</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-[#282828] text-white rounded-2xl py-3 px-4 w-full mb-4 focus:outline-none" />

            {scanOption === 'github' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="GitHub Repository URL"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    const match = e.target.value.match(/github\.com\/([^/]+)\/([^/]+)/);
                    if (match) {
                      setRepoDetails({ owner: match[1], repo: match[2] });
                    }
                  }}
                  className="bg-[#282828] text-white rounded-2xl py-3 px-4 w-full mb-2 focus:outline-none"
                />
                <div className="flex items-stretch space-x-4">
                  <input
                    type="text"
                    placeholder="Describe your project for PII detection"
                    value={aiMessage}
                    onChange={handleAiMessageChange}
                    className="bg-[#282828] text-white rounded-2xl py-3 px-3 w-full focus:outline-none"
                  />
                </div>
                {keyValuePairs.map((pair, index) => (
                  <div className="flex flex-col space-y-2 mb-4" key={index}>
                    <div className="flex space-x-2">
                      <InfoButton pii={pair} />
                      <input
                        type="text"
                        placeholder="Key"
                        value={pair.key}
                        onChange={(e) => handleKeyValuePairChange(index, 'key', e.target.value)}
                        className="bg-[#282828] text-white rounded-2xl py-4 px-4 flex-1 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={pair.value}
                        onChange={(e) => handleKeyValuePairChange(index, 'value', e.target.value)}
                        className="bg-[#282828] text-white rounded-2xl py-4 px-4 flex-1 focus:outline-none"
                      />
                      {keyValuePairs.length > 1 && (
                        <button
                          className="bg-[#282828] hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-300"
                          onClick={() => handleRemoveKeyValuePair(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-[#282828] hover:bg-black text-white py-2 px-4 rounded-lg transition duration-300"
                    onClick={handleAddKeyValuePair}
                  >
                    Add Key-Value Pair
                  </button>
                  <button
                    className="bg-[#a4ff9e] hover:bg-black hover:text-[#a4ff9e] text-black py-3 px-6 rounded-lg w-64 transition duration-300 font-bold"
                    onClick={handleScanClick}
                  >
                    Scan
                  </button>
                </div>
              </div>
            )}

            {scanOption === 'local' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter local directory path"
                  value={localDirectoryPath}
                  onChange={(e) => setLocalDirectoryPath(e.target.value)}
                  className="bg-[#282828] text-white rounded-2xl py-3 px-4 w-full mb-2 focus:outline-none"
                />
                <div className="flex items-stretch space-x-4">
                    <input
                      type="text"
                      placeholder="Describe your project for PII detection"
                      value={aiMessage}
                      onChange={handleAiMessageChange}
                      className="bg-[#282828] text-white rounded-2xl py-3 px-3 w-full focus:outline-none"
                    />
                  </div>
                {keyValuePairs.map((pair, index) => (
                  <div className="flex flex-col space-y-2 mb-4" key={index}>
                    <div className="flex space-x-2">
                      <InfoButton pii={pair} />
                      <input
                        type="text"
                        placeholder="Key"
                        value={pair.key}
                        onChange={(e) => handleKeyValuePairChange(index, 'key', e.target.value)}
                        className="bg-[#282828] text-white rounded-2xl py-4 px-4 flex-1 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={pair.value}
                        onChange={(e) => handleKeyValuePairChange(index, 'value', e.target.value)}
                        className="bg-[#282828] text-white rounded-2xl py-4 px-4 flex-1 focus:outline-none"
                      />
                      {keyValuePairs.length > 1 && (
                        <button
                          className="bg-[#282828] hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-300"
                          onClick={() => handleRemoveKeyValuePair(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-[#282828] hover:bg-black text-white py-2 px-4 rounded-lg transition duration-300"
                    onClick={handleAddKeyValuePair}
                  >
                    Add Key-Value Pair
                  </button>
                  <button
                    className="bg-[#a4ff9e] hover:bg-black hover:text-[#a4ff9e] text-black py-3 px-6 rounded-lg w-64 transition duration-300 font-bold whitespace-nowrap"
                    onClick={handleScanClick}
                  >
                    Scan
                  </button>
                </div>
              </div>
            )}

            {scanOption === 'dynamic' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter index"
                  value={indexing}
                  onChange={(e) => setIndexing(e.target.value)}
                  className="bg-[#282828] text-white rounded-2xl py-3 px-4 w-full mb-2 focus:outline-none"
                />
                
                <div className="flex items-stretch space-x-4">
                  <input
                    type="text"
                    placeholder="Describe your project for PII detection"
                    value={aiMessage}
                    onChange={handleAiMessageChangeSplunk}
                    className="bg-[#282828] text-white rounded-2xl py-3 px-3 w-full focus:outline-none"
                  />
                </div>
                {keyValuePairs.map((pair, index) => (
                  <div className="flex flex-col space-y-2 mb-4" key={index}>
                    <div className="flex space-x-2">
                      <InfoButton pii={pair} />
                      <input
                        type="text"
                        placeholder="Key"
                        value={pair.key}
                        onChange={(e) => handleKeyValuePairChangeSplunk(index, 'key', e.target.value)}
                        className="bg-[#282828] text-white rounded-2xl py-4 px-4 flex-1 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={pair.value}
                        onChange={(e) => handleKeyValuePairChange(index, 'value', e.target.value)}
                        className="bg-[#282828] text-white rounded-2xl py-4 px-4 flex-1 focus:outline-none"
                      />
                      {keyValuePairs.length > 1 && (
                        <button
                          className="bg-[#282828] hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-300"
                          onClick={() => handleRemoveKeyValuePair(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-[#282828] hover:bg-black text-white py-2 px-4 rounded-lg transition duration-300"
                    onClick={handleAddKeyValuePair}
                  >
                    Add Key-Value Pair
                  </button>
                  <button
                    className="bg-[#a4ff9e] hover:bg-black hover:text-[#a4ff9e] text-black py-3 px-6 rounded-lg w-64 transition duration-300 font-bold whitespace-nowrap"
                    onClick={handleScanClick}
                  >
                    Scan
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
        <div className="w-[95%] mx-auto" style={{ height: '500px' }}>
      <Suspense fallback={<Loading />}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={`flex ${scanOption === 'dynamic' ? 'flex-col' : 'flex-col md:flex-row'} gap-8`}>
            <div 
              className={`bg-[#2C2D2F] rounded-lg p-6 ${
                scanOption === 'dynamic' ? 'w-full' : 'w-full md:w-[65%]'
              } scrollable scrollbar-thin flex flex-col`} 
              style={{ minHeight: '500px' }}
            >
              <h2 className="text-xl mb-4 text-gray-300">
                {scanOption === 'dynamic' ? 'Log Analysis Results' : 'Results'}
              </h2>
              {scanOption === 'dynamic' && (
                <p className="mb-2">Total Lines Analyzed: {numFiles}</p>
              )}
              {scanOption !== 'dynamic' && (
                <p className="mb-2">Number of Files with PIIs found - {numFiles}</p>
              )}
              <div className="flex-grow overflow-x-auto scrollbar-thin">
                <table className="min-w-full bg-[#2C2D2F] border-collapse border-gray-600 shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-[#2C2D2F] text-gray-300">
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-600 text-left w-3/4">
                        {scanOption === 'dynamic' ? 'Log Entry' : 'File path'}
                      </th>
                      <th className="py-2 px-4 border-b border-gray-600 text-right w-1/4">
                        {scanOption === 'dynamic' ? 'Vulnerabilities' : 'No. of PIIs found'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    {Object.entries(results).map(([key, value]) => {
                      let displayKey = key;
                      let displayValue = value;

                      if (scanOption === 'dynamic') {
                        // For dynamic scans, key is the log entry and value is the vulnerability count
                        displayValue = value;
                      } else {
                        // For other scan types, calculate PII count
                        displayValue = typeof value === 'number' ? value :
                          (Array.isArray(value) ? value.length :
                            (typeof value === 'object' ? Object.values(value).flat().length : 0));
                      }

                      return (
                        <tr key={key}>
                          <td className="py-2 px-4 border-b border-gray-600 text-left">{displayKey}</td>
                          <td className="py-2 px-4 border-b border-gray-600 text-right">{displayValue}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-[#a4ff9e] hover:bg-black hover:text-[#a4ff9e] hover:font-bold font-bold text-[#000000] py-2 px-4 rounded transition duration-300"
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </button>
              </div>
            </div>
            {scanOption !== 'dynamic' && (
              <div className="bg-[#2C2D2F] rounded-lg p-6 w-full md:w-[35%] scrollable scrollbar-thin flex flex-col" style={{ minHeight: '500px' }}>
                <h2 className="text-xl mb-4 text-gray-300">Repository Info</h2>
                <div className="flex flex-grow flex-col">
                  {Object.values(repoInfo).some(value => value !== 0) ? (
                    <>
                      <div className="mb-4 max-h-64 overflow-y-auto scrollbar-thin">
                        <div className="grid grid-cols-5 gap-2 ">
                          {Object.entries(repoInfo)
                            .sort(([, a], [, b]) => b - a)
                            .map(([lang, value]) => (
                              <p key={lang} className="mb-2 text-sm">
                                {lang}: {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
                              </p>
                            ))}
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', maxWidth: '300px', height: '300px' }}>
                          <Pie data={chartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  boxWidth: 12,
                                  font: {
                                    size: 15,
                                  },
                                  padding: 10,
                                }
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                      label += ': ';
                                    }
                                    if (context.parsed !== undefined) {
                                      label += `${context.parsed}%`;
                                    }
                                    return label;
                                  }
                                }
                              }
                            }
                          }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400 text-center">Perform scan</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Suspense>
    </div>
      </div>
    </>

  );
};

export default Overview;