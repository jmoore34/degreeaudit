import {useEffect, useState} from "react";
import axios from "axios";
import {FlowchartBox} from "./components/flowchart_components_in_common";
import {enteredAdvisorPassword} from "./App";

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
        formData.append("password", enteredAdvisorPassword);
        axios.post('http://127.0.0.1:5000/api/json', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch( err => {
            if (err && err.message && err.message.includes("401"))
                alert(unathorizedMessage)
            else
                alert(err + " " + JSON.stringify(err))
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

export const unathorizedMessage = "401 Unauthorized\n\nThe password sent to the server is incorrect. Please double check you are using" +
    "the correct URL, which should be in the form https://ecsadvising.utdallas.edu/degreeaudit/#[password]," +
    "where [password] should be the correct admin password. You may need to double check with other advising staff and/or" +
    "tech support to see if the admin password has been changed."