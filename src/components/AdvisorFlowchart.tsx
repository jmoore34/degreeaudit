import styled from "styled-components";
import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {CourseInfoBox} from "./CourseInfoBox";
import cs from "../flowcharts/cs.webp";
import {FlowchartBackground, FlowchartBox, FlowchartWrapper, getColorOfSemester, HighlightBox} from "./Flowchart";
import {Rnd} from "react-rnd";
import {useRerenderOnResize} from "../util";

const courseNamePrompt = "Enter the class name"

// Given a name, returns a modified version of the name that is sure to be unique
const CHAR_TO_APPEND_TO_NAMES = "'"
function ensureNameUnique(name: string, existingNames: Array<string>) {
    while (existingNames.includes(name))
        name += CHAR_TO_APPEND_TO_NAMES
    return name
}

export const AdvisorFlowchart: FunctionComponent<{}> = () => {
    const flowchartRef = React.useRef(null)
    const [flowchartElement, setFlowchartElement] = useState<any>(null)
    useRerenderOnResize()

    const [flowchart, setFlowchart] = useState<Array<FlowchartBox> >([{"name":"math 2417","top":10.577898945813999,"left":50.01844392234651,"width":7.2320499479708635,"height":3.497837499802931},{"name":"univ 1010","width":7.023933402705515,"height":2.858809495031242,"left":29.29552219164607,"top":12.878612022371236},{"name":"ecs 1100","width":7.1800208116545265,"height":3.060606785928246,"left":35.33409984005105,"top":8.820174716155426},{"name":"math 2413","width":4.994797086368366,"height":3.3633042618727305,"left":44.07954538525949,"top":10.65978200428034},{"name":"cs 1200","width":7.079646017699115,"height":3.0255914611085433,"left":62.19511652663001,"top":10.995959558321427},{"name":"cs 1336","width":8.633571309978416,"height":2.703898925683016,"left":68.62861472428607,"top":3.641526760686168},{"name":"phys 2325","width":8.633571309978416,"height":3.0472511702141927,"left":29.484631827992693,"top":19.58060007427004},{"name":"math 2414","width":4.838709677419355,"height":3.766901922864695,"left":44.236985602562434,"top":19.255881432321363},{"name":"math 2419","width":7.492195629552549,"height":4.002333293043739,"left":50.19086665094953,"top":19.1177773511606},{"name":"cs 2305","width":7.336108220603538,"height":3.39693834115477,"left":61.0536192259853,"top":21.60714056973866},{"name":"cs 2336","width":5.202913631633715,"height":3.39693834115477,"left":76.62283017161485,"top":20.873946585850994},{"name":"phys 2326","width":8.224882873503384,"height":3.0255914611085433,"left":30.54493115259793,"top":29.754624565333867},{"name":"math 2418","width":7.492195629552549,"height":3.060607812327565,"left":35.750548871821344,"top":38.9322663488168},{"name":"cs 3341","width":6.347554630593132,"height":3.1278739180930057,"left":44.28776990114464,"top":38.89869487989321},{"name":"cs 3345","width":9.16189484643415,"height":2.622179266294071,"left":66.46372662553684,"top":39.10034041186914},{"name":"cs 3377","width":6.919875130072841,"height":3.2960391825066084,"left":79.47778294907648,"top":38.797824460425986},{"name":"cs 2337","width":4.942767950052029,"height":3.3633052882720493,"left":84.11064981545915,"top":20.845985415604684},{"name":"cs 4341","width":8.168574401664932,"height":3.6996358170992543,"left":31.429856823336692,"top":48.513322170488046},{"name":"cs 3354","width":7.1800208116545265,"height":3.262406129623888,"left":51.41944527998179,"top":49.72359066341197},{"name":"cs 3390","width":5.6191467221644125,"height":2.2870475960249936,"left":73.85565750804825,"top":49.52185393007478},{"name":"cs 4349","width":6.919875130072841,"height":3.329672235389329,"left":61.778667342774455,"top":59.97699551734467},{"name":"cs 3162","width":6.555671175858481,"height":3.497837499802931,"left":69.5870962152868,"top":59.94333372528102},{"name":"cs 4347","width":10.50988236029364,"height":4.506829086284546,"left":39.60276275221937,"top":69.69249733300401},{"name":"cs 4348","width":9.578344612181155,"height":2.958356095306131,"left":87.91088320698854,"top":60.14500990802412},{"name":"cs 4384","width":9.157127991675338,"height":3.9687002401610183,"left":28.46268128902185,"top":69.9614714329257},{"name":"cs 4485","width":9.31321540062435,"height":4.06959939880918,"left":46.474136844758064,"top":79.47525704323424},{"name":"cs 1337","width":7.440166493236212,"height":3.598736658451093,"left":73.07468061020421,"top":10.491802518143455},{"name":"core'","width":6.295525494276795,"height":4.1368655045746205,"left":91.17841928980229,"top":10.252491358538855},{"name":"core''","width":6.295525494276795,"height":4.1032324516919,"left":91.43856497138397,"top":21.250501703987094},{"name":"core'''","width":6.347554630593132,"height":4.1368655045746205,"left":83.11390316077004,"top":29.356067448722733},{"name":"core''''","width":6.347554630593132,"height":4.1032324516919,"left":91.02233188085327,"top":29.322434395840013},{"name":"core'''''","width":6.347554630593132,"height":4.002333293043739,"left":91.07436101716962,"top":38.43698762145999},{"name":"core''''''","width":6.295525494276795,"height":4.1368655045746205,"left":91.07436101716962,"top":48.32510516897982},{"name":"cs 4337'","width":6.035382988301574,"height":3.598736658451093,"left":39.8776877062874,"top":50.51125360635665},{"name":"science elective","width":8.064516129032258,"height":3.060607812327565,"left":30.09621007881601,"top":60.13030673081471},{"name":"free elective","width":7.075965714628317,"height":3.497837499802931,"left":43.1034941579003,"top":60.09667367793199},{"name":"cs guided elective","width":10.353798126951093,"height":4.506829086284546,"left":58.45209254682622,"top":69.34577143187468},{"name":"cs guided elective'","width":10.353798126951093,"height":4.506829086284546,"left":72.08372626170656,"top":69.34577143187468},{"name":"free elective'","width":7.12799167533819,"height":3.3633052882720493,"left":86.07956393080124,"top":69.7157350135846},{"name":"cs guided elective''","width":10.301768990634756,"height":4.473196033401826,"left":30.616501441979384,"top":79.20025592651177},{"name":"free elective''","width":7.12799167533819,"height":3.39693834115477,"left":62.40630690686785,"top":79.20025592651177},{"name":"free elective'''","width":7.2320499479708635,"height":3.329672235389329,"left":71.45937662591051,"top":79.2338889793945},{"name":"univ 2020","width":7.023933402705515,"height":3.3633052882720493,"left":80.61650461758585,"top":79.16662287362905},{"name":"cs 3340'","width":5.931321540062435,"height":3.39693834115477,"left":69.27415290062433,"top":29.557869871616326},{"name":"cs 3305'","width":7.2840790842872005,"height":3.39693834115477,"left":59.18050045525494,"top":29.524232713136335},{"name":"core","width":6.451612903225806,"height":4.06959939880918,"left":82.02129129812695,"top":10.252491358538855},{"name":"ecs 2361","width":6.139438085327783,"height":3.39693834115477,"left":80.72056289021852,"top":59.793976201987505}])
    return <>
        <FlowchartWrapper ref={flowchartRef}>
            <FlowchartBackground src={cs}
                                 onLoad={() => setFlowchartElement(flowchartRef.current)}
                                 onContextMenu={e => {
                                    e.preventDefault()
                                     if (flowchartElement != null) {
                                         let name = prompt(courseNamePrompt)
                                         if (name == null || name.length < 4)
                                             return
                                         const existingNames = flowchart.map( box => box.name )
                                         name = ensureNameUnique(name, existingNames)
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
                        const newFlowchart = [...flowchart]
                        newFlowchart[flowchart.findIndex( b => b.name === box.name)] = box
                        console.log(newFlowchart)
                        setFlowchart(newFlowchart)
                    }}
                    onRename={(oldName, newName) => {
                        const existingNames = flowchart.map( box => box.name )
                        newName = ensureNameUnique(newName, existingNames)
                        let newFlowchart = [...flowchart]
                        newFlowchart[flowchart.findIndex( b => b.name === oldName)].name = newName
                        newFlowchart = newFlowchart.filter( b => b.name && b.name.length > 4)
                        console.log(newFlowchart)
                        setFlowchart(newFlowchart)
                    }}
                />)}
        </FlowchartWrapper>
    </>


}

