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

  const [chartData, setChartData] = useState({
    labels: ['Java', 'Python', 'HTML', 'JavaScript'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  });

  useEffect(() => {
    setChartData({
      ...chartData,
      datasets: [{
        ...chartData.datasets[0],
        data: [repoInfo.Java, repoInfo.Python, repoInfo.HTML, repoInfo.JavaScript]
      }]
    });
  }, [repoInfo]);

  const handleScanClick = () => {
    console.log('Scan button clicked');
    // Placeholder mock data
    const mockNumFiles = localItems.length;
    const mockResults = 'Results will be displayed here';
    const mockRepoInfo = {
      Java: 20,
      Python: 40,
      HTML: 30,
      JavaScript: 20,
    };

    setNumFiles(mockNumFiles);
    setResults(mockResults);
    setRepoInfo(mockRepoInfo);
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
              className="bg-[#A8C5DA] hover:bg-black hover:text-white text-black py-2 px-4 rounded w-64 transition duration-300"
              onClick={handleScanClick}
            >
              Scan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#2C2D2F] rounded-lg p-6 mb-8">
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
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">123-4567-891</td>
                  <td className="py-2 px-4 border-b border-gray-600">Credit card number</td>
                  <td className="py-2 px-4 border-b border-gray-600">/path/to/file1.txt</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600">789-4561-230</td>
                  <td className="py-2 px-4 border-b border-gray-600">Social Security Number</td>
                  <td className="py-2 px-4 border-b border-gray-600">/path/to/file2.csv</td>
                </tr>
                {/* Add more rows as needed */}
                {/* Add more rows as needed */}
                </tbody>
            </table>
          </div>
        </div>
        <div className="bg-[#2C2D2F] rounded-lg p-6">
          <h2 className="text-xl mb-4 text-gray-300">Repository Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2">Java: {repoInfo.Java}</p>
              <p className="mb-2">Python: {repoInfo.Python}</p>
              <p className="mb-2">HTML: {repoInfo.HTML}</p>
              <p className="mb-2">JavaScript: {repoInfo.JavaScript}</p>
            </div>
            <div className="h-64">
              <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;