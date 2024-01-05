export type MultiSelectOption = {
    // Identifier for the element, goes in the query string for a search
    value: string,
    // Human-readable label displayed in form elements
    label: string,
    // Optional icon that precedes label
    icon?: SVGElement
}