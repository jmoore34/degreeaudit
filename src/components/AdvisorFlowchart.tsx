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

    const [flowchart, setFlowchart] = useState<Array<FlowchartBox> >([{"name":"math 2417","top":10.577899131193007,"left":49.86236111562988,"width":7.6002082248828735,"height":3.56347438752784},{"name":"univ 1010","width":7.287870900572618,"height":3.2272975585157795,"left":29.19146623666059,"top":12.74407906918414},{"name":"ecs 1100","width":7.172505395982069,"height":3.176008261913384,"left":35.33410014216337,"top":8.68564188679435},{"name":"math 2413","width":4.997397188964081,"height":3.3617682901206036,"left":44.079545362116086,"top":10.659782729309367},{"name":"cs 1200","width":7.079646017699115,"height":3.0255914611085433,"left":62.19511652663001,"top":10.995959558321427},{"name":"cs 1336","width":8.633571309978416,"height":2.703898925683016,"left":68.62861472428607,"top":3.641526760686168},{"name":"phys 2325","width":8.633571309978416,"height":3.0472511702141927,"left":29.484631827992693,"top":19.58060007427004},{"name":"math 2414","width":5.205622071837585,"height":3.832415850737488,"left":44.028868072049065,"top":19.18861391404379},{"name":"math 2419","width":7.570977917981073,"height":3.9914698426749284,"left":50.242895219433606,"top":19.15140976860607},{"name":"cs 2305","width":7.912545549193129,"height":3.697945119132664,"left":60.89753642918727,"top":21.506241677653694},{"name":"cs 2336","width":5.312966959986718,"height":3.5193605064445608,"left":76.57080151087499,"top":20.739413899562763},{"name":"phys 2326","width":8.224882873503384,"height":3.0255914611085433,"left":30.54493115259793,"top":29.754624565333867},{"name":"cs 3305","width":7.496095783446122,"height":3.2945329243181916,"left":59.27996816640096,"top":29.55291846792663},{"name":"cs 3340","width":6.14263404476835,"height":3.630709753330252,"left":69.17065010289237,"top":29.418447736321806},{"name":"math 2418","width":7.6002082248828735,"height":3.0928268269109553,"left":35.75055004717595,"top":38.89863431446191},{"name":"cs 3341","width":6.350858927641853,"height":3.2272975585157795,"left":44.28777024498959,"top":38.76416358285708},{"name":"cs 3345","width":9.16189484643415,"height":2.622179266294071,"left":66.46372662553684,"top":39.10034041186914},{"name":"cs 3377","width":7.079646017699115,"height":3.4290036559230157,"left":79.47778180513079,"top":38.69692821705467},{"name":"cs 2337","width":5.413846954711088,"height":3.56347438752784,"left":83.85050434547436,"top":20.745087599671177},{"name":"cs 4341","width":8.328995314940135,"height":3.765180484935076,"left":31.37782750683238,"top":48.44605625840442},{"name":"cs 4337","width":6.246746486205102,"height":3.56347438752784,"left":39.81093526320927,"top":50.46311723247678},{"name":"cs 3354","width":7.183758459135866,"height":3.4290036559230157,"left":51.36741626268871,"top":49.58905747704543},{"name":"cs 3390","width":5.726184279021343,"height":2.3532378030844225,"left":73.75159752610945,"top":49.4545867454406},{"name":"cs 4349","width":7.183758459135866,"height":3.49623491800437,"left":61.778666760883006,"top":59.80883307901206},{"name":"cs 3162","width":6.76730869338886,"height":3.563470283806782,"left":69.58709986863938,"top":59.87606844481447},{"name":"ecs 2361","width":6.350858927641853,"height":3.428999552201958,"left":80.62301866093506,"top":59.67436234740724},{"name":"cs 4347","width":10.51535658511192,"height":4.639240240366433,"left":39.70682282177251,"top":69.55796522408286},{"name":"cs 4348","width":9.578344612181155,"height":2.958356095306131,"left":87.91088320698854,"top":60.14500990802412},{"name":"cs 4384","width":9.16189484643415,"height":4.1685926797495485,"left":28.46267914660333,"top":69.7596713214901},{"name":"cs 4485","width":9.682457053617908,"height":4.23582804555196,"left":46.474131515161375,"top":79.30709326543261},{"name":"cs 1337","width":7.808433107756377,"height":3.832415850737488,"left":72.71047311174193,"top":10.256370534494895},{"name":"core","width":6.454971369078605,"height":4.23582804555196,"left":81.87236795817608,"top":10.189135168692482}])
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