import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {FlowchartBackground, FlowchartWrapper, FlowchartBox} from "./flowchart_components_in_common";
import { Rnd } from "react-rnd";
import { useRerenderOnResize } from "../util";
import axios from 'axios';
import {BoxAnnotation} from "./BoxAnnotation";
import {unathorizedMessage, useFlowchart} from "../useFlowchart";
import {Column, Input, Row, StyledSelect, WhiteSpaceBlock} from "./small_components";
import {dropdownDefaultMajor, dropdownDefaultYear, DropdownItem, dropdownMajors, dropdownYears} from "../dropdownData";
import {useSelectedMajorState, useSelectedYearState} from "../persistentStateHooks";
import {enteredAdvisorPassword} from "../App";

const courseNamePrompt = "Enter the class name"


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

    const [selectedMajor, setSelectedMajor] = useSelectedMajorState<DropdownItem | null>(dropdownDefaultMajor)
    const [selectedYear, setSelectedYear] = useSelectedYearState<DropdownItem | null>(dropdownDefaultYear)

    const selectedFlowchart = (selectedYear?.value && selectedMajor?.value) ? (selectedMajor.value + selectedYear.value) : ""

    const {flowchart, updateFlowchart} = useFlowchart(selectedFlowchart)

    return <>
        <Row>
            <Column>
                <h2>Choose which flowchart to use</h2>
                <Row>
                    <StyledSelect
                        defaultValue={selectedMajor}
                        onChange={(newVal: any) => {
                            setSelectedMajor(newVal)
                        }}
                        options={dropdownMajors}
                    />
                    <StyledSelect
                        defaultValue={selectedYear}
                        onChange={(newVal: any) => {
                            setSelectedYear(newVal)
                        }}
                        options={dropdownYears}
                    />
                </Row>
            </Column>
            <Column><WhiteSpaceBlock /></Column>
            <Column>
                <h2>Replace current flowchart's PDF</h2>
                <form method='post' encType='multipart/form-data'>
                    <Input
                        type='file'
                        name='upload'
                        onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                                var formData = new FormData();
                                formData.append("file", e.target.files[0]);
                                formData.append("password", enteredAdvisorPassword);
                                const response = axios.post('http://127.0.0.1:5000/api/pdf', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(() => {
                                    console.log("Then");
                                    const year = selectedYear;
                                    setSelectedYear(null);
                                    setSelectedYear(year);
                                }).catch((err) => {
                                    if (err && err.message && err.message.includes("401"))
                                        alert(unathorizedMessage)
                                    else
                                        alert(err + " " + JSON.stringify(err))
                                })
                            }
                        }}
                    />
                </form>
            </Column>
        </Row>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={"http://127.0.0.1:5000/api/img/" + selectedFlowchart + ".png"}
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
                    newFlowchart = newFlowchart.filter(b => b.name && b.name.length >= 4) // delete empty boxes. shortest course name is "core"
                    console.log(newFlowchart)
                    updateFlowchart(newFlowchart)
                }}
            />)}
        </FlowchartWrapper>
    </>


}


const resizeableBoxStyle = (circle: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    backgroundColor: "rgba(217,51,118,0.3)",
    borderRadius: circle ? "200%" :  "17.5%",
});



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

    return <>
            <Rnd
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
                const newBox = {
                    ...props.box,
                    width: 100 * rect.width / flowchart.width,
                    height: 100 * rect.height / flowchart.height,
                    left: 100 * (rect.left - flowchart.left) / flowchart.width,
                    top: 100 * (rect.top - flowchart.top) / flowchart.height
                }
                props.onBoxChange(newBox)
                // Experimental fix (set the state again slightly later) for resizeable boxes teleporting (only sometimes) on resize
                setTimeout(() => {
                    const rect = refToElement.getBoundingClientRect()
                    const newBox = {
                        ...props.box,
                        width: 100 * rect.width / flowchart.width,
                        height: 100 * rect.height / flowchart.height,
                        left: 100 * (rect.left - flowchart.left) / flowchart.width,
                        top: 100 * (rect.top - flowchart.top) / flowchart.height
                    }
                    props.onBoxChange(newBox)
                }, 15)
            }}
            onContextMenu={(e: Event) => {
                e.preventDefault()
                const newName = prompt(courseNamePrompt + "\n\n(Leave empty to delete box)")
                if (newName === null)
                    return
                props.onRename(props.box.name, newName);
            }}
        >

        </Rnd>
        <BoxAnnotation boxHeight={height} style={{
                top: (y + height) + "px",
                left: x + "px",
                width: width + "px",
                textOverflow: "ellipsis",
                overflowX: "hidden"
            }}>{props.box.name.replace(/'/g, "")}
        </BoxAnnotation>
    </>
}