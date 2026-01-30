export const BaseFieldLabel = ({field}) => {
    return <label className="w-[140px]" htmlFor={field.name}>{field.description}</label>
}
