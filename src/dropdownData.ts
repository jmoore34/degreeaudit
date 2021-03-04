export interface DropdownItem {
    value: any
    label: any
}

export const dropdownMajors: Array<DropdownItem> = [
    { value: 'BMEN', label: 'Biomedical Engineering' },
    { value: 'CE', label: 'Computer Engineering' },
    { value: 'CS', label: 'Computer Science' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'MECH', label: 'Mechancial Engineering' },
    { value: 'SE', label: 'Software Engineering' },
];

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
// Generates the years from 2016 to the current one (used for flowchart selection)
function* yearGenerator() {
    for (let i = new Date().getFullYear(); i >= 2016; i--) {
        yield { value: i, label: i }
    }
}
// @ts-ignore
export const advisorDropdownYears: Array<DropdownItem> = [...yearGenerator()];

// Students should not see the current year as a selectable catalog year until April
// (This gives the advisors more time to upload it)
// (note: months are zero indexed)
export const studentDropdownYears: Array<DropdownItem> = (new Date().getMonth() >= 3) ? advisorDropdownYears : advisorDropdownYears.filter(year => Number(year.label) < new Date().getFullYear())

export const dropdownDefaultMajor = dropdownMajors[0]
export const advisorDropdownDefaultYear = advisorDropdownYears[0]
export const studentDropdownDefaultYear = studentDropdownYears[0]