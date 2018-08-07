import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: transparent;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;

  > * {
    flex-grow: 1 100%;
  }
`;

export default Wrapper