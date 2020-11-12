import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import cs from '../flowcharts/cs.webp';
import { Rnd } from "react-rnd";
import { CourseInfoBox } from "./CourseInfoBox";
import Color from "color";
import {useRerenderOnResize} from "../util";

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
    border-radius: 20%;
    z-index: 2;
`;

export const FlowchartWrapper = styled.div`
    border: 1px black solid;
    margin: 7vw;
    width: 75vw;
    position: relative;
`;

export const Flowchart: FunctionComponent<{}> = () => {
    const ref = React.useRef(null)
    const localStorageKey = "courseSemesters"
    const [courseSemestersMap, setCourseSemesters]: any = useState(JSON.parse(localStorage.getItem(localStorageKey) ?? "{}") ?? {});
    const [selectedCourse, setSelectedCourse]: any = useState("");

    useRerenderOnResize()

    return <>
        {selectedCourse}
        <FlowchartWrapper ref={ref}>
            <CourseInfoBox yValue={(flowchartBoxes.find(box => box.name === selectedCourse))?.top}
                course={selectedCourse}
                semester={courseSemestersMap[selectedCourse]}
                onSemesterChanged={(newSemester: string) => {
                    const newMap = { ...courseSemestersMap, [selectedCourse]: newSemester }
                    localStorage.setItem(localStorageKey, JSON.stringify(newMap));
                    console.log(localStorage.getItem(localStorageKey));
                    setCourseSemesters(newMap);
                }}
            />
            <FlowchartBackground src={cs} />
            {flowchartBoxes.map(box =>
                <HighlightBox box={box}
                    color={getColorOfSemester(courseSemestersMap[box.name])}
                    onClick={() => {
                        setSelectedCourse(box.name);
                    }}
                >

                </HighlightBox>
            )}
        </FlowchartWrapper>
    </>


}

export function getColorOfSemester(semester: string) {
    if (!semester) {
        return "transparent";
    }
    const hue = TSH(semester) % 360;
    if (semester === "Previous Semesters")
        return "gray";
    else
        return `hsl(${hue}, 100%, 50%)`;

}

function TSH(s: string) {
    for (var i = 0, h = 9; i < s.length;)
        h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
    return h ^ h >>> 9
}


export interface FlowchartBox {
    name: string
    left: any // percentage
    top: any
    height: any
    width: any
}

const flowchartBoxes: Array<FlowchartBox> = [{"name":"math 2417","top":10.577899131193007,"left":49.86236111562988,"width":7.6002082248828735,"height":3.56347438752784},{"name":"univ 1010","width":7.287870900572618,"height":3.2272975585157795,"left":29.19146623666059,"top":12.74407906918414},{"name":"ecs 1100","width":7.172505395982069,"height":3.176008261913384,"left":35.33410014216337,"top":8.68564188679435},{"name":"math 2413","width":4.997397188964081,"height":3.3617682901206036,"left":44.079545362116086,"top":10.659782729309367},{"name":"cs 1200","width":7.079646017699115,"height":3.0255914611085433,"left":62.19511652663001,"top":10.995959558321427},{"name":"cs 1336","width":8.633571309978416,"height":2.703898925683016,"left":68.62861472428607,"top":3.641526760686168},{"name":"phys 2325","width":8.633571309978416,"height":3.0472511702141927,"left":29.484631827992693,"top":19.58060007427004},{"name":"math 2414","width":5.205622071837585,"height":3.832415850737488,"left":44.028868072049065,"top":19.18861391404379},{"name":"math 2419","width":7.570977917981073,"height":3.9914698426749284,"left":50.242895219433606,"top":19.15140976860607},{"name":"cs 2305","width":7.912545549193129,"height":3.697945119132664,"left":60.89753642918727,"top":21.506241677653694},{"name":"cs 2336","width":5.312966959986718,"height":3.5193605064445608,"left":76.57080151087499,"top":20.739413899562763},{"name":"phys 2326","width":8.224882873503384,"height":3.0255914611085433,"left":30.54493115259793,"top":29.754624565333867},{"name":"cs 3305","width":7.496095783446122,"height":3.2945329243181916,"left":59.27996816640096,"top":29.55291846792663},{"name":"cs 3340","width":6.14263404476835,"height":3.630709753330252,"left":69.17065010289237,"top":29.418447736321806},{"name":"math 2418","width":7.6002082248828735,"height":3.0928268269109553,"left":35.75055004717595,"top":38.89863431446191},{"name":"cs 3341","width":6.350858927641853,"height":3.2272975585157795,"left":44.28777024498959,"top":38.76416358285708},{"name":"cs 3345","width":9.16189484643415,"height":2.622179266294071,"left":66.46372662553684,"top":39.10034041186914},{"name":"cs 3377","width":7.079646017699115,"height":3.4290036559230157,"left":79.47778180513079,"top":38.69692821705467},{"name":"cs 2337","width":5.413846954711088,"height":3.56347438752784,"left":83.85050434547436,"top":20.745087599671177},{"name":"cs 4341","width":8.328995314940135,"height":3.765180484935076,"left":31.37782750683238,"top":48.44605625840442},{"name":"cs 4337","width":6.246746486205102,"height":3.56347438752784,"left":39.81093526320927,"top":50.46311723247678},{"name":"cs 3354","width":7.183758459135866,"height":3.4290036559230157,"left":51.36741626268871,"top":49.58905747704543},{"name":"cs 3390","width":5.726184279021343,"height":2.3532378030844225,"left":73.75159752610945,"top":49.4545867454406},{"name":"cs 4349","width":7.183758459135866,"height":3.49623491800437,"left":61.778666760883006,"top":59.80883307901206},{"name":"cs 3162","width":6.76730869338886,"height":3.563470283806782,"left":69.58709986863938,"top":59.87606844481447},{"name":"ecs 2361","width":6.350858927641853,"height":3.428999552201958,"left":80.62301866093506,"top":59.67436234740724},{"name":"cs 4347","width":10.51535658511192,"height":4.639240240366433,"left":39.70682282177251,"top":69.55796522408286},{"name":"cs 4348","width":9.578344612181155,"height":2.958356095306131,"left":87.91088320698854,"top":60.14500990802412},{"name":"cs 4384","width":9.16189484643415,"height":4.1685926797495485,"left":28.46267914660333,"top":69.7596713214901},{"name":"cs 4485","width":9.682457053617908,"height":4.23582804555196,"left":46.474131515161375,"top":79.30709326543261},{"name":"cs 1337","width":7.808433107756377,"height":3.832415850737488,"left":72.71047311174193,"top":10.256370534494895},{"name":"core","width":6.454971369078605,"height":4.23582804555196,"left":81.87236795817608,"top":10.189135168692482}]





