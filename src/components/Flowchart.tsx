import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import cs from '../flowcharts/cs.webp';
import { Rnd } from "react-rnd";
import { CourseInfoBox } from "./CourseInfoBox";
import Color from "color";
import {renameSemester, useRerenderOnResize} from "../util";
import html2canvas from "html2canvas";
import {BoxAnnotation} from "./AdvisorFlowchart";

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
    position: relative;
`;

const localStorageKey = "courseSemesters"
// load the student's course->semester mappings from localStorage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
// defaulting to an empty map
const initialSemesterMap = JSON.parse(localStorage.getItem(localStorageKey) ?? "{}") ?? {}
// postprocess this map to rename past semesters (e.g. "Fall 2015") to "Taken"
let postprocessedInitialSemesterMap: any = {};
for (const [course, semester] of Object.entries(initialSemesterMap)) {
    postprocessedInitialSemesterMap[course] = renameSemester(semester as string)
}

export const Flowchart: FunctionComponent<{}> = () => {
    const ref = React.useRef(null)
    const [courseSemestersMap, setCourseSemesters]: any = useState(postprocessedInitialSemesterMap);
    const [selectedCourse, setSelectedCourse]: any = useState("");

    useRerenderOnResize()

    return <>
        <div>
            <h1>Please color your classes according to which semester you plan on taking them</h1>

            <button onClick={() => {

                const exportPage = document.getElementsByClassName("exportImage");

                console.log(exportPage)

                if (exportPage) {
                    setSelectedCourse(null); // so that the CourseInfoBox is hidden
                    setTimeout(() => {
                        html2canvas(exportPage[0] as HTMLElement).then(canvas => {
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

            }}>Export PDF as Image</button>
        </div>

        {selectedCourse}
        <FlowchartWrapper className='exportImage' ref={ref}>
            <CourseInfoBox flowchartBox={(flowchartBoxes.find(box => box.name === selectedCourse)) ?? null as FlowchartBox | null}
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
            <FlowchartBackground src={cs} />
            {flowchartBoxes.map(box => <>
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

//Array of colors that the courseinfobox buttons will cycle through
const colors = ["#cc0058", "#3dffa5", "#fa5700", "#3D77FF", "#9900FF", "#00DB9A", "#E3FF42", "#FF00B3", "#0065A2", "#00DB9A", "#FF2E2E", "#FFBE0A"]

/*Function that determines which semester is given to which color in the array above. The colors will repeat every four years
 * e.g. Spring 2021 starts as the first color. The color will be reused when Spring 2025 is generated. 
*/
export function getColorOfSemester(semester: string) {

    //Default
    if (!semester || semester === "") {
        return "transparent";
    }

    else if (semester === "Taken")
        return "gray";

    else {
        //Gets semester year e.g. "Spring 24" = 24
        let num = parseInt(semester.substring(semester.length - 2))

        //Subtract 1 so that the starting year (2021 -> 21)%4 = 0
        num -= 1;
        //Makes colors repeat every four years
        num %= 4;
        //but we want different indexes/colors for spring, summer and fall. So we triple the size of the array and then add 0,1,2 to indicate spring/summer/fall
        num *= 3;


        if (semester.toLowerCase().includes("sp")) {
            //"adds 0" to index for spring
        }
        else if (semester.toLowerCase().includes("su")) {
            //adds 1 to index for summer
            num += 1;
        }
        else if (semester.toLowerCase().includes("fa")) {
            //adds 2 to index for fall
            num += 2;
        }

        return colors[num];
    }

}


export interface FlowchartBox {
    name: string
    left: any // percentage
    top: any
    height: any
    width: any
}

const flowchartBoxes: Array<FlowchartBox> = [{"name":"math 2417","top":10.577898945813999,"left":50.01844392234651,"width":7.2320499479708635,"height":3.497837499802931},{"name":"univ 1010","width":7.023933402705515,"height":2.858809495031242,"left":29.29552219164607,"top":12.878612022371236},{"name":"ecs 1100","width":7.1800208116545265,"height":3.060606785928246,"left":35.33409984005105,"top":8.820174716155426},{"name":"math 2413","width":4.994797086368366,"height":3.3633042618727305,"left":44.07954538525949,"top":10.65978200428034},{"name":"cs 1200","width":7.079646017699115,"height":3.0255914611085433,"left":62.19511652663001,"top":10.995959558321427},{"name":"cs 1336","width":8.633571309978416,"height":2.703898925683016,"left":68.62861472428607,"top":3.641526760686168},{"name":"phys 2325","width":8.633571309978416,"height":3.0472511702141927,"left":29.484631827992693,"top":19.58060007427004},{"name":"math 2414","width":4.838709677419355,"height":3.766901922864695,"left":44.236985602562434,"top":19.255881432321363},{"name":"math 2419","width":7.492195629552549,"height":4.002333293043739,"left":50.19086665094953,"top":19.1177773511606},{"name":"cs 2305","width":7.336108220603538,"height":3.39693834115477,"left":61.0536192259853,"top":21.60714056973866},{"name":"cs 2336","width":5.202913631633715,"height":3.39693834115477,"left":76.62283017161485,"top":20.873946585850994},{"name":"phys 2326","width":8.224882873503384,"height":3.0255914611085433,"left":30.54493115259793,"top":29.754624565333867},{"name":"math 2418","width":7.492195629552549,"height":3.060607812327565,"left":35.750548871821344,"top":38.9322663488168},{"name":"cs 3341","width":6.347554630593132,"height":3.1278739180930057,"left":44.28776990114464,"top":38.89869487989321},{"name":"cs 3345","width":9.16189484643415,"height":2.622179266294071,"left":66.46372662553684,"top":39.10034041186914},{"name":"cs 3377","width":6.919875130072841,"height":3.2960391825066084,"left":79.47778294907648,"top":38.797824460425986},{"name":"cs 2337","width":4.942767950052029,"height":3.3633052882720493,"left":84.11064981545915,"top":20.845985415604684},{"name":"cs 4341","width":8.168574401664932,"height":3.6996358170992543,"left":31.429856823336692,"top":48.513322170488046},{"name":"cs 3354","width":7.1800208116545265,"height":3.262406129623888,"left":51.41944527998179,"top":49.72359066341197},{"name":"cs 3390","width":5.6191467221644125,"height":2.2870475960249936,"left":73.85565750804825,"top":49.52185393007478},{"name":"cs 4349","width":6.919875130072841,"height":3.329672235389329,"left":61.778667342774455,"top":59.97699551734467},{"name":"cs 3162","width":6.555671175858481,"height":3.497837499802931,"left":69.5870962152868,"top":59.94333372528102},{"name":"cs 4347","width":10.50988236029364,"height":4.506829086284546,"left":39.60276275221937,"top":69.69249733300401},{"name":"cs 4348","width":9.578344612181155,"height":2.958356095306131,"left":87.91088320698854,"top":60.14500990802412},{"name":"cs 4384","width":9.157127991675338,"height":3.9687002401610183,"left":28.46268128902185,"top":69.9614714329257},{"name":"cs 4485","width":9.31321540062435,"height":4.06959939880918,"left":46.474136844758064,"top":79.47525704323424},{"name":"cs 1337","width":7.440166493236212,"height":3.598736658451093,"left":73.07468061020421,"top":10.491802518143455},{"name":"core'","width":6.295525494276795,"height":4.1368655045746205,"left":91.17841928980229,"top":10.252491358538855},{"name":"core''","width":6.295525494276795,"height":4.1032324516919,"left":91.43856497138397,"top":21.250501703987094},{"name":"core'''","width":6.347554630593132,"height":4.1368655045746205,"left":83.11390316077004,"top":29.356067448722733},{"name":"core''''","width":6.347554630593132,"height":4.1032324516919,"left":91.02233188085327,"top":29.322434395840013},{"name":"core'''''","width":6.347554630593132,"height":4.002333293043739,"left":91.07436101716962,"top":38.43698762145999},{"name":"core''''''","width":6.295525494276795,"height":4.1368655045746205,"left":91.07436101716962,"top":48.32510516897982},{"name":"cs 4337'","width":6.035382988301574,"height":3.598736658451093,"left":39.8776877062874,"top":50.51125360635665},{"name":"science elective","width":8.064516129032258,"height":3.060607812327565,"left":30.09621007881601,"top":60.13030673081471},{"name":"free elective","width":7.075965714628317,"height":3.497837499802931,"left":43.1034941579003,"top":60.09667367793199},{"name":"cs guided elective","width":10.353798126951093,"height":4.506829086284546,"left":58.45209254682622,"top":69.34577143187468},{"name":"cs guided elective'","width":10.353798126951093,"height":4.506829086284546,"left":72.08372626170656,"top":69.34577143187468},{"name":"free elective'","width":7.12799167533819,"height":3.3633052882720493,"left":86.07956393080124,"top":69.7157350135846},{"name":"cs guided elective''","width":10.301768990634756,"height":4.473196033401826,"left":30.616501441979384,"top":79.20025592651177},{"name":"free elective''","width":7.12799167533819,"height":3.39693834115477,"left":62.40630690686785,"top":79.20025592651177},{"name":"free elective'''","width":7.2320499479708635,"height":3.329672235389329,"left":71.45937662591051,"top":79.2338889793945},{"name":"univ 2020","width":7.023933402705515,"height":3.3633052882720493,"left":80.61650461758585,"top":79.16662287362905},{"name":"cs 3340'","width":5.931321540062435,"height":3.39693834115477,"left":69.27415290062433,"top":29.557869871616326},{"name":"cs 3305'","width":7.2840790842872005,"height":3.39693834115477,"left":59.18050045525494,"top":29.524232713136335},{"name":"core","width":6.451612903225806,"height":4.06959939880918,"left":82.02129129812695,"top":10.252491358538855},{"name":"ecs 2361","width":6.139438085327783,"height":3.39693834115477,"left":80.72056289021852,"top":59.793976201987505}]
