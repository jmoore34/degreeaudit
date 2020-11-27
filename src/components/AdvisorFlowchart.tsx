import styled from "styled-components";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { CourseInfoBox } from "./CourseInfoBox";
import cs from "../flowcharts/cs.webp";
import { FlowchartBackground, FlowchartBox, FlowchartWrapper, getColorOfSemester, HighlightBox } from "./Flowchart";
import { Rnd } from "react-rnd";
import { useRerenderOnResize } from "../util";
import axios from 'axios';
import Select from "react-select";

const courseNamePrompt = "Enter the class name"
const major: any = [
    { value: 'BMEN', label: 'Biomedical Engineering' },
    { value: 'CE', label: 'Computer Engineering' },
    { value: 'CS', label: 'Computer Science' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'ME', label: 'Mechancial Engineering' },
    { value: 'SE', label: 'Software Engineering' },
];

const years: any = [
    { value: '2016', label: '2016' },
    { value: '2017', label: '2017' },
    { value: '2018', label: '2018' },
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
];

const defaultMajor = major[0]
const defaultYear = years[0]

// Given a name, returns a modified version of the name that is sure to be unique
const CHAR_TO_APPEND_TO_NAMES = "'"
function ensureNameUnique(name: string, existingNames: Array<string>) {
    while (existingNames.includes(name))
        name += CHAR_TO_APPEND_TO_NAMES
    return name
}

export const AdvisorFlowchart: FunctionComponent<{}> = () => {
    const flowchartRef = React.useRef(null)
    const [flowchartElement, setFlowchartElement] = useState<any>(null)
    useRerenderOnResize()

    const [selectedMajor, setSelectedMajor] = useState<{ value: string, label: string }>(defaultMajor)
    const [selectedYear, setSelectedYear] = useState<{ value: string, label: string }>(defaultYear)

    const selectedFlowchart = (selectedYear?.value && selectedMajor?.value) ? (selectedMajor.value + selectedYear.value) : ""

    // __setFlowchart updates the local state only and should not be called directly
    // Instead, flowchart updates should call updateFlowchart(), which both updates the local
    // state by calling __setFlowchart as well as sends the changes to the server
    const [flowchart, __setFlowchart] = useState<Array<FlowchartBox>>([])

    async function updateFlowchart(newFlowchart: any) {
        var formData = new FormData();
        formData.append("filename", selectedFlowchart + ".json");
        formData.append("body", JSON.stringify(newFlowchart));
        formData.append("password", "password");
        axios.post('http://127.0.0.1:5000/api/json', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        __setFlowchart(newFlowchart)
    }

    return <>
        <Row>
            <Column>
                <h2>Choose which flowchart to use</h2>
                <Row>
                    <StyledSelect
                        defaultValue={defaultMajor}
                        onChange={(newVal: any) => {
                            setSelectedMajor(newVal)
                        }}
                        options={major}
                    />
                    <StyledSelect
                        defaultValue={defaultYear}
                        onChange={(newVal: any) => {
                            setSelectedYear(newVal)
                        }}
                        options={years}
                    />
                </Row>
            </Column>
            <Column><WhiteSpaceBlock /></Column>
            <Column>
                <h2>Upload new Files</h2>
                <form method='post' encType='multipart/form-data'>
                    <input
                        type='file'
                        name='upload'
                        onChange={e => {
                            debugger;
                            if (e.target.files && e.target.files[0]) {
                                var formData = new FormData();
                                formData.append("file", e.target.files[0]);
                                formData.append("password", "password");
                                axios.post('http://127.0.0.1:5000/api/pdf', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                })
                            }
                        }}
                    />
                    <input type='password' name='password' />
                </form>
            </Column>
        </Row>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={cs}
                onLoad={() => setFlowchartElement(flowchartRef.current)}
                onContextMenu={e => {
                    e.preventDefault()
                    if (flowchartElement != null) {
                        let name = prompt(courseNamePrompt)
                        if (name == null || name.length < 4)
                            return
                        const existingNames = flowchart.map(box => box.name)
                        name = ensureNameUnique(name, existingNames)
                        const flowchartBox = flowchartElement.getBoundingClientRect()
                        const width = 7.53
                        const height = 3.9
                        const newFlowchart = [...flowchart, {
                            name,
                            width,
                            height,
                            left: (e.clientX - flowchartBox.left) / flowchartBox.width * 100 - width / 2,
                            top: (e.clientY - flowchartBox.top) / flowchartBox.height * 100 - height / 2
                        }]
                        console.log(newFlowchart)
                        updateFlowchart(newFlowchart)
                    }
                }} />
            {flowchart.map((box: FlowchartBox) => <ResizableBox
                box={box}
                flowchart={flowchartElement}
                onBoxChange={(box: FlowchartBox) => {
                    const newFlowchart = [...flowchart]
                    newFlowchart[flowchart.findIndex(b => b.name === box.name)] = box
                    console.log(newFlowchart)
                    updateFlowchart(newFlowchart)
                }}
                onRename={(oldName, newName) => {
                    const existingNames = flowchart.map(box => box.name)
                    newName = ensureNameUnique(newName, existingNames)
                    let newFlowchart = [...flowchart]
                    newFlowchart[flowchart.findIndex(b => b.name === oldName)].name = newName
                    newFlowchart = newFlowchart.filter(b => b.name && b.name.length > 4)
                    console.log(newFlowchart)
                    updateFlowchart(newFlowchart)
                }}
            />)}
        </FlowchartWrapper>
    </>


}
const WhiteSpaceBlock = styled.div`
    min-width: 3em;
    max-width: 20vw;
    display: block;
`


