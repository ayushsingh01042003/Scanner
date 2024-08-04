import React, { useState } from 'react';
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

const SignupPage = ({ setActiveComponent }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errormessage, setErrorMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

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

  return (
    <Container  backgroundImage={bg} >
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
        </LeftSection>
        <RightSection>
          <AppPreview src={myImage} alt="App Preview" />
        </RightSection>
      </Panel>
    </Container>
  );
};

export default SignupPage;