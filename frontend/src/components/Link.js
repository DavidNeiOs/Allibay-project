import styled from 'styled-components'

const Link = styled.a`
  width: 100%;
  height: 5%;
  margin-bottom: 2%;
  padding-top: 1vh;
  color: darkgoldenrod;
  background-color: trasparent;
  text-decoration: none;

  &:hover {
    color: gray;
    text-decoration: underline;  
  };

  &:visited {
      color: black;
      text-decoration: none;
  }
`;

export default Link;
