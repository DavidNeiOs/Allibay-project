import styled, { css } from 'styled-components'

const Logo = styled.img`
    width: 3.5vw;
    height: 6vh;

    ${props => props.avatar && css`
      width: 5vw;
      height: 5vh;
      margin: 5vh auto 2vh auto;
      border-radius: 100%;
      box-shadow: 0.1vw 0.3vh lightblue;
    `}
`;

export default Logo;