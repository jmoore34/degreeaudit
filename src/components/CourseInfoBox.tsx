import React, { FunctionComponent, useState } from "react";
import { Component } from 'react';
import styled from "styled-components";
import Color from "color";
import { getColorOfSemester } from "./Flowchart";


const InfoBox = styled.div <{ yVal: string }>`
    z-index: 10;
    position: absolute;
    background-color: rgba(255,255,255,0.85);
    border: 1px solid black;
    width: 40;
    top: calc(${props => props.yVal}% + 5%);
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
    padding-bottom: 3rem;
    border-radius: 14px;
`;

const SemesterButton = styled.div <{ color: string, selected: boolean, doubleWidth: boolean }>`
    background-color: ${props => props.selected ? Color(props.color).lighten(.2).toString() : Color(props.color).lightness(98).toString()};
    border: 2px solid ${props => props.selected ? Color(props.color).lighten(.1).toString() : Color(props.color).lighten(.15).toString()};
    transition: all .15s;
    font-weight: ${props => props.selected ? "bold" : "normal"};
    box-shadow: ${props => props.selected ? "6px 6px 6px 1px lightgray" : "4px 4px 4px 1px lightgray"};
    transform: ${props => props.selected ? "scale(1.02)" : ""};
    cursor: pointer;
    grid-column: span ${props => props.doubleWidth ? 3 : 1};
    padding: .3rem;
    margin: 0.2rem;
`

const ButtonContainer = styled.div <{}>`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
`

const CourseFrame = styled.iframe <{}>`
    margin-top: -90px;
    pointer-events: none;
    width: 639px;
    height: 500px;
    //clip:rect(100px,700px,620px,00px);
    left: 0px;
    position: relative;
    z-index: -1000;
`
const IFrameWrapper = styled.div <{}>`
    overflow: hidden;
    position: relative;
    top:-10px;
    height: 390px;
    //background-color: blue;
`
const SiblingDiv = styled.div <{}>`
    background-color: blue;
    position: absolute;
    width: 70%;
    height: 390px;
`

const now = new Date()
var currentTerm: string;
// (note: now.getMonth() is 0-indexed
// note: this isn't exact, but it's good enough to not show very old semesters in the list of buttons
if (now.getMonth() <= 4) currentTerm = 'Spring' // Jan through May
else if (now.getMonth() <= 7) currentTerm = 'Summer' // June through August
else currentTerm = 'Fall' // September through December

const currentAbbreviatedYear = now.getFullYear() % 100 // e.g. 2020 -> 20

export const currentSemester = `${currentTerm} ${currentAbbreviatedYear}`

function getNextSemester(currentSemester: string) {
    let newTerm;
    if (currentSemester.includes("Spring")) newTerm = "Summer"
    else if (currentSemester.includes("Summer")) newTerm = "Fall"
    else newTerm = "Spring"

    const oldYear = Number(currentSemester.substring(currentSemester.length - 2)) // last two characters are the shortened year (e.g. 2020 -> 20)

    const newYear = (newTerm === "Spring") ? oldYear + 1 : oldYear; // year stays the same, except after a fall semester (spring is in new year)

    return `${newTerm} ${newYear}`
}

// Generator function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
// to generate 12 semesters starting with the current one
function* semesterGenerator() {
    let semester = currentSemester
    for (let i=0; i<12; i++) {
        yield semester
        semester = getNextSemester(semester)
    }
}


export const CourseInfoBox: FunctionComponent<{ yValue: string, course: string, onSemesterChanged: (newSemester: string) => any, semester: string, onClose: () => void }> = (props) => {
    //const [semester, setSemester] = useState("");

    if (!props.course) {
        return <></>
    }

    // @ts-ignore
    const semesters = ["Taken", ...semesterGenerator()]

    return <>
        <InfoBox yVal={props.yValue}>
            <button
                onClick={() => {
                    props.onClose();
                }}>
                Close
            </button>
            <IFrameWrapper>
                <CourseFrame src={"https://catalog.utdallas.edu/2020/undergraduate/courses/" + props.course.toLowerCase().replace(/[ ']/g, "")} height="400" width="600" scrolling="no"></CourseFrame>
            </IFrameWrapper>
            <ButtonContainer>
                <SemesterButton
                    color="#b5b3b0"
                    selected={!props.semester}
                    doubleWidth={true}
                    onClick={() => {
                        props.onSemesterChanged("");
                    }}>
                    Unset
                </SemesterButton>
                {semesters.map((sem, index, arr) =>
                        <SemesterButton
                            color={getColorOfSemester(sem)}
                            selected={props.semester === sem}
                            doubleWidth={sem === "Taken"} // "Taken" should be double witdth
                            onClick={() => {
                                props.onSemesterChanged(sem);
                            }}>
                            {sem}
                        </SemesterButton>)}
            </ButtonContainer>
        </InfoBox>
    </>
}