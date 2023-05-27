export const iiicon = (icon: string, color: string, height = 24, width = 24) => {
    const path = `/public/icons/${icon}.svg`

    return (
        <span className={`masked-icon-${icon} inline-block`} style={{
            backgroundColor: color,
            verticalAlign: "middle",
            height: height,
            width: width,
            mask: `url("${path}") no-repeat center`,
            WebkitMask: `url("${path}") no-repeat center`,
        }}>
            &nbsp;
        </span>
    )
}