export const BaseFieldLabel = ({field}) => {
    return <label className="w-[180px]" htmlFor={field.name}>{field.description}</label>
}
