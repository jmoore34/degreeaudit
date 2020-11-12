import React, {FunctionComponent, useState} from "react";

// FIXME: Write event handler

export const DropDownMenu: FunctionComponent<{}> = () => {

    

    return <>
        
        <h1>Please select your major</h1>

        <select>
            <option value="CS">Computer Science</option>
            <option value="EE">Electrical Engineering</option>
            <option selected value="ME">Mechanical Engineering</option>
            <option value="SE">Software Engineering</option>
            <option value="BE">Biomedical Engineering</option>
            <option value="CE">Computer Engineering</option>
        </select>

        <div>
            <h1></h1>
        </div>

        <div id='testButton'>
            <button type="submit">Submit</button>
            
        </div>

    </>

}

