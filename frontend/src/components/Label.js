import styled, { css } from 'styled-components';

const Label = styled.label`
  margin-top: 3vh;
  margin-left: 1vw;

  ${props => props.user && css`
    margin-top: 1.5vh;
    margin-left: 10vw;
  `}
`;
export default Label;