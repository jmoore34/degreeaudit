import { useEffect, useReducer } from "react";
import { currentSemester } from "./components/CourseInfoBox";

// react hook to rerender on window resize and on window scroll
// TODO: Improve performance by not having causing a rerender on every single callback (e.g. waiting till the end, using a setTimeout, etc)
// (although not urgent, seems to run fine on most browsers)
export function useRerenderOnResizeAndOnScroll() {
    const [, forceRerender] = useReducer(x => x + 1, 0)
    useEffect(() => {
        window.addEventListener("resize", forceRerender)
        window.addEventListener("scroll", forceRerender)
        return () => {
            window.removeEventListener("resize", forceRerender)
            window.removeEventListener("scroll", forceRerender)
        }
    }, [])
}

// Given a semester, rename it to "Taken" if it is in the past; else return the original name
export function renameSemester(semester: string): string {
    const now = new Date()
    const currentAbbreviatedYear = now.getFullYear() % 100 // e.g. 2020 -> 20
    const semesterAbbreviatedYear = Number(semester.substring(semester.length - 2)) // e.g. Fall 20 -> 20
    // if the semester is in the past, set it to "Taken"; else, leave it the same
    if (semesterAbbreviatedYear < currentAbbreviatedYear // i.e, class was in 2018, ∴ in the past
        || (semesterAbbreviatedYear === currentAbbreviatedYear
            && (
                (currentSemester.includes("Fa") && !semester.includes("Fa"))   // e.g. currently Fall semester, class was this year in the Spring or Summer, ∴ in the past
                || (currentSemester.includes("Su") && semester.includes("Sp")) // i.e. currently Summer semester, class was the Spring right before, ∴ in the past
            )
        ))
        return "Taken"
    else return semester
}




//Array of colors that the courseinfobox buttons will cycle through
//We used to use random generated ones, but manually selecting them has two advantages
// 1. Avoid similar colors sometimes ending up next to each other
// 2. Consistent -- due to the getColorOfSemester algorithm, a given semester will always be the same color, even if the student looks at it several semesters later
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