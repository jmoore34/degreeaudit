import React, {FunctionComponent, useState} from "react";
import styled from "styled-components";
import cs from '../flowcharts/cs.webp';
import {Rnd} from "react-rnd";

const FlowchartBackground = styled.img`
    width: 100%;
    //height: auto;
`;


// @ts-ignore
const HighlightBox = styled.div<{ box: FlowchartBox }>`
    top: ${props => props.box.top}%;
    left: ${props => props.box.left}%;
    bottom: ${props => props.box.bottom}%;
    right: ${props => props.box.right}%;
    :hover {
      background-color: rgba(1,0,0,0.3);
    }
    position: absolute;
    border-radius: 14px;
`;

const SolidBox = styled.div`
    background-color: rgba(15,245,172,0.65);
    width: 100%;
    height: 100%;
`;

const FlowchartWrapper = styled.div`
    border: 1px black solid;
    margin: 7vw;
    width: 75vw;
    position: relative;
`;

export const Flowchart: FunctionComponent<{}> = () => {

    const ref = React.useRef(null)

    return <>
        <FlowchartWrapper ref={ref}>
            <FlowchartBackground src={cs} />
            {flowchartBoxes.map(box =>
                <HighlightBox box={box}></HighlightBox>
            )}
            <ResizableBox />
        </FlowchartWrapper>
    </>
}


interface FlowchartBox {
    name: String
    left: any // percentage
    top: any
    right: any
    bottom: any
}

const flowchartBoxes: Array<FlowchartBox> = [
    {
        name: "ECS 1100",
        top: 8.8,
        left: 35.2,
        bottom: 88.3,
        right: 57.5
    }
]

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0"
};


const ResizableBox: FunctionComponent<{}> = () => {
    const ref = React.useRef(null)
    return <Rnd
        //default={{x: 0, y:0, width: '10%', height: '10%'}}
        style={style}
        //size={{ width: width, height: height }}
        //position={{ x: x, y: y }}
        onDragStop={(e, d) => {

            if (e.target) {
                const event = e as Event
                const flowchart = (e.target as HTMLElement)?.parentElement?.parentElement
                if (flowchart) {
                    const x = d.x / flowchart.offsetWidth * 100
                    const y = d.y / flowchart.offsetHeight * 100
                    console.log({x, y})
                }
            }
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
            //console.log(direction, position, delta)
            //console.log(`width: ${ref.offsetWidth}px height: ${ref.offsetHeight}px `)
        }}
    >
        <SolidBox ref={ref}>hi</SolidBox>
    </Rnd>
}