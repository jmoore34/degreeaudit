import React, { FunctionComponent, useState } from "react";
import { Component } from 'react';
import styled from "styled-components";
import Color from "color";
import { FlowchartBox } from "./flowchart_components_in_common";
import { getColorOfSemester } from "../util";
import {getUrlReadyCourseName} from "../regex";
import {TextField} from "@material-ui/core";


const InfoBox = styled.div <{ flowchartBox: FlowchartBox }>`
    z-index: 10;
    position: absolute;
    background-color: rgba(255,255,255,0.97);
    border: 1px solid black;
    width: 40rem;
    top: calc(${props => props.flowchartBox.top}% + 5%);
    // center it horizontally, taking into account the width is 40rem, ∴ half the width is 20rem.
    // (but we actually tweak these values slightly because of padding etc)
    // first part of clamp makes sure it doesn't go outside of the flowchart (too far left)
    // 3rd part of clamp makes sure it doesn't go outside of the flowchart (too far right)
    left: clamp(-1rem, calc(${props => props.flowchartBox.left}% - 17rem), 100% - 40rem);
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
export function* semesterGenerator() {
    let semester = currentSemester
    for (let i = 0; i < 12; i++) {
        yield semester
        semester = getNextSemester(semester)
    }
}

export function generateMajorURL(major: string) {
    let majorURL = '';
    let engineering = true;
    if (major === 'CS') {
        majorURL = 'computer-science'
        engineering = false;
    }
    else if (major === 'CE')
        majorURL = 'computer'
    else if (major === 'BMEN')
        majorURL = 'biomedical'
    else if (major === 'EE')
        majorURL = 'electrical'
    else if (major === 'SE')
        majorURL = 'software'
    else
        majorURL = 'mechanical'
    if (engineering)
        majorURL += '-engineering'
    return majorURL
}

interface CourseInfoBoxProps {
    flowchartBox: FlowchartBox | null
    onSemesterChanged: (newSemester: string) => any
    semester: string
    onClose: () => void
    catalogYear: string
    major: string
    courseNickName: string | undefined | null
    setCourseNickName: (nickName: string) => any
}

export const CourseInfoBox: FunctionComponent<CourseInfoBoxProps> = (props) => {
    if (!props.flowchartBox) {
        return <></>
    }

    const course = props.flowchartBox.name.toLowerCase()

    // only shown on categorical (e.g. "Core"), courses, not concrete courses like MATH 2413
    const nicknameInput = <>
        <br /> <br />
        <TextField
            value={props.courseNickName ?? ""}
            onChange={e => props.setCourseNickName(e.target.value.toUpperCase())}
            variant="outlined"
            label="Selected course"
        />
    </>

    // @ts-ignore
    const semesters = ["Taken", ...semesterGenerator()]
    let view =
        <CourseFrame src={"https://catalog.utdallas.edu/" + props.catalogYear + "/undergraduate/courses/" + getUrlReadyCourseName(course)} height="400" width="600" scrolling="no"></CourseFrame>
    if (course.includes('core')) {
        view =
            <>
                <h2>The credits required are:</h2>
                <ul style={{listStyle: "none"}}>
                    <li>010 Communication (6 semester credit hours)</li>
                    <li>020 Mathematics (3 semester credit hours)</li>
                    <li>030 Life and Physical Sciences (6 semester credit hours)</li>
                    <li>040 Language, Philosophy and Culture (3 semester credit hours)</li>
                    <li>050 Creative Arts (3 semester credit hours)</li>
                    <li>060 American History (6 semester credit hours)</li>
                    <li>070 Government/Political Science (6 semester credit hours)</li>
                    <li>080 Social and Behavioral Sciences (3 semester credit hours)</li>
                    <li>090 Component Area Option (6 semester credit hours)</li>
                </ul>
                <a href={"https://catalog.utdallas.edu/" + props.catalogYear + "/undergraduate/curriculum/core-curriculum"}>Go here for more information</a>
                {nicknameInput}
            </>
    }
    else if (course.includes('free')) {
        view =
            <>
                <p>
                    Most classes can be used to satisfy free electives. Courses with STAT and ITSS prefixes cannot be used to satisfy free electives.
                    Math classes below MATH 2413 and classes equivalent to those you have already taken also cannot be used to satisfy free electives."
                </p>
                {nicknameInput}
            </>
    }
    else if (course.includes('guided')) {
        view =
            <>
                <br/>
                <a href={"https://catalog.utdallas.edu/" + props.catalogYear + "/undergraduate/programs/ecs/" + generateMajorURL(props.major)}>To get a list of guided electives click here and scroll down to Major Guided Electives</a>
                {nicknameInput}
            </>
    }
    else if (course.includes('prescribed')) {
        if (props.major === 'bmen') {
            view =
                <>
                    <br/>
                    <p>
                        Students pursuing the general program take 9 semester credit hours using any other BMEN 3000 level or higher class or any other
                        upper division engineering course with approval from the department. Students must document 9 semester credit hours of
                        engineering content for these to count towards their degree.
                    </p>
                    {nicknameInput}
                </>
        }
        else {
            view =
                <>
                    <br/>
                    <a href={"https://catalog.utdallas.edu/" + props.catalogYear + "/undergraduate/programs/ecs/" + generateMajorURL(props.major)}>To get a list of guided electives click here and scroll down to Major Prescribed Electives</a>
                    {nicknameInput}
                </>
        }
    }



    return <>
        <InfoBox flowchartBox={props.flowchartBox}>
            <button
                onClick={() => {
                    props.onClose();
                }}>
                Close
            </button>
            <IFrameWrapper>
                {view}
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