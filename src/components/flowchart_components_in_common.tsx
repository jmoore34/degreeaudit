import styled from "styled-components";
import Color from "color";
import {BoxAnnotation} from "./BoxAnnotation";

export interface FlowchartBox {
    name: string
    left: any // percentage
    top: any
    height: any
    width: any
}

export const FlowchartBackground = styled.img`
    width: 100%;
    //height: auto;
`;

export const HighlightBox = styled.div<{ box: FlowchartBox, color: string }>`
    top: ${props => props.box.top}%;
    left: ${props => props.box.left}%;
    width: ${props => props.box.width}%;
    height: ${props => props.box.height}%;
    :hover {
      background-color: ${props => props.color === "transparent" ? Color("black").fade(.8).toString() : Color(props.color).fade(.5).darken(.1).toString()};
    }
    transition: all .15s;
    cursor: pointer;
    background-color: ${props => Color(props.color).lighten(.1).fade(.5).toString()};
    position: absolute;
    border-radius: ${props => props.box.name.toLowerCase().includes("core") ? "200%" : "17.5%"};
    z-index: 2;
    + ${BoxAnnotation} {
      top: ${props => props.box.top + props.box.height}%;
      left: ${props => props.box.left}%;
      width: ${props => props.box.width}%;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
`;

export const FlowchartWrapper = styled.div`
    border: 1px black solid;
    margin: 7vw;
    width: 75vw;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    margin-top: 2em;  
`;
