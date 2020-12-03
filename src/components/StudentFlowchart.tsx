import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { CourseInfoBox } from "./CourseInfoBox";
import {getColorOfSemester, renameSemester, useRerenderOnResizeAndOnScroll} from "../util";
import html2canvas from "html2canvas";
import {BoxAnnotation} from "./BoxAnnotation";
import {Button, Row, StyledSelect, WhiteSpaceBlock} from "./small_components";
import {dropdownDefaultMajor, dropdownDefaultYear, DropdownItem, dropdownMajors, dropdownYears} from "../dropdownData";
import {useFlowchart} from "../useFlowchart";
import {FlowchartBackground, FlowchartBox, FlowchartWrapper, HighlightBox} from "./flowchart_components_in_common";
import {useSelectedMajorState, useSelectedYearState} from "../persistentStateHooks";

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

    const selectedFlowchart = (selectedYear?.value && selectedMajor?.value) ? (selectedMajor.value + selectedYear.value) : ""

    const { flowchart } = useFlowchart(selectedFlowchart)

    return <>
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
            </Row>
        </div>
        <FlowchartWrapper className='exportImage' ref={ref}>
            <CourseInfoBox flowchartBox={(flowchart.find(box => box.name === selectedCourse)) ?? null as FlowchartBox | null}
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


}





