import React, { FunctionComponent, useState } from "react";
import { Component } from 'react';
import styled from "styled-components";
import Color from "color";

const InfoBox = styled.div`
    z-index: 10;
    position: absolute;
    background-color: rgba(255,255,255,0.85);
    border: 1px solid black;
    width: 40;
    padding: 1rem;
    padding-bottom: 3rem;
    border-radius: 14px;
`;

const SemesterButton = styled.div <{ color: string, selected: boolean, doubleWidth: boolean }>`
    background-color: ${props => props.selected ? Color(props.color).lighten(.3).toString() : Color(props.color).lighten(.96).toString()};
    border: 2px solid ${props => props.selected ? Color(props.color).lighten(.1).toString() : Color(props.color).lighten(.36).toString()};
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
    border: 1px solid red;
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

export const CourseInfoBox: FunctionComponent<{}> = (props) => {
    const [semester, setSemester] = useState("");


    return <>
        <InfoBox>
            {/*<IFrameWrapper>
                <CourseFrame src="https://catalog.utdallas.edu/2020/undergraduate/courses/cs2305" height="400" width="600" scrolling="no"></CourseFrame>
            </IFrameWrapper>*/}
            <IFrameWrapper>
                <CourseFrame src="https://catalog.utdallas.edu/2020/undergraduate/courses/cs2305" height="400" width="600" scrolling="no"></CourseFrame>
            </IFrameWrapper>
            <ButtonContainer>
                {["Previous Semesters", "Current Semester", "Spring 21", "Sum. 21", "Fall 21", "Spring 22", "Sum. 22", "Fall 22", "Spring 23", "Sum. 23", "Fall 23",
                    "Spring 24", "Sum. 24", "Fall 24"].map((sem, index, arr) =>
                        <SemesterButton
                            color={`hsl(${(index / arr.length) * 360},100%,50%)`}
                            selected={semester === sem}
                            doubleWidth={sem.includes("Sem") ? true : false}
                            onClick={() => {
                                setSemester(sem);
                            }}>
                            {sem}
                        </SemesterButton>)}
            </ButtonContainer>
        </InfoBox>
    </>
}