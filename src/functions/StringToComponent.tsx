import * as Babel from "@babel/standalone";
import React from "react";
import { ComponentRegistry } from "../ui/Buttons/ComponentsRegistry";
import { ComponentStore } from "../services/zustand/store/ComponentStore";
import Creator from "./Creator";
import { ArrowIcon } from "../assets/icon/Exported";
import { ExportedComponents } from "../components/ExportedComponent";


// export async function compileAndLoad (codeVal:string){
//     await 
// }


export const StringToComponent = ({ name, code }: { name: string, code: string }) => {



    const source = code.replace(
        /import\s*{([^}]+)}\s*from\s*['"]([^'"]+)['"];?/g,
        ''
    ).replace(/export\s?/g, "").replace(
        /import\s*([^}]+)\s*from\s*['"]([^'"]+)['"];?/g,
        ''
    )


    const compiled: string = Babel.transform(source, {
        presets: [
            "react", "typescript"
        ],
        filename: name

    }).code ?? ''

    // console.log(code,"compiled Code ")




    const DynamicComponent = new Function('React', "ComponentRegistry", "ComponentStore", "StringToComponent", "Creator", "ArrowIcon ","ExportedComponents", ` ${compiled} \n return ${name.split('.')[0]}`)(React, ComponentRegistry, ComponentStore, StringToComponent, Creator, ArrowIcon,ExportedComponents);

    return  DynamicComponent;
}