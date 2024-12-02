export const BaseFieldLabel = ({field}) => {
    return <label className="w-[calc(100%-48px)]" htmlFor={field.name}>{field.description}</label>
}
