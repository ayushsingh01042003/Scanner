import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


const Overview = () => {
  const [scanOption, setScanOption] = useState('github');
  const [url, setUrl] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);
  const [localItems, setLocalItems] = useState([]);
  const [results, setResults] = useState('');
  const [numFiles, setNumFiles] = useState(0);
  const [repoInfo, setRepoInfo] = useState({
    Java: 0,
    Python: 0,
    HTML: 0,
    JavaScript: 0,
  });

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
    .slice(0, 10); // Increase this number if you want to show more languages

  const colors = generateColors(topLanguages.length);

  setChartData({
    labels: topLanguages.map(([lang]) => lang),
    datasets: [{
      data: topLanguages.map(([, value]) => value),
      backgroundColor: colors,
      hoverBackgroundColor: colors
    }]
  });
}, [repoInfo]);

  const handleScanClick = () => {
    console.log('Scan button clicked');
    if (scanOption === 'github') {
      const mockNumFiles = localItems.length;
      const mockResults = {
      ssn: {
        "/home/ayush/Progs/Cognizant/codebase/inner directory/vul.txt": ["777-45-6789"],
        "/home/ayush/Progs/Cognizant/codebase/main.py": ["123-45-6789", "987-65-4321"],
        "/home/ayush/Progs/Cognizant/codebase/user_data.py": ["123-45-6789", "987-65-4321"]
      },
      creditCard: {
        "/home/ayush/Progs/Cognizant/codebase/inner directory/vul.txt": ["1234567890123456", "1234567890123456"],
        "/home/ayush/Progs/Cognizant/codebase/user_data.py": ["1234567890123456"]
      }
     };
     const mockRepoInfo = {
      Java: 20,
      Python: 40,
      HTML: 30,
      JavaScript: 20,
    };
    setNumFiles(Object.keys(mockResults.ssn).length + Object.keys(mockResults.creditCard).length);
    setResults(mockResults);
    setRepoInfo(mockRepoInfo);
    }
    else if(scanOption === 'local')
    {
      const mockNumFiles = localItems.length;
      const mockResults = {
        "ssn": {
        "/home/ayush/Progs/Cognizant/codebase/inner directory/vul.txt": [
            "777-45-6789",
            "666-45-6789",
            "555-45-6789"
        ],
        "/home/ayush/Progs/Cognizant/codebase/inner directory/vul2.txt": [
            "444-45-6789",
            "333-45-6789",
            "222-45-6789"
        ],
        "/home/ayush/Progs/Cognizant/codebase/main.py": [
            "123-45-6789",
            "987-65-4321"
        ],
        "/home/ayush/Progs/Cognizant/codebase/user_data.py": [
            "123-45-6789",
            "987-65-4321"
        ]
    },
    "creditCard": {
        "/home/ayush/Progs/Cognizant/codebase/inner directory/vul.txt": [
            "1234567890123456",
            "1234567890123456"
        ],
        "/home/ayush/Progs/Cognizant/codebase/user_data.py": [
            "1234567890123456"
        ]
      }
    }
    const mockRepoInfo = {
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
     };
     const processedRepoInfo = {
      Java: 0,
      Python: mockRepoInfo.py || 0,
      HTML: mockRepoInfo.html || 0,
      JavaScript: mockRepoInfo.js || 0,
    };
    
    setNumFiles(Object.keys(mockResults.ssn).length + Object.keys(mockResults.creditCard).length);
    setResults(mockResults);
    setRepoInfo(mockRepoInfo);
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setLocalItems(files);
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
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={handleAddKeyValuePair}
              >
                Add Key-Value Pair
              </button>
            </div>
          )}
          {scanOption === 'local' && (
            <div className="mb-4" onDrop={handleDrop} onDragOver={handleDragOver}>
              <div
                className="bg-[#282828] text-white rounded-lg py-4 px-4 w-full focus:outline-none h-32 flex items-center justify-center border-dashed border-2 border-gray-600"
              >
                <label htmlFor="fileInput" className="cursor-pointer">
                  Drop files or folders here or click to select
                </label>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileInputChange}
                  multiple
                  webkitdirectory=""
                  directory=""
                />
              </div>
              <div className="mt-2">
                {localItems.map((item, index) => (
                  <div key={index} className="bg-[#282828] text-white rounded-lg py-2 px-4 mb-2">
                    {item.webkitRelativePath || item.name}
                  </div>
                ))}
              </div>
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
                className="bg-[#282828] hover:bg-green-700 text-white py-2 px-4 rounded"
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
    <p className="mb-2">Number of Files scanned - {numFiles}</p>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#2C2D2F] border-collapse border-gray-600 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#2C2D2F] text-gray-300">
          <tr>
            <th className="py-2 px-4 border-b border-gray-600">PPI found</th>
            <th className="py-2 px-4 border-b border-gray-600">PII type</th>
            <th className="py-2 px-4 border-b border-gray-600">File path</th>
          </tr>
        </thead>
        <tbody className="text-gray-400">
          {Object.keys(results).map((piiType) => {
            return Object.keys(results[piiType]).map((filePath) => {
              return results[piiType][filePath].map((pii, index) => (
                <tr key={`${filePath}-${index}`}>
                  <td className="py-2 px-4 border-b border-gray-600">{pii}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{piiType}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{filePath}</td>
                </tr>
              ));
            });
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
        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>
    </div>
  </div>
</div>
</div>
</div>
  );
};

export default Overview;
