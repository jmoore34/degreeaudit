import {dropdownDefaultMajor, DropdownItem} from "./dropdownData";
import createPersistedState from "use-persisted-state";

// basically useState but persistent
// see here https://github.com/donavon/use-persisted-state

export const useSelectedMajorState = createPersistedState('major')
export const useSelectedYearState = createPersistedState('year')