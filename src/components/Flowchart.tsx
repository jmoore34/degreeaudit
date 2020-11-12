import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import cs from '../flowcharts/cs.webp';
import { Rnd } from "react-rnd";
import { CourseInfoBox } from "./CourseInfoBox";
import Color from "color";
import {useRerenderOnResize} from "../util";

export const FlowchartBackground = styled.img`
    width: 100%;
    //height: auto;
`;


export const HighlightBox = styled.div<{ box: FlowchartBox, color: string }>`
    top: ${props => props.box.top}%;
    left: ${props => props.box.left}%;
    width: ${props => props.box.width}%;
    height: ${props => props.box.height}%;
    :hover {
      background-color: ${props => props.color === "transparent" ? Color("black").fade(.8).toString() : Color(props.color).fade(.5).darken(.1).toString()};
    }
    transition: all .15s;
    cursor: pointer;
    background-color: ${props => Color(props.color).lighten(.1).fade(.5).toString()};
    position: absolute;
    border-radius: 20%;
    z-index: 2;
`;

export const FlowchartWrapper = styled.div`
    border: 1px black solid;
    margin: 7vw;
    width: 75vw;
    position: relative;
`;

export const Flowchart: FunctionComponent<{}> = () => {
    const ref = React.useRef(null)
    const localStorageKey = "courseSemesters"
    const [courseSemestersMap, setCourseSemesters]: any = useState(JSON.parse(localStorage.getItem(localStorageKey) ?? "{}") ?? {});
    const [selectedCourse, setSelectedCourse]: any = useState("");

    useRerenderOnResize()

    return <>
        {selectedCourse}
        <FlowchartWrapper ref={ref}>
            <CourseInfoBox yValue={(flowchartBoxes.find(box => box.name === selectedCourse))?.top}
                course={selectedCourse}
                semester={courseSemestersMap[selectedCourse]}
                onSemesterChanged={(newSemester: string) => {
                    const newMap = { ...courseSemestersMap, [selectedCourse]: newSemester }
                    localStorage.setItem(localStorageKey, JSON.stringify(newMap));
                    console.log(localStorage.getItem(localStorageKey));
                    setCourseSemesters(newMap);
                }}
            />
            <FlowchartBackground src={cs} />
            {flowchartBoxes.map(box =>
                <HighlightBox box={box}
                    color={getColorOfSemester(courseSemestersMap[box.name])}
                    onClick={() => {
                        setSelectedCourse(box.name);
                    }}
                >

                </HighlightBox>
            )}
        </FlowchartWrapper>
    </>


}

export function getColorOfSemester(semester: string) {
    if (!semester) {
        return "transparent";
    }
    const hue = TSH(semester) % 360;
    if (semester === "Previous Semesters")
        return "gray";
    else
        return `hsl(${hue}, 100%, 50%)`;

}

function TSH(s: string) {
    for (var i = 0, h = 9; i < s.length;)
        h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
    return h ^ h >>> 9
}


export interface FlowchartBox {
    name: string
    left: any // percentage
    top: any
    height: any
    width: any
}

const flowchartBoxes: Array<FlowchartBox> = [
    {
        name: "ecs 1100",
        top: 8.8,
        left: 35.2,
        height: 5,
        width: 5
    }
]




