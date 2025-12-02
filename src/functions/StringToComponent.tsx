import * as Babel from "@babel/standalone";
import React from "react";
import { ComponentRegistry } from "../ui/Buttons/ComponentsRegistry";
import { ComponentStore } from "../services/zustand/store/ComponentStore";
import {FolderTree} from "../components/FolderTree";
import Creator from "./Creator";
import { ArrowIcon } from "../assets/icon/Exported";


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

  console.log(source)

    const compiled: string = Babel.transform(source, {
        presets: [
            "react", "typescript"
        ],
        filename: name

    }).code ?? ''


    // console.log(compiled)


    const DynamicComponent = new Function('React', "ComponentRegistry","ComponentStore","StringToComponent","Creator","ArrowIcon ", ` ${compiled} \n return ${name.split('.')[0]}`)(React, ComponentRegistry,ComponentStore,StringToComponent,Creator,ArrowIcon);
    return DynamicComponent;
};