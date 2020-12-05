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
function* yearGenerator() {
    for (let i = new Date().getFullYear(); i >= 2016; i--) {
        yield { value: i, label: i }
    }
}
// @ts-ignore
export const advisorDropdownYears: Array<DropdownItem> = [...yearGenerator()];

// Students should not the current year as a catalog year until April
// (note: months are zero indexed)
export const studentDropdownYears: Array<DropdownItem> = (new Date().getMonth() >= 3) ? advisorDropdownYears : advisorDropdownYears.filter(year => year.label !== new Date().getFullYear().toString())

export const dropdownDefaultMajor = dropdownMajors[0]
export const advisorDropdownDefaultYear = advisorDropdownYears[0]
export const studentDropdownDefaultYear = studentDropdownYears[0]