import {useEffect, useReducer} from "react";
import {currentSemester} from "./components/CourseInfoBox";

// react hook to rerender on window resize
export function useRerenderOnResize() {
    const [, forceRerender] = useReducer(x => x+1, 0)
    useEffect(() => {
        window.addEventListener("resize", forceRerender)
        return () => {
            window.removeEventListener("resize", forceRerender)
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
        || ( semesterAbbreviatedYear === currentAbbreviatedYear
            && (
                (currentSemester.includes("Fa") && !semester.includes("Fa"))   // e.g. currently Fall semester, class was this year in the Spring or Summer, ∴ in the past
                || (currentSemester.includes("Su") && semester.includes("Sp")) // i.e. currently Summer semester, class was the Spring right before, ∴ in the past
            )
        ))
        return "Taken"
    else return semester
}