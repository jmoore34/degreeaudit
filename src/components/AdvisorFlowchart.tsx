import styled from "styled-components";
import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {CourseInfoBox} from "./CourseInfoBox";
import cs from "../flowcharts/cs.webp";
import {FlowchartBackground, FlowchartBox, FlowchartWrapper, getColorOfSemester, HighlightBox} from "./Flowchart";
import {Rnd} from "react-rnd";
import {useRerenderOnResize} from "../util";


export const AdvisorFlowchart: FunctionComponent<{}> = () => {
    const flowchartRef = React.useRef(null)
    const [flowchartElement, setFlowchartElement] = useState<any>(null)
    useRerenderOnResize()

    const [flowchart, setFlowchart] = useState<Array<FlowchartBox> >([
        {
            name: "math 2417",
            top: 10.376193068145092,
            left: 49.96647120505039,
            width: 7.53,
            height: 3.9
        }
    ])

    return <>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={cs}
                                 onLoad={() => setFlowchartElement(flowchartRef.current)}
                                 onContextMenu={e => {
                                    e.preventDefault()
                                     if (flowchartElement != null) {
                                         const name = prompt("Enter the class name")
                                         if (name == null || name.length < 4)
                                             return
                                         const flowchartBox = flowchartElement.getBoundingClientRect()
                                         const width = 7.53
                                         const height = 3.9
                                         const newFlowchart = [...flowchart, {
                                             name,
                                             width,
                                             height,
                                             left: (e.clientX - flowchartBox.left) / flowchartBox.width * 100 - width/2,
                                             top: (e.clientY - flowchartBox.top) / flowchartBox.height * 100 - height/2
                                         }]
                                         console.log(newFlowchart)
                                         setFlowchart(newFlowchart)
                                     }
                                 }}/>
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
    if (props.flowchart == null || props.flowchart.clientWidth > props.flowchart.clientHeight)
        return null

    const flowchart = props.flowchart.getBoundingClientRect()
    const x = props.box.left/100 * flowchart.width
    const y = props.box.top/100 * flowchart.height
    const width = props.box.width/100 * flowchart.width
    const height = props.box.height/100 * flowchart.height
    //debugger;

    console.log(props.box)
    console.log({x, y, width, height})

    return <Rnd
        ref={rndRef}
        //default={{x, y, width, height}}
        size={{width, height}}
        position={{x, y}}
        style={resizeableBoxStyle}
        onDragStop={(e, data) => {
            props.onBoxChange({...props.box,
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
    />
}