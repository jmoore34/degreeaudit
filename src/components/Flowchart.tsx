import React, {FunctionComponent, useState} from "react";

// FIXME: Write event handler

export const DropDownMenu: FunctionComponent<{}> = () => {

    

    return <>
        
        <h1>Please select your major</h1>

        <select>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option selected value="coconut">Coconut</option>
            <option value="mango">Mango</option>
        </select>

        <div>
            <h1></h1>
        </div>

        <div id='testButton'>
            <button type="submit">Submit</button>
            
        </div>

    </>

}

