import React, {FunctionComponent, useEffect, useReducer, useRef, useState} from "react";
import { FlowchartBackground, FlowchartWrapper, FlowchartBox } from "./flowchart_components_in_common";
import { Rnd } from "react-rnd";
import { useRerenderOnResizeAndOnScroll } from "../util";
import axios from 'axios';
import { BoxAnnotation } from "./BoxAnnotation";
import { unathorizedMessage, useFlowchart } from "../useFlowchart";
import { Column, Input, Row, StyledSelect, WhiteSpaceBlock } from "./small_components";
import { dropdownDefaultMajor, advisorDropdownDefaultYear, DropdownItem, dropdownMajors, advisorDropdownYears } from "../dropdownData";
import { useSelectedMajorState, useSelectedYearState } from "../persistentStateHooks";
import { enteredAdvisorPassword } from "../App";
import {ensureNameUnique, getReadableCourseName} from "../regex";
import {Button} from "@material-ui/core";

const courseNamePrompt = "Enter the class name"



export const AdvisorFlowchart: FunctionComponent<{}> = () => {
    // Like the student flowchart, a ref is needed because relative box sizing requires information about the size of the flowchart
    const flowchartRef = React.useRef(null)
    // Similar purpose as above, useful because it causes boxes to rerender when a new flowchart image is loaded
    const [flowchartElement, setFlowchartElement] = useState<any>(null)
    // Important hook that allows the flowchart to be responsive to screen size changes (i.e. resize) & scrolling (i.e., ensure position data correct)
    useRerenderOnResizeAndOnScroll()

    // State of top selectors (custom hooks auto-synchronize this state with LocalStorage)
    const [selectedMajor, setSelectedMajor] = useSelectedMajorState<DropdownItem | null>(dropdownDefaultMajor)
    const [selectedYear, setSelectedYear] = useSelectedYearState<DropdownItem | null>(advisorDropdownDefaultYear)

    // Computed value - current flowchart name (i.e. "CS2021")
    const selectedFlowchart = (selectedYear?.value && selectedMajor?.value) ? (selectedMajor.value + selectedYear.value) : ""

    // Hook for the JSON box positioning data for the current flowchart
    // updateFlowchart changes the JSON data for the current flowchart
    // This is a custom hook rather than a simple useState because besides holding state, it also gets & sends data to/from the server
    const { flowchart, updateFlowchart } = useFlowchart(selectedFlowchart)

    // flowchartImageVersion appended to the `src` tag of the flowchart image
    // Incremented on image uploads by calling incrementFlowchartImageVersion()
    // This doesn't actually change the image that's fetched from the server
    // ∴ forces image rerender when a new flowchart image is uploaded
    // (otherwise the browser will always cache the image, which is a problem when the advisor makes changes)
    const [flowchartImageVersion, incrementFlowchartImageVersion] = useReducer( (old: number) => old + Math.random(), Math.random())

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
                        options={advisorDropdownYears}
                    />
                </Row>
            </Column>
            <Column><WhiteSpaceBlock /></Column>
            <Column>
                <h2>Replace current flowchart's PDF</h2>
                {/* https://kiranvj.com/blog/blog/file-upload-in-material-ui/ */ }
                <label>
                    {/* File upload: We use a hidden <input type="file"> for the actual browser functionality, but the user sees the Material UI button. */}
                    <input
                        style={{display: "none"}} // gives functionality, but MUI button is what user actually sees
                        type='file'
                        name='upload'
                        id="upload"
                        onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                                if (e.target.files[0].type !== "application/pdf") {
                                    alert("Error: Expected a PDF file")
                                    return
                                }
                                var formData = new FormData();
                                formData.append("file", e.target.files[0]);
                                formData.append("password", enteredAdvisorPassword);
                                formData.append("flowchartName", selectedFlowchart.replace(" ", ""))
                                const response = axios.post('http://127.0.0.1:5000/api/pdf', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(() => {
                                    //console.log("Then");
                                    const year = selectedYear;
                                    incrementFlowchartImageVersion()
                                }).catch((err) => {
                                    if (err && err.message && err.message.includes("401"))
                                        alert(unathorizedMessage)
                                    else
                                        alert(err + " " + JSON.stringify(err))
                                })
                            }
                        }}
                    />
                    <Button variant="contained" component="span">
                        Upload flowchart
                    </Button>
                </label>
            </Column>
        </Row>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={"http://127.0.0.1:5000/api/img/" + selectedFlowchart + ".png" + `?ver=${flowchartImageVersion}`}
                onLoad={() => setFlowchartElement(flowchartRef.current)}
                onContextMenu={e => {
                    // Right clicking flowchart creates a new flowchart box
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
                // When the boxes are moved, renamed, deleted (by renaming to empty string), etc, they notify us here
                // We then update the flowchart box map to reflect their change (they can't do this themselves because they can only
                // change their local state, not the whole flowchart state)
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

// We usually use styled-components to style things
// However this is an exception for the drag and drop boxes
// A refactor to use styled-components here may be possible but isn't strictly necessary
const resizeableBoxStyle = (circle: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    backgroundColor: "rgba(217,51,118,0.3)",
    borderRadius: circle ? "200%" : "17.5%",
});


// Like FlowchartBox for student, but editable (draggable, renameable, etc)
// Takes relative sizes and positions (% not pixels); internally converts to and from pixels under the hood
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

    // From a black-box POV, ResizeableBox takes and outputs just relative sizes and positions
    // because we want relative sizes so it works on any screen size
    // However, the drag and drop library uses absolute coordinates & sizes relative to its container (that is, pixels)
    // So we convert as needed
    const flowchart = props.flowchart.getBoundingClientRect()
    const x = props.box.left / 100 * flowchart.width
    const y = props.box.top / 100 * flowchart.height
    const width = props.box.width / 100 * flowchart.width
    const height = props.box.height / 100 * flowchart.height
    //debugger;

    // console.log(props.box)
    // console.log({x, y, width, height})

    //https://github.com/bokuweb/react-rnd
    return <>
        <Rnd
            ref={rndRef}
            size={{ width, height }}
            position={{ x, y }}
            style={resizeableBoxStyle(props.box.name.includes("core"))}
            // Dragging and dropping flowchart boxes (with left mouse pointer) works as expected
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
            }}
            // Right clicking a flowchart box opens rename dialog
            // Entering an empty name deletes the box
            onContextMenu={(e: Event) => {
                e.preventDefault()
                const newName = prompt(courseNamePrompt + "\n\n(Leave empty to delete box)")
                if (newName === null)
                    return
                props.onRename(props.box.name, newName);
            }}
        >

        </Rnd>

        {/*Shows course name under each box*/}
        <BoxAnnotation boxHeight={height} style={{
            top: (y + height) + "px",
            left: x + "px",
            width: width + "px",
            textOverflow: "ellipsis",
            overflowX: "hidden"
        }}>{getReadableCourseName(props.box.name)}
        </BoxAnnotation>
    </>
}