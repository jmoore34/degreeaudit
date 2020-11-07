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

    const [flowchart, setFlowchart] = useState<Array<FlowchartBox> >([
        {
            name: "ecs 1100",
            top: 14.7,
            left: 44.5,
            width: 7.3,
            height: 3.3
        }
    ])

    return <>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={cs} />
            {flowchart.map((box: FlowchartBox) => <ResizableBox
                    box={box}
                    flowchart={flowchartElement}
                    onBoxChange={(box: FlowchartBox) => {
                        console.log("new box")
                        console.log(box)

                        const newFlowchart = [...flowchart]
                        newFlowchart[flowchart.findIndex( b => b.name === box.name)] = box
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
        return <h1>aaaaaa</h1>

    const flowchart = props.flowchart.getBoundingClientRect()
    const x = props.box.left/100 * flowchart.width
    const y =  props.box.top/100 * flowchart.height
    const width = props.box.width/100 * flowchart.width
    const height = props.box.height/100 * flowchart.height

    return <Rnd
        ref={rndRef}
        default={{x, y, width, height}}
        style={resizeableBoxStyle}
        onDragStop={(e, data) => {
            props.onBoxChange({...props.box,
                left: data.x / flowchart.width * 100,
                top: data.y / flowchart.height * 100
            })
        }}
        onResizeStop={(e, dir, refToElement, delta, position) => {
            const rect = refToElement.getBoundingClientRect()
            props.onBoxChange({
                ...props.box,
                width: 100 * rect.width / flowchart.width,
                height: 100 * rect.height / flowchart.height,
                left: 100 * rect.left / flowchart.width,
                top: 100 * rect.top / flowchart.height
            })
        }}
    />
}