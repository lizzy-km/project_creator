import React from "react"
import { ModelBoxStore } from "../services/zustand/store/ModelBoxStore"
import { ButtonOutline } from "../ui/Buttons/ButtonOutline"
import { ButtonFilled } from "../ui/Buttons/ButtonFilled"
import Creator from "../functions/Creator"

export function ModelBox() {

    const [fileName, setFileName] = React.useState('')
    const [fileContent, setFileContent] = React.useState('')

    const {  type, setIsOpen, setType, node } = ModelBoxStore()
    const { ChooseFoler, createFile, createFolder } = Creator();


    console.log(node)

    function onConfirm() {
        if (node)
            switch (type) {
                case "folder":

                    ChooseFoler(node).then(() => {
                        createFolder(fileName).then(() => {
                            setIsOpen(false)
                        })
                    })

                    break;

                case "file":
                    ChooseFoler(node).then(() => {
                        createFile(`/${fileName}`, fileContent).then(() => {
                            setIsOpen(false)
                        })
                    })
                    break;

                default:
                    break;
            }
    }

    function onClose() {
        setIsOpen(false)
        setType('')
    }



    return <div style={{
        width: '100%',
        height: '100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        justifyContent: 'start',
        alignItems: "start",
        color: '#d8d8d8',


    }} >

        <p>
            Choose type.
        </p>

        <div style={{
            width: '100%',
            height: 30,
            padding: 8,
            color: '#d8d8d8',
            textAlign: 'start',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center'

        }}  >

            <div onClick={() => {
                setType('folder')

            }} style={{
                cursor: "pointer",
                width: '40%',
                height: '100%',
                border: '1px solid #d8d8d8',
                backgroundColor: type === 'folder' ? '#d8d8d8' : 'transparent',
                color: type === 'folder' ? '#121212' : '#d8d8d8',

            }} >

                Folder

            </div>

            <div onClick={() => {
                setType('file')

            }} style={{
                cursor: "pointer",
                width: '40%',
                height: '100%',
                border: '1px solid #d8d8d8',
                backgroundColor: type === 'file' ? '#d8d8d8' : 'transparent',
                color: type === 'file' ? '#121212' : '#d8d8d8',

            }} >

                File

            </div>

        </div>

        <p>
            Assign your new {type} name.
        </p>

        <div contentEditable={true} style={{
            width: 350,
            height: 30,
            border: '1px solid #d8d8d8',
            padding: 8,
            color: '#d8d8d8',
            textAlign: 'start',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center'

        }} onInput={(e) => {
            setFileName(e.currentTarget.textContent)
        }} >



        </div>


        <div style={{
            width: '100%',
            height: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }} >


            <ButtonOutline label="Cancel" onClick={onClose} />

            <ButtonFilled label="Create" onClick={onConfirm} />


        </div>

    </div>
}