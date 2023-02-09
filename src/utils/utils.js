export function undoCamelCase (str) {
    return str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)
}
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function camelCaseToTitle(str) {
    return capitalize(undoCamelCase(str));
}