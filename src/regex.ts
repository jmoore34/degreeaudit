
// Given a name, returns a modified version of the name that is sure to be unique
// It does this by adding quote marks until the name is unique
const CHAR_TO_APPEND_TO_NAMES = "'"
export function ensureNameUnique(name: string, existingNames: Array<string>) {
    while (existingNames.includes(name))
        name += CHAR_TO_APPEND_TO_NAMES
    return name
}

// The below function reverses the effect of the above function
// e.g. core''' -> core
export function getReadableCourseName(rawCourseName: string) {
    return rawCourseName.replace(/'/g, "")
}

// Makes a course name URL ready (i.e. for use in the catalog iframe in CourseInfoBox)
// ex. ECS 1100 -> ecs1100
// Some are more complicated:
//    Chem 1311/Chem1111 -> chem1111
//    (only want the first course)
export function getUrlReadyCourseName(rawCourseName: string) {
    return (rawCourseName.toLowerCase().match(courseRegex) ?? [""])[0].replace(nonAlphanumericRegex, "")
}

// Returns whether a class name is a course name rather than a broad category
// ECS 1100                     ->    true
// Chem 1311/Chem1111           ->    true
// Core                         ->    false
// CS Senior Guided Elective    ->    false
export function isRegularClass(courseName: string) {
    return courseRegex.test(courseName)
}

const courseRegex = /^\s*[a-z]+\s*[\dv]+/i
const nonAlphanumericRegex = /[^a-z0-9]/gi