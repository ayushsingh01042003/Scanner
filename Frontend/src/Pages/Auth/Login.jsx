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
              
              <Button type="submit">Login</Button>
            </center>
          </form>
          <center>{error && <p className="mt-4" style={{color:'red'}}>{error}</p>}
          <p className='p-8'>Don't have an account?<a href="#" style={{color: '#3498db'}} onClick={() => setActiveComponent('signup')}> Sign up</a></p>
          </center> 
        </LeftSection>
        <RightSection>
          <AppPreview src={myImage} alt="App Preview" />
        </RightSection>
      </Panel>
    </Container>
  );
};

export default Login;
