import React, { useState, useContext } from 'react';
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
  const [accountType, setAccountType] = useState(''); // Changed initial value from ' ' to ''
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    let errors = [];
    if (password.length < 8) errors.push("Password must be minimum 8 letters");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain atleast one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain atleast one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Password must contain atleast one number");
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    // Validate all fields
    if (!username.trim()) {
      setErrorMessage('Username is required');
      return;
    }

    if (!accountType || accountType === '') {
      setErrorMessage('Please select an account type');
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      setErrorMessage(errors.join('\n'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Log the payload for debugging
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      const response = await axiosInstance.post('/signup', {
        username,
        password,
        confirmPassword,
        accountType
      });

      console.log('Signup response:', response.data);
      
      if (response.data) {
        setMessage(response.data.msg || 'Signup successful');
        setPasswordErrors([]);
        
        // Clear form after successful signup
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setAccountType('');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          setActiveComponent('login');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(
        error.response?.data?.msg || 
        'Signup failed. Please check your connection and try again.'
      );
    }
  };

  return (
    <Container backgroundimage={bg}>
      <Panel>
        <LeftSection>
          <div className='p-14'>
            <center>
              <SlLogin size={35}/>
              <h2 style={{ fontSize: '40px' }}> Sign up</h2>
            </center>
          </div>
          <form onSubmit={handleSubmit}>
            <center>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
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
              
              <select 
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '10px 0',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="" disabled>Select the account type</option>
                <option value="admin">Enterprise</option>
                <option value="team">Portfolio</option>
                <option value="personal">Account</option>
              </select>

              <Button type="submit">Sign up</Button>
            </center>
          </form>
          <center>
            {message && <p className="mt-4 text-green-500">{message}</p>}
            {errorMessage && <p className="mt-4 text-red-500" style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>}
            <p className='p-8'>
              Already have an account? 
              <a 
                href="#" 
                style={{color: '#3498db'}} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveComponent('login');
                }}
              >
                Login
              </a>
            </p>
          </center>
        </LeftSection>
        <RightSection>
          <AppPreview src={myImage} alt="App Preview" />
        </RightSection>
      </Panel>
    </Container>
  );
};

export default SignupPage;