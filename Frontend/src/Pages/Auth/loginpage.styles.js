import styled from 'styled-components';

export const Container = styled.div`
  background-image: ${props => `url(${props.backgroundImage})`};
  height: 100vh;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
`;

export const Panel = styled.div`
  display: flex;
  background-color: #1e2a38;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  width: 65%;
  height: 90%; 
  min-height: 500px;
  max-height: 800px;
`;

export const Section = styled.div`
  flex: 1;
  padding: 40px;
  color: #fff;
`;

export const LeftSection = styled(Section)`
  background-color: #000000;
`;

export const RightSection = styled(Section)`
  background-color: #1e2a38;
  padding: 0;
  display: flex;
`;

export const Title = styled.h2`
  margin-top: 0;
`;

export const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 0 auto 16px auto;
  border: none;
  border-radius: 14px;
  background-color: #282828;
  color: #fff;
  outline: none;
  
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  background-color: #a4ff9e;
  color: #000000;
  cursor: pointer;
  font-weight: bold;
`;

export const SocialLogin = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

export const SocialIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
`;

export const AppPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0 10px 10px 0;
`;