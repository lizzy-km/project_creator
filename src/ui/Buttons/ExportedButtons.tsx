import React from "react"
import { ComponentRegistry } from "./ComponentsRegistry"


function ExportedButtons(props: {
    label: string | "Button"
    onClick: () => void,

}) {
    const { label, onClick } = props


    function handleClick() {
        onClick()
    }

    return <div className="components-list" >

        {
            Object.keys(ComponentRegistry).map((key) => {
                const Component = ComponentRegistry[key]
                return (
                    <div className="component_item" >
                        <Component label={`${label}`} onClick={handleClick} />
                    </div>
                )
            })
        }




    </div>
}