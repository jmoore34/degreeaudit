import React, { FunctionComponent, useState } from "react";
import {CourseInfoBox, currentSemester, semesterGenerator} from "./CourseInfoBox";
import { getColorOfSemester, renameSemester, useRerenderOnResizeAndOnScroll } from "../util";
import html2canvas from "html2canvas";
import { BoxAnnotation, BoxAnnotationText } from "./BoxAnnotation";
import { Row, StyledSelect, WhiteSpaceBlock, AccordionContainer } from "./small_components";
import {
    dropdownDefaultMajor,
    advisorDropdownDefaultYear,
    DropdownItem,
    dropdownMajors,
    advisorDropdownYears,
    studentDropdownYears, studentDropdownDefaultYear
} from "../dropdownData";
import { useFlowchart } from "../useFlowchart";
import { FlowchartBackground, FlowchartBox, FlowchartWrapper, HighlightBox } from "./flowchart_components_in_common";
import {
    useNicknameMapState,
    useSelectedMajorState,
    useSelectedYearState,
    useSemesterMapState
} from "../persistentStateHooks";
import { StyledRadioGroup } from "../App";
// Some component libraries aren't written in Typescript; hence we tell Typescript it's okay not try to type-check them
// @ts-ignore
import { RadioGroup, RadioButton } from 'react-radio-buttons';
// @ts-ignore
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import {Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core"
//@ts-ignore
import html2PDF from 'jspdf-html2canvas';
import Color from "color";

// Used to reset image cache on page load in case advisors have changed flowchart images
// (I.e., random value that is chosen once per session and appended to image requests to force the browser to not
// use possibly stale versions of the images from previous sessions)
const flowchartImageVersion = Math.random()

export const StudentFlowchart: FunctionComponent<{}> = () => {
    // map of courses to the semester the student plans to take them
    const [courseSemestersMap, setCourseSemesters]: any = useSemesterMapState()
    // course (name) selected / to be shown in CourseInfoBox
    const [selectedCourse, setSelectedCourse]: any = useState("");
    // map of courses to a "nick name"
    // in practice, this is used for giving more specific selections to cores, electives, etc.
    // e.g. this allows a student to assign LIT 1302 to a core (e.g. Core''')
    //  Subnote: Often a flowchart will have several courses with the same name (e.g. "Core")
    //  However, because we are using a map, we want course names to be unique
    //  So, we internally store these course names as Core, Core', Core'', etc.
    //  But we hide this from both the advisor and student by removing these characters before rendering course names
    //  So an advisor will just create a new course box named "Core" and the rename handler will worry about modifying
    //  the name under the hood to make it unique. (It will still be rendered just as "Core")
    const [nicknameMap, setNicknameMap]: any = useNicknameMapState({})

    // hook to make the page responsive to resize
    useRerenderOnResizeAndOnScroll()

    // Following two hooks are custom because they also sync their state with LocalStorage
    const [selectedMajor, setSelectedMajor] = useSelectedMajorState<DropdownItem | null>(dropdownDefaultMajor)
    const [selectedYear, setSelectedYear] = useSelectedYearState<DropdownItem | null>(studentDropdownDefaultYear)
    // Name of selected flowchart (e.g. "CS2021")
    const selectedFlowchart = (selectedYear?.value && selectedMajor?.value) ? (selectedMajor.value + selectedYear.value) : ""
    const [mode, setMode] = useState("flowchart") // visual flowchart vs overview/list view
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // used for the confirm clear all dialog
    const { flowchart } = useFlowchart(selectedFlowchart) // hook that gets the selected flowchart's course box positioning data from the server

    // Displayed in visual flowchart mode
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
                    options={studentDropdownYears}
                />
                <WhiteSpaceBlock />
                <Button variant="contained" onClick={() => { // Button to export flowchart as image

                    const exportPage = document.getElementsByClassName("exportImage");

                    //console.log(exportPage)

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
                                link.download = "flowchart.png";
                                link.href = canvas.toDataURL("image/png");
                                link.target = '_blank';
                                link.click();
                            });
                        }, 50); // hack: give the page a change to rerender before taking the screenshot
                    }

                }}>Export as Image</Button>
                <WhiteSpaceBlock size="1em" />
                <Button variant="contained" onClick={() => { // Export as PDF button

                    const exportPage = document.getElementsByClassName("exportImage");

                    console.log(exportPage)

                    if (exportPage) {
                        setSelectedCourse(null); // so that the CourseInfoBox is hidden
                        setTimeout(() => {
                            //html2canvas library: https://html2canvas.hertzen.com/

                            //document.body.appendChild(canvas)
                            html2PDF(exportPage, {
                                html2canvas: {
                                    useCORS: true
                                },
                                jsPDF: {
                                    format: 'a4',
                                },
                                imageType: 'image/jpeg',
                                output: 'flowchart.pdf'
                            });

                        }, 50); // hack: give the page a change to rerender before taking the screenshot
                    }

                }}>Export as PDF</Button>
                <WhiteSpaceBlock size="1em" />
                <Button variant="contained" color="secondary" onClick={() => {
                    setConfirmDialogOpen(true)
                }}>Clear</Button>

            </Row>
        </div>
        <FlowchartWrapper className='exportImage'>
            <CourseInfoBox // info box that pops up when a course is selected
                flowchartBox={(flowchart.find(box => box.name === selectedCourse)) ?? null as FlowchartBox | null}
                semester={courseSemestersMap[selectedCourse]}
                onSemesterChanged={(newSemester: string) => {
                    const newMap = { ...courseSemestersMap, [selectedCourse]: newSemester }
                    setCourseSemesters(newMap);
                }}
                onClose={() => {
                    setSelectedCourse('');
                }}
                catalogYear={selectedYear?.value}
                major={selectedMajor?.value}
                courseNickName={nicknameMap[selectedCourse]}
                setCourseNickName={(nickName: string) => {
                    const newMap = { ...nicknameMap, [selectedCourse]: nickName }
                    setNicknameMap(newMap)
                }}
            />
            <FlowchartBackground src={"http://127.0.0.1:5000/api/img/" + selectedFlowchart + `.png?ver=${flowchartImageVersion}`} />
            {flowchart.map(box => <>
                {/*The colored course boxes, as well as their corresponding annotations which display the course's name*/}
                <HighlightBox box={box}
                    color={getColorOfSemester(courseSemestersMap[box.name])}
                    onClick={() => {
                        setSelectedCourse(box.name);
                    }}
                >

                </HighlightBox>
                <BoxAnnotation boxHeight={0}>
                    <BoxAnnotationText>
                        {nicknameMap[box.name]}
                    </BoxAnnotationText>
                    <BoxAnnotationText color={Color(getColorOfSemester(courseSemestersMap[box.name])).darken(0.7).toString()}>
                        {courseSemestersMap[box.name] ?? ""}
                    </BoxAnnotationText>
                </BoxAnnotation>
            </>
            )}
        </FlowchartWrapper>
    </>

    // Overview/list view
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


        <Dialog // Confirmation dialog for deleting all class selections, only shown/visible after clear all button pressed
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Clear course plan"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete all your class selections in all your flowcharts?
                                                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmDialogOpen(false)} color="primary" autoFocus>
                    Cancel
                           </Button>
                <Button onClick={() => {
                    setCourseSemesters({})
                    setConfirmDialogOpen(false)
                }}
                    color="secondary">
                    Delete
                            </Button>
            </DialogActions>
        </Dialog>
    </>



}





