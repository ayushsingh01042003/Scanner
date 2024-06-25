import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
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

    let response;
    if (scanOption === 'github') {
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
        if (!scanResponse.ok) {
            throw new Error('Failed to fetch repository stats');
        }
  
        if (!response.ok) {
          throw new Error('Failed to fetch repository stats');
        }
  
        const data = await response.json();
        setRepoInfo(data);

        const scandata = await scanResponse.json();
        // console.log("Scanned", scanResponse);
        setResults(scandata);
        // console.log("Raw API response:", scandata);
        setNumFiles(Object.keys(scandata).length);
        // console.log("Number of files scanned:", Object.keys(scandata).length);
  
        // Update chart data
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
      }
      else if (scanOption === 'local') {
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
  
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch local directory stats`);
      }

      const scanResponse = await fetch('http://localhost:3000/scan-directory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      directoryPath: localDirectoryPath,
      regexPairs: Object.fromEntries(keyValuePairs.map(pair => [pair.key, pair.value]))
      }),});

      if (!scanResponse.ok) {
        throw new Error('Failed to scan local directory');
      }
  
      const statsData = await statsResponse.json();
      const scanData = await scanResponse.json();
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
        // setNumFiles(Object.keys(processedResults).length);
        setNumFiles(Object.keys(scanData).reduce((sum, key) => sum + Object.keys(scanData[key]).length, 0));
      
      // Update chart data
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
  
      // Mock data for other fields (you may want to replace these with actual API calls as well)
    }else{
        console.error('Received empty or invalid data from the API');
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

  const handleDrop = (e) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    const newItems = [];

    items.forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        newItems.push(file);
      } else if (item.kind === 'directory') {
        const dirEntry = item.webkitGetAsEntry();
        traverseDirectory(dirEntry);
      }
    });

    setLocalItems(newItems);
  };

  const traverseDirectory = (item) => {
    if (item.isFile) {
      item.file((file) => {
        setLocalItems((prevItems) => [...prevItems, file]);
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
          traverseDirectory(entry);
        });
      });
    }
  };

  const [localDirectoryPath, setLocalDirectoryPath] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  return (
    <div className="bg-[#1C1C1C] text-white min-h-screen p-8 w-full overflow-hidden">
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-12 rounded transition duration-300 ${
              scanOption === 'github' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setScanOption('github')}
          >
            GitHub
          </button>
          <button
            className={`bg-[#19191A] hover:bg-[#2c2c2e] border border-gray-700 text-white py-4 px-9 rounded transition duration-300 ${
              scanOption === 'local' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setScanOption('local')}
          >
            Local Directory
          </button>
        </div>
      </div>

      <div className="flex mb-8">
        <div className="bg-[#1C1C1C] rounded-lg w-full p-6">
          <h2 className="text-xl mb-4 text-gray-300">Input Information</h2>
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
                className="bg-[#282828] text-white rounded-lg py-4 px-4 w-full mb-2 focus:outline-none"
              />
              {keyValuePairs.map((pair, index) => (
                <div className="flex space-x-2 mb-2" key={index}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={pair.key}
                    onChange={(e) =>
                      handleKeyValuePairChange(index, 'key', e.target.value)
                    }
                    className="bg-[#282828] text-white rounded-lg py-4 px-4 flex-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={pair.value}
                    onChange={(e) =>
                      handleKeyValuePairChange(index, 'value', e.target.value)
                    }
                    className="bg-[#282828] text-white rounded-lg py-4 px-4 flex-1 focus:outline-none"
                  />
                  {keyValuePairs.length > 1 && (
                    <button
                      className="bg-[#282828] hover:bg-red-700 text-white py-2 px-4 rounded"
                      onClick={() => handleRemoveKeyValuePair(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                className="bg-[#282828] hover:bg-black text-white py-2 px-4 rounded"
                onClick={handleAddKeyValuePair}
              >
                Add Key-Value Pair
              </button>
            </div>
          )}
          {scanOption === 'local' && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter local directory path"
              value={localDirectoryPath}
              onChange={(e) => setLocalDirectoryPath(e.target.value)}
              className="bg-[#282828] text-white rounded-lg py-4 px-4 w-full mb-2 focus:outline-none"
            />
            {keyValuePairs.map((pair, index) => (
              <div className="flex space-x-2 mb-2 mt-4" key={index}>
                <input
                  type="text"
                  placeholder="Key"
                  value={pair.key}
                  onChange={(e) =>
                    handleKeyValuePairChange(index, 'key', e.target.value)
                  }
                  className="bg-[#282828] text-white rounded-lg py-4 px-4 flex-1 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={pair.value}
                  onChange={(e) =>
                    handleKeyValuePairChange(index, 'value', e.target.value)
                  }
                  className="bg-[#282828] text-white rounded-lg py-4 px-4 flex-1 focus:outline-none"
                />
                {keyValuePairs.length > 1 && (
                  <button
                    className="bg-[#282828] hover:bg-red-700 text-white py-2 px-4 rounded"
                    onClick={() => handleRemoveKeyValuePair(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              className="bg-[#282828] hover:bg-green-700 text-white py-2 px-4 rounded mt-2"
              onClick={handleAddKeyValuePair}
            >
              Add Key-Value Pair
            </button>
          </div>
        )}

          <div className="flex justify-end mt-4">
            <button
              className="bg-[#A8C5DA] hover:bg-black hover:text-white text-black py-3 px-6 rounded-lg w-64 transition duration-300"
              onClick={handleScanClick}
            >
              Scan
            </button>
          </div>
        </div>
      </div>

  <div className="flex flex-col md:flex-row gap-8">
  <div className="bg-[#2C2D2F] rounded-lg p-6 mb-8 flex-1 overflow-auto" style={{maxHeight: '500px'}}>
    <h2 className="text-xl mb-4 text-gray-300">Results</h2>
    <p className="mb-2">Number of Files with PIIs found - {Object.keys(results).length}</p>
    <div className="mt-4 flex justify-end">
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
      onClick={() => {
        // Add your generate report logic here
        console.log("Generate Report clicked");
      }}
    >
      Generate Report
    </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#2C2D2F] border-collapse border-gray-600 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#2C2D2F] text-gray-300">
          <tr>
          <th className="py-2 px-4 border-b border-gray-600 text-left w-3/4">File path</th>
          <th className="py-2 px-4 border-b border-gray-600 text-right w-1/4">No. of PIIs found</th>
          </tr>
        </thead>
        <tbody className="text-gray-400">
        {Object.entries(results).map(([filePath, piiData]) => {
            // Check if piiData is a number (count) or an object (detailed data)
            const piiCount = typeof piiData === 'number' ? piiData : 
            (Array.isArray(piiData) ? piiData.length : 
            (typeof piiData === 'object' ? Object.values(piiData).flat().length : 0));

            return (
            <tr key={filePath}>
                <td className="py-2 px-4 border-b border-gray-600 text-left">{filePath}</td>
                <td className="py-2 px-4 border-b border-gray-600 text-right">{piiCount}</td>
            </tr>
            );
           })}
        </tbody>
      </table>
    </div>
    
  </div>
  <div className="bg-[#2C2D2F] rounded-lg p-6 flex-1" style={{height: '500px', overflow: 'auto'}}>
  <h2 className="text-xl mb-4 text-gray-300">Repository Info</h2>
  <div className="flex flex-col h-full">
  <div className="mb-4 max-h-64 overflow-y-auto">
      {Object.entries(repoInfo)
        .sort(([, a], [, b]) => b - a)
        .map(([lang, value]) => (
        <p key={lang} className="mb-2">
            {lang}: {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
          </p>
      ))}
    </div>
    <div className="flex-grow flex items-center justify-center">
      <div style={{ width: '100%', maxWidth: '250px', height: '250px' }}>
      <Pie data={chartData} options={{ 
          responsive: true, 
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
            }
          }
        }} />
      </div>
    </div>
  </div>
</div>
</div>
</div>
  );
};

export default Overview;