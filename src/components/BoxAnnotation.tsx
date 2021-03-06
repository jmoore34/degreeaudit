import styled from "styled-components";

// Element used when displaying a course name under a course box
export const BoxAnnotation = styled.div<{ boxHeight: number }>`
  font-size: 1vmax;
  background-color: rgba(255,255,255,0.7);
  font-weight: bold;
  position: absolute;
  color: black;
  float: left;
`;

// used inside above element
export const BoxAnnotationText = styled.div<{color?: string}>`
  color: ${props => props.color ?? "black"};
  display: block
`;