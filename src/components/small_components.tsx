import styled from "styled-components";
import Select from "react-select";

////////
// Small, miscellaneous styled components used throughout the app
////////

export const WhiteSpaceBlock = styled.div<{size?: string}>`
    width: ${ props => props.size ?? "3em" };
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
    margin-top: 0.6em;
    width: 500px;
    max-width: 95vw;
`