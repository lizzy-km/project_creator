import React from "react";

export function ButtonOutline(props: {
    label: string | "Button"
    onClick: () => void,

}) {
    const { label, onClick } = props

    const [properties, setProperties] = React.useState({
        label: label,
        color: "",
        background: "",
        borderColor: "",
        borderwidth: "",
        width: 160,
        height: 48

    })
    const [openMenu, setOpenMenu] = React.useState(false)

    function handleClick() {
        onClick()
    }

    function OnRightClick() {
        setOpenMenu(true)
    }

    return (
        <button style={{
            color: properties.color,
            backgroundColor: properties.background,
            border: `${properties.borderwidth}px solid ${properties.borderColor} `,
            minWidth: properties.width,
            minHeight: properties.height,
            position: 'relative',
            width: 'auto'
        }}
            onContextMenu={OnRightClick} onClick={handleClick}
            className="Button outline"
        >
            <div style={{
                position: "absolute",
                visibility: openMenu ? 'visible' : 'hidden'
            }} >
                Menu
            </div>

            {properties.label}
        </button>
    );
}

