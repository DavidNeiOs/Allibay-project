import styled, { css } from 'styled-components';

const Aside = styled.div`
  height: 60vh;
  width: 14vw;
  margin-top: 7vh;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  text-align: center;

  ${props => props.join && css`
    margin-left: 0.5vw;
  `}
`;
 
export default Aside;