const Column = styled.div`
    display: flex;
    flex-direction: column;

`
const Row = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
`


const StyledSelect = styled(Select)`
    width: 20ch;
    margin: 10px;

`

const resizeableBoxStyle = (circle: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    backgroundColor: "rgba(217,51,118,0.3)",
    borderRadius: circle ? "200%" : "20%",
});

const BoxAnnotation = styled.div<{ boxHeight: number }>`
  margin-top: ${props => props.boxHeight * 1.3}px;
  font-size: 1vmax;
  background-color: rgba(255,255,255,0.7);
  font-weight: bold;
  position: absolute;
  color: black;
  float: left;
`;

interface ResizeableBoxProps {
    box: FlowchartBox
    onBoxChange: (box: FlowchartBox) => any
    onRename: (oldName: string, newName: string) => any
    flowchart: HTMLElement | null
}
const ResizableBox: FunctionComponent<ResizeableBoxProps> = (props) => {
    const rndRef = useRef(null)

    if (props.flowchart == null || props.flowchart.clientWidth > props.flowchart.clientHeight)
        return null

    const flowchart = props.flowchart.getBoundingClientRect()
    const x = props.box.left / 100 * flowchart.width
    const y = props.box.top / 100 * flowchart.height
    const width = props.box.width / 100 * flowchart.width
    const height = props.box.height / 100 * flowchart.height
    //debugger;

    // console.log(props.box)
    // console.log({x, y, width, height})

    return <Rnd
        ref={rndRef}
        size={{ width, height }}
        position={{ x, y }}
        style={resizeableBoxStyle(props.box.name.includes("core"))}
        onDragStop={(e, data) => {
            props.onBoxChange({
                ...props.box,
                left: (data.x) / flowchart.width * 100,
                top: (data.y) / flowchart.height * 100
            })
            console.log("dragged")
        }}
        onResizeStop={(e, dir, refToElement, delta, position) => {
            const rect = refToElement.getBoundingClientRect()
            props.onBoxChange({
                ...props.box,
                width: 100 * rect.width / flowchart.width,
                height: 100 * rect.height / flowchart.height,
                left: 100 * (rect.left - flowchart.left) / flowchart.width,
                top: 100 * (rect.top - flowchart.top) / flowchart.height
            })
            console.log("resized")
        }}
        onContextMenu={(e: Event) => {
            e.preventDefault()
            const newName = prompt(courseNamePrompt + "\n\n(Leave empty to delete box)")
            if (newName === null)
                return
            props.onRename(props.box.name, newName);
        }}
    >
        <BoxAnnotation boxHeight={height}>{props.box.name.replace(CHAR_TO_APPEND_TO_NAMES, "")}</BoxAnnotation>
    </Rnd>
}