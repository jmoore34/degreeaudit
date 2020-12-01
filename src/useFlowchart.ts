import {useEffect, useState} from "react";
import axios from "axios";
import {FlowchartBox} from "./components/flowchart_components_in_common";

interface useFlowchartReturn {
    flowchart: Array<FlowchartBox>,
    updateFlowchart: (newFlowchart: Array<FlowchartBox>) => void
}

export function useFlowchart(flowchartName: string): useFlowchartReturn {
    const [flowchart, __setFlowchart] = useState<Array<FlowchartBox>>([])

    async function updateFlowchart(newFlowchart: Array<FlowchartBox>) {
        var formData = new FormData();
        formData.append("filename", flowchartName + ".json");
        formData.append("body", JSON.stringify(newFlowchart));
        formData.append("password", "password");
        axios.post('http://127.0.0.1:5000/api/json', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        __setFlowchart(newFlowchart)
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/json', {
            // https://masteringjs.io/tutorials/axios/get-query-params
            params: {
                "filename": flowchartName + ".json"
            }
        }).then(result => {__setFlowchart(result.data)}).catch( err => alert(err + " " + JSON.stringify(err)))
    }, [flowchartName])

    return {flowchart, updateFlowchart} as useFlowchartReturn
}