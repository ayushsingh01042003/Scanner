import React, { useState } from 'react';

const GitHubCard = () => {
  const [inputURL, setInputURL] = useState('');

  const handleInput = (e) => {
    setInputURL(e.target.value);
  }

  return (
    <div className="card w-80 bg-slate-200 text-primary-content m-4">
      <div className="card-body">
        <h2 className="card-title">GitHub</h2>
        <div className="card-actions justify-end">
          <label className="flex items-center gap-2">
            <input
              type="text"
              placeholder="GitHub username"
              className="input input-bordered text-white"
              onChange={handleInput}
              value={inputURL}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default GitHubCard;
