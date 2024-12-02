export const BaseFieldColourInput = ({field, initialValue, document}) => {
    return <input
        className="w-[48px]"
        type="color"
        name={field.name}
        style={{height: 48, width: 48}}
        value={initialValue}
        onChange={(value) => document.documentElement.style.setProperty(field.name, value.target.value)}
    />
}