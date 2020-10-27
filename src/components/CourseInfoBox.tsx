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
    box-shadow: 4px 4px 4px 1px lightgray;
    cursor: pointer;
    grid-column: span ${props => props.doubleWidth ? 3 : 1};
    padding: 0.3rem;
    margin: 0.2rem;
`

const ButtonContainer = styled.div <{}>`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
`


export const CourseInfoBox: FunctionComponent<{}> = () => {
    const [semester, setSemester] = useState("");

    return <>
        <InfoBox>
            <h1>Course Title</h1>
            <p>Course Description</p>
            <ButtonContainer>
                {["Previous Semesters", "Current Semester", "Spring 21", "Sum. 21", "Fall 21", "Spring 22", "Sum. 22", "Fall 22", "Spring 23", "Sum. 23", "Fall 23",
                    "Spring 24", "Sum. 24", "Fall 24"].map((sem, index, arr) => <SemesterButton color={`hsl(${(index / arr.length) * 360},100%,50%)`}
                        selected={false} doubleWidth={sem.includes("Sem") ? true : false}>{sem}</SemesterButton>)}
            </ButtonContainer>
        </InfoBox>
    </>
}