const resizeableBoxStyle = (circle: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    backgroundColor: "rgba(217,51,118,0.3)",
    borderRadius: circle ? "200%" :  "17.5%",
});

const BoxAnnotation = styled.div<{ boxHeight: number }>`
   margin-top: ${props => props.boxHeight * 1.3}px;
  font-size: 1vmax;
  background-color: rgba(255,255,255,0.7);
  font-weight: bold;
  position: absolute;
  color: black;
  float: left;
`;

interface ResizeableBoxProps {
    box: FlowchartBox
    onBoxChange: (box: FlowchartBox) => any
    onRename: (oldName: string, newName: string) => any
    flowchart: HTMLElement | null
}
const ResizableBox: FunctionComponent<ResizeableBoxProps> = (props) => {
    const rndRef = useRef(null)

    if (props.flowchart == null || props.flowchart.clientWidth > props.flowchart.clientHeight)
        return null

    const flowchart = props.flowchart.getBoundingClientRect()
    const x = props.box.left/100 * flowchart.width
    const y = props.box.top/100 * flowchart.height
    const width = props.box.width/100 * flowchart.width
    const height = props.box.height/100 * flowchart.height
    //debugger;

    // console.log(props.box)
    // console.log({x, y, width, height})

    return <Rnd
        ref={rndRef}
        size={{width, height}}
        position={{x, y}}
        style={resizeableBoxStyle(props.box.name.includes("core"))}
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
        onContextMenu={(e: Event) => {
            e.preventDefault()
            const newName = prompt(courseNamePrompt + "\n\n(Leave empty to delete box)")
            if (newName === null)
                return
            props.onRename(props.box.name, newName);
        }}
    >
        <BoxAnnotation boxHeight={height}>{props.box.name.replace(/'/g, "")}</BoxAnnotation>
    </Rnd>
}