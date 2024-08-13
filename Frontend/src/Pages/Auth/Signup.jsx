import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import styled from 'styled-components';
import axios from 'axios';
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

const SignupPage = ({ setActiveComponent }) => {
  const { setIsAuthenticated , setUsername: Setgoogleusername } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errormessage, setErrorMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword=(password) => {
    let errors=[];

    if(password.length<8) errors.push("Password must be minimum 8 letters\n");
    if(!/[A-Z]/.test(password)) errors.push("Password must contain atleast one uppercase letter\n");
    if(!/[a-z]/.test(password)) errors.push("Password must contain atleast one lowercase letter\n");
    if(!/[0-9]/.test(password)) errors.push("Password must contain atleast one number\n")
      
    return errors;
  }

  const handleSubmit =async (e) => {
    setMessage('');
    setErrorMessage(''); 
    e.preventDefault();
    const errors=validatePassword(password);
    if(errors.length>0){
      setPasswordErrors(errors);
      setErrorMessage(errors[0]);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/signup', { username, password, confirmPassword}, { withCredentials: true });
      setMessage(response.data.msg || 'Signup successful');
      setPasswordErrors([]);
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Signup failed');
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
        <div className='p-14'>
            <center><SlLogin size={35}/>
            <h2 style={{ fontSize: '40px' }}> &zwj; Sign up</h2></center>
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordErrors(validatePassword(e.target.value));
                  }}
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit">Sign up</Button>
             </center>
          </form>
          <center>
            {message && <p className="mt-4">{message}</p>}
            {errormessage && <p className="mt-4" style={{ color: 'red' }} >{errormessage}</p>}
          <p className='p-8'>Already have an account? <a href="#" style={{color: '#3498db'}} onClick={() => setActiveComponent('login')}>Login</a></p></center>
          <center><GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            /></center>        
        </LeftSection>
        <RightSection>
          <AppPreview src={myImage} alt="App Preview" />
        </RightSection>
      </Panel>
    </Container>
  );
};

export default SignupPage;