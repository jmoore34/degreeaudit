import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { CourseInfoBox, semesterGenerator } from "./CourseInfoBox";
import { getColorOfSemester, renameSemester, useRerenderOnResizeAndOnScroll } from "../util";
import html2canvas from "html2canvas";
import { BoxAnnotation } from "./BoxAnnotation";
import { Button, Row, StyledSelect, WhiteSpaceBlock, AccordionContainer } from "./small_components";
import { dropdownDefaultMajor, dropdownDefaultYear, DropdownItem, dropdownMajors, dropdownYears } from "../dropdownData";
import { useFlowchart } from "../useFlowchart";
import { FlowchartBackground, FlowchartBox, FlowchartWrapper, HighlightBox } from "./flowchart_components_in_common";
import { useSelectedMajorState, useSelectedYearState } from "../persistentStateHooks";
import { StyledRadioGroup } from "../App";
// @ts-ignore
import { RadioGroup, RadioButton } from 'react-radio-buttons';
// @ts-ignore
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";


const localStorageKey = "courseSemesters"
// load the student's course->semester mappings from localStorage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
// defaulting to an empty map
const initialSemesterMap = JSON.parse(localStorage.getItem(localStorageKey) ?? "{}") ?? {}
// postprocess this map to rename past semesters (e.g. "Fall 2015") to "Taken"
function postprocessSemesterMap(semesterMap: any) {
    let result: any = {};
    for (const [course, semester] of Object.entries(semesterMap)) {
        if (course && semester) {
            result[course] = renameSemester(semester as string)
        }
    }
    return result
}
const postprocessedInitialSemesterMap = postprocessSemesterMap(initialSemesterMap)


export const StudentFlowchart: FunctionComponent<{}> = () => {
    const ref = React.useRef(null)
    const [courseSemestersMap, setCourseSemesters]: any = useState(postprocessedInitialSemesterMap);
    const [selectedCourse, setSelectedCourse]: any = useState("");

    useRerenderOnResizeAndOnScroll()

    const [selectedMajor, setSelectedMajor] = useSelectedMajorState<DropdownItem | null>(dropdownDefaultMajor)
    const [selectedYear, setSelectedYear] = useSelectedYearState<DropdownItem | null>(dropdownDefaultYear)
    const [mode, setMode] = useState("flowchart") // flowchart vs overview
    const selectedFlowchart = (selectedYear?.value && selectedMajor?.value) ? (selectedMajor.value + selectedYear.value) : ""
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const { flowchart } = useFlowchart(selectedFlowchart)

    const flowView = <>
        <div>
            <h1>Please color your classes according to which semester you plan on taking them</h1>
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
                <WhiteSpaceBlock />
                <Button onClick={() => {

                    const exportPage = document.getElementsByClassName("exportImage");

                    console.log(exportPage)

                    if (exportPage) {
                        setSelectedCourse(null); // so that the CourseInfoBox is hidden
                        setTimeout(() => {
                            //html2canvas library: https://html2canvas.hertzen.com/
                            html2canvas(exportPage[0] as HTMLElement, {
                                useCORS: true
                            }).then(canvas => {
                                //document.body.appendChild(canvas)
                                var link = document.createElement("a");
                                document.body.appendChild(link);
                                link.download = "html_image.png";
                                link.href = canvas.toDataURL("image/png");
                                link.target = '_blank';
                                link.click();
                            });
                        }, 50); // hack: give the page a change to rerender before taking the screenshot
                    }

                }}>Export PDF as Image</Button>
                <Button onClick={() => {
                    setConfirmDialogOpen(true)
                }}>Clear</Button>

            </Row>
        </div>
        <FlowchartWrapper className='exportImage' ref={ref}>
            <CourseInfoBox
                flowchartBox={(flowchart.find(box => box.name === selectedCourse)) ?? null as FlowchartBox | null}
                semester={courseSemestersMap[selectedCourse]}
                onSemesterChanged={(newSemester: string) => {
                    const newMap = { ...courseSemestersMap, [selectedCourse]: newSemester }
                    //Local Storage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
                    localStorage.setItem(localStorageKey, JSON.stringify(newMap));
                    //console.log(localStorage.getItem(localStorageKey));
                    setCourseSemesters(newMap);
                }}
                onClose={() => {
                    setSelectedCourse('');
                }}
                catalogYear={selectedYear?.value}
                major={selectedMajor?.value}
            />
            <FlowchartBackground src={"http://127.0.0.1:5000/api/img/" + selectedFlowchart + ".png"} />
            {flowchart.map(box => <>
                <HighlightBox box={box}
                    color={getColorOfSemester(courseSemestersMap[box.name])}
                    onClick={() => {
                        setSelectedCourse(box.name);
                    }}
                >

                </HighlightBox>
                <BoxAnnotation boxHeight={0}>{courseSemestersMap[box.name]}</BoxAnnotation>
            </>
            )}
        </FlowchartWrapper>
    </>

    // @ts-ignore
    const semesters = ["Taken", ...semesterGenerator()]
    const overView = <>
        <AccordionContainer>
            <Accordion atomic={false}>
                {semesters.map((sem) =>
                    <AccordionItem title={sem}>
                        {Object.entries(courseSemestersMap).filter(([, semester]: any) => semester === sem).map(([course,]) =>
                            <p>{course.replace(/'/g, "")}</p>
                        )}
                    </AccordionItem>
                )}
            </Accordion>
        </AccordionContainer>
    </>

    return <>
        <br></br>
        <StyledRadioGroup onChange={setMode} value={mode} horizontal>
            <RadioButton value={"flowchart"}>Flowchart</RadioButton>
            <RadioButton value={"overview"}>Overview</RadioButton>
        </StyledRadioGroup>

        {mode === "flowchart" ? flowView : overView}


        <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Clear course history"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete all your classes in all your flowcharts?
                                                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmDialogOpen(false)} color="primary" autoFocus>
                    Cancel
                           </Button>
                <Button onClick={() => {
                    setCourseSemesters({})
                    localStorage.setItem(localStorageKey, "{}");
                    setConfirmDialogOpen(false)
                }}
                    color="secondary">
                    Delete
                            </Button>
            </DialogActions>
        </Dialog>
    </>



}





