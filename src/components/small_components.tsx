import styled from "styled-components";
import Select from "react-select";

export const WhiteSpaceBlock = styled.div`
    min-width: 3em;
    max-width: 20vw;
    display: block;
`

export const Column = styled.div`
    display: flex;
    flex-direction: column;

`
export const Row = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: row;
`


export const StyledSelect = styled(Select)`
    width: 20ch;
    margin: 10px;
    z-index: 10;
`

export const Button = styled.button`
  height: 2rem;
`;

export const Input = styled.input`
  height: 2rem;
`;

export const AccordionContainer = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 500px;
    max-width: 95vw;
`