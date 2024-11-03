import React, { useState , useContext } from 'react';
import { AuthContext } from './AuthContext';
import styled from 'styled-components';
import myImage from './loginpanel1.png';
import bg from './background.png';
import { SlLogin } from "react-icons/sl";
import {
    Container,
    Panel,
    LeftSection,
    RightSection,
    Input,
    Button,
    AppPreview
} from './loginpage.styles';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = ({ setActiveComponent, onLogin }) => {
  const { setIsAuthenticated , setUsername: Setgoogleusername } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamname, setTeamname] = useState('');
  const [level, setLevel] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin(username, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Google login response:', data);
        document.cookie = `jwt=${data.token}; path=/; max-age=3600; SameSite=Strict; Secure`;
        if (setIsAuthenticated && typeof setIsAuthenticated === 'function') {
          setIsAuthenticated(true);
        } else {
          console.error('setIsAuthenticated is not a function');
        }
        Setgoogleusername(data.username);
        navigate('/home');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <Container  backgroundimage={bg} >
      <Panel>
        <LeftSection>
        <div className='p-16'>
            <center><SlLogin size={35}/>
            <h2 style={{ fontSize: '40px' }}> &zwj; Login</h2></center>
        </div>
          <form onSubmit={handleSubmit}>
            <center>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                <option value="" disabled>Select the level</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Account">Account</option>
              </select>

              {level === 'Account' && (
                <Input
                  type="text"
                  placeholder="team name"
                  value={teamname}
                  onChange={(e) => setTeamname(e.target.value)}
                />
              )}

              <Button type="submit">Login</Button>
            </center>
          </form>
          {/* <center>{error && <p className="mt-4" style={{color:'red'}}>{error}</p>}
          <p className='p-8'>Don't have an account?<a href="#" style={{color: '#3498db'}} onClick={() => setActiveComponent('signup')}> Sign up</a></p>
          <GoogleLogin 
              onSuccess={handleSuccess}
              onError={handleError}
            /></center> */}
        </LeftSection>
        <RightSection>
          <AppPreview src={myImage} alt="App Preview" />
        </RightSection>
      </Panel>
    </Container>
  );
};

export default Login;
