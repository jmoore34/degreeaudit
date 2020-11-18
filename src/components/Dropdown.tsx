import { h } from "@deckdeckgo/drag-resize-rotate/dist/types/stencil-public-runtime";
import React, {FunctionComponent, useState} from "react";
import ReactDOM from "react-dom";

// FIXME: Write event handler

export const DropDownMenu: FunctionComponent<{}> = () => {



    return <>
        <div id="FirstDropdown">
            <h1>Please select your major and catalog year</h1>

            <form>
            <select>
                <option value="CS">Computer Science</option>
                <option value="EE">Electrical Engineering</option>
                <option selected value="ME">Mechanical Engineering</option>
                <option value="SE">Software Engineering</option>
                <option value="BE">Biomedical Engineering</option>
                <option value="CE">Computer Engineering</option>
            </select>
            </form>

            <form>
            <select>
                <option>2016</option>
                <option>2017</option>
                <option>2018</option>
                <option>2019</option>
                <option>2020</option>
            </select>
            </form>

            <div>
                <h1></h1>
            </div>

            <div id='testButton'>
                <button type="submit">Submit</button>
                
            </div>
        </div>
    </>

}
