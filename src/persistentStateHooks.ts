import {dropdownDefaultMajor, DropdownItem} from "./dropdownData";
import createPersistedState from "use-persisted-state";
import {renameSemester} from "./util";
import {useEffect} from "react";

// ************ read here ******************/
// basically useState but persistent
// see here https://github.com/donavon/use-persisted-state

export const useSelectedMajorState = createPersistedState('major')
export const useSelectedYearState = createPersistedState('year')

export const useNicknameMapState = createPersistedState('nicknameMap')



// this one is private because it is unprocessed
const useUnprocessedSemesterMapState = createPersistedState('courseSemesters')
// we export this one instead because it adds logic that deals with old semesters
export function useSemesterMapState(): [any, (newMap: any) => void] {
    const [semesterMap, setSemesterMap] = useUnprocessedSemesterMapState({})

    // When the map is loaded from localStorage the first time, we deal with any
    // old courses (e.g. from Fall 2015) via the renameSemester function
    // e.g. Fall 2014 -> Taken
    useEffect(() => {
        let result: any = {};
        for (const [course, semester] of Object.entries(semesterMap)) {
            if (course && semester) {
                result[course] = renameSemester(semester as string)
                // (renameSemester leaves non-old semesters alone)
            }
        }
        setSemesterMap(result)
    }, []) // only run on first render

    return [semesterMap, setSemesterMap]
}