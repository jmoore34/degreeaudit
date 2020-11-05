import styled from "styled-components";
import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {CourseInfoBox} from "./CourseInfoBox";
import cs from "../flowcharts/cs.webp";
import {FlowchartBackground, FlowchartBox, FlowchartWrapper, getColorOfSemester, HighlightBox} from "./Flowchart";
import {Rnd} from "react-rnd";


export const AdvisorFlowchart: FunctionComponent<{}> = () => {
    const flowchartRef = React.useRef(null)
    const [flowchartElement, setFlowchartElement] = useState<any>(null)

    useEffect(() => {
        setFlowchartElement(flowchartRef.current)
    })

    const [flowchart, setFlowchart]: any = useState([
        {
            name: "ecs 1100",
            top: 8.8,
            left: 35.2,
            bottom: 88.3,
            right: 57.5
        }
    ])

    return <>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={cs} />
            {flowchart.map((box: FlowchartBox) => <ResizableBox
                    box={box}
                    flowchart={flowchartElement}
                    onBoxChange={(box: FlowchartBox) => {
                        const newFlowchart = {...flowchart, box}
                        setFlowchart(newFlowchart)
                    }}
                />)}
        </FlowchartWrapper>
    </>


}

const resizeableBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    backgroundColor: "rgb(217,51,118)",
    borderRadius: "20%",
    opacity: 0.3
};


const ResizableBox: FunctionComponent<{box: FlowchartBox, onBoxChange: (box: FlowchartBox) => any, flowchart: HTMLElement | null}> = (props) => {
    const rndRef = useRef(null)
    if (props.flowchart == null)
        return <></>

    const flowchart = props.flowchart.getBoundingClientRect()
    const x = props.box.left/100 * flowchart.width
    const y =  props.box.top/100 * flowchart.height
    const width = props.box.width/100 * flowchart.width
    const height = props.box.height/100 * flowchart.height

    const onEvent = () => {

        console.log(rndRef)
           /* props.onBoxChange({
                left: 100 * box.left / flowchart.width,
                top: 100 * box.top / flowchart.height,
                width: 100 * box.width / flowchart.width,
                height: 100 * box.height / flowchart.height,
                name: props.box.name
            })*/

    }

    return <Rnd
        ref={rndRef}
        default={{x, y, width, height}}
        style={resizeableBoxStyle}
        onDragStop={onEvent}
        onResizeStop={onEvent}
    />
}