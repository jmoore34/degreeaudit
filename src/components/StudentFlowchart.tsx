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
// @ts-ignore
import { RadioGroup, RadioButton } from 'react-radio-buttons';
// @ts-ignore
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import Button from "@material-ui/core/Button/Button";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
//@ts-ignore
import html2PDF from 'jspdf-html2canvas';
import Color from "color";


export const StudentFlowchart: FunctionComponent<{}> = () => {
    // map of courses to the semester the student plans to take them
    const [courseSemestersMap, setCourseSemesters]: any = useSemesterMapState()
    // course selected / to be shown in CourseInfoBox
    const [selectedCourse, setSelectedCourse]: any = useState("");
    // map of courses to a "nick name"
    // in practice, this is used for giving more specific selections to cores, electives, etc.
    // e.g. this allows a student to assign LIT 1302 to a core
    const [nicknameMap, setNicknameMap]: any = useNicknameMapState({})

    // hook to make the page responsive to resize
    useRerenderOnResizeAndOnScroll()

    const [selectedMajor, setSelectedMajor] = useSelectedMajorState<DropdownItem | null>(dropdownDefaultMajor)
    const [selectedYear, setSelectedYear] = useSelectedYearState<DropdownItem | null>(studentDropdownDefaultYear)
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
                    options={studentDropdownYears}
                />
                <WhiteSpaceBlock />
                <Button variant="contained" onClick={() => {

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
                                link.download = "flowchart.png";
                                link.href = canvas.toDataURL("image/png");
                                link.target = '_blank';
                                link.click();
                            });
                        }, 50); // hack: give the page a change to rerender before taking the screenshot
                    }

                }}>Export as Image</Button>
                <WhiteSpaceBlock size="1em" />
                <Button variant="contained" onClick={() => {

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
            <CourseInfoBox
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
            <FlowchartBackground src={"http://127.0.0.1:5000/api/img/" + selectedFlowchart + ".png"} />
            {flowchart.map(box => <>
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
                    setConfirmDialogOpen(false)
                }}
                    color="secondary">
                    Delete
                            </Button>
            </DialogActions>
        </Dialog>
    </>



}





