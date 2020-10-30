import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import cs from '../flowcharts/cs.webp';
import { Rnd } from "react-rnd";
import { CourseInfoBox } from "./CourseInfoBox";
import Color from "color";

const FlowchartBackground = styled.img`
    width: 100%;
    //height: auto;
`;


// @ts-ignore
const HighlightBox = styled.div<{ box: FlowchartBox, color: string }>`
    top: ${props => props.box.top}%;
    left: ${props => props.box.left}%;
    bottom: ${props => props.box.bottom}%;
    right: ${props => props.box.right}%;
    :hover {
      background-color: ${props => props.color === "transparent" ? Color("black").fade(.8).toString() : Color(props.color).fade(.5).darken(.1).toString()};
    }
    transition: all .15s;
    cursor: pointer;
    background-color: ${props => Color(props.color).lighten(.1).fade(.5).toString()};
    position: absolute;
    border-radius: 14px;
    z-index: 2;
`;

const SolidBox = styled.div`
    background-color: rgba(15,245,172,0.25);
    width: 100%;
    height: 100%;
    border-radius: 14px;
`;

const FlowchartWrapper = styled.div`
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
            <ResizableBox />
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


interface FlowchartBox {
    name: string
    left: any // percentage
    top: any
    right: any
    bottom: any
}

const flowchartBoxes: Array<FlowchartBox> = [
    {
        name: "ecs 1100",
        top: 8.8,
        left: 35.2,
        bottom: 88.3,
        right: 57.5
    }
]

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0"
};


const ResizableBox: FunctionComponent<{}> = () => {
    const ref = React.useRef(null)
    return <Rnd
        //default={{x: 0, y:0, width: '10%', height: '10%'}}
        style={style}
        //size={{ width: width, height: height }}
        //position={{ x: x, y: y }}
        onDragStop={(e, d) => {

            if (e.target) {
                const event = e as Event
                const flowchart = (e.target as HTMLElement)?.parentElement?.parentElement
                if (flowchart) {
                    const x = d.x / flowchart.offsetWidth * 100
                    const y = d.y / flowchart.offsetHeight * 100
                    console.log({ x, y })
                }
            }
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
            //console.log(direction, position, delta)
            //console.log(`width: ${ref.offsetWidth}px height: ${ref.offsetHeight}px `)
        }}
    >
        <SolidBox ref={ref}>hi</SolidBox>
    </Rnd>
}