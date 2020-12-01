import React, {useState} from 'react';
import './App.css';
import { AdvisorFlowchart } from './components/AdvisorFlowchart';
import { StudentFlowchart } from "./components/StudentFlowchart";
// @ts-ignore
import { RadioGroup, RadioButton } from 'react-radio-buttons'
import styled from "styled-components";



function App() {
    const [mode, setMode] = useState("student") // student vs advisor mode
    const modeSwitcherComponent = <StyledRadioGroup onChange={setMode} value={mode} horizontal>
        <RadioButton value={"student"}>Student Mode</RadioButton>
        <RadioButton value={"advisor"}>Advisor Mode</RadioButton>
    </StyledRadioGroup>

    return (
        <div className="App">
            {enteredAdvisorPassword && modeSwitcherComponent} {/*show mode switcher only if advisor password entered*/}
            {mode === "student" ? <StudentFlowchart/> : <AdvisorFlowchart/>}
        </div>
    );
}

export default App;

// Get the advisor password from the URL after the hash, then immediately change the URL
// to discard the hash (hiding the password) (and hide it from browser history!)
export const enteredAdvisorPassword: string = (window.location.hash?.substring(1) ?? "") as string
// Used as reference: https://github.com/xwiki-labs/cryptpad/search?q=history.replaceState (thank you, cryptpad!)
window.history.replaceState({}, document.title, '#')

const StyledRadioGroup = styled(RadioGroup)`
  max-width: 60ch;
  padding-top: 1em;
`;