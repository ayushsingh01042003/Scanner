import React, { useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import axios from 'axios';

const AddTeamMember = () => {
  const [memberUsername, setMemberUsername] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handleAddMember = async () => {
    if (!memberUsername.trim()) return;

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const response = await api.post('/team/add-member', {
        memberUsername: memberUsername.trim()
      });

      setTeamMembers([...teamMembers, memberUsername.trim()]);
      setMemberUsername('');
      setSuccessMessage('Member added successfully!');
      
      // Fetch updated team members list
      await fetchTeamMembers();

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/team/members');
      setTeamMembers(response.data.map(member => member.username));
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to fetch team members');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full block p-8">
        <h1 className="text-lg text-[#a4ff9e]">Scanner</h1>
        <h1 className="text-4xl font-bold text-white">Team Members</h1>
      </div>

      <div className="flex w-[95%] h-full mx-auto">
        <section className="w-full bg-[#2C2D2F] text-white p-6 mb-4 rounded-lg">
          <div className="flex mb-4">
            <input
              type="text"
              value={memberUsername}
              onChange={(e) => setMemberUsername(e.target.value)}
              placeholder="Enter team member username"
              className="flex-grow mr-2 p-2 bg-[#1C1C1C] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a4ff9e]"
              disabled={loading}
            />
            <button
              onClick={handleAddMember}
              className={`bg-[#a4ff9e] hover:bg-black hover:text-[#a4ff9e] text-black py-2 px-4 rounded-lg transition duration-300 font-bold flex items-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              <MdPersonAdd className="mr-2" />
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-500 bg-opacity-20 text-green-300 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="bg-[#1C1C1C] p-4 rounded-lg text-gray-300">
            <h2 className="text-xl mb-4 text-grey-300">Team Members</h2>
            {teamMembers.length > 0 ? (
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index} className="mb-2 p-2 bg-[#2C2D2F] rounded-lg flex justify-between items-center">
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No team members added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddTeamMember;