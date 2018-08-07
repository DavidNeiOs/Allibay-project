import styled, { css } from 'styled-components'

const Button = styled.button`
    background-color: gold;

    ${props => props.register && css`
        background-color: black;
        color: white;
        width: 30%;
        margin-left: 5vw;
        margin-top: 3vh;
        height: 3vh;
    `}
`

export default Button;