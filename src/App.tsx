
import './App.css'
import { FolderTree } from './components/FolderTree';
import { ComponentStore } from './services/zustand/store/ComponentStore';
import { StringToComponent } from './functions/StringToComponent';
import { ModelBoxStore } from './services/zustand/store/ModelBoxStore';
import { ModelBox } from './components/ModelBox';
import { useEffect, useState } from 'react';
import Creator from './functions/Creator';



export function App() {


  const { Component, updateComponent, folderNode } = ComponentStore()
  const [isCode, setIsCode] = useState(false)
  const { isOpen } = ModelBoxStore()


  const [code, setCode] = useState<string>(Component.code)

  const { ChooseFoler, updateFile } = Creator()
      console.log(folderNode, "IsFolderNode")


  useEffect(() => {
    if (folderNode) {
      ChooseFoler(folderNode).then(() => {
        updateFile(`${Component.name}`, code).then(() => {
          console.log('Update Successed')
        })
      })

      updateComponent({
        name: Component.name,
        code: code
      })
    }
  }, [isCode])


  useEffect(() => {
    setCode(Component.code)
  }, [Component])




  // const ComponentFromString = useCallback(() => {
  //   console.log(code,"CallbackCode")
  // return StringToComponent({
  //       name: Component.name,
  //       code: Component.code
  //     })

  // }, [code, Component])



  const ReactCom = StringToComponent({
    name: Component.name,
    code: Component.code
  })


  // console.log(code, Component.code)






  return (

    <div className="parent h-full">


      <div style={{
        visibility: isOpen ? 'visible' : 'hidden'
      }} className=' model ' >

        //Box

        <div style={{
          transform: "translateY(100px)"

        }} className='model_box' >

          <ModelBox />

        </div>

      </div>

      {/* <div className="component h-full ">
        <FolderTree type={"Components"} />
      </div> */}
      <div className="folder h-full">
        <FolderTree type={"Source"} />
      </div>
      <div className="content ">

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 30
        }} >

          <div onClick={() => {
            setIsCode(false)
          }} style={{
            width: '10%',
            height: '100%',
            border: '1px solid #d8d8d8',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: isCode ? 'transparent' : '#d8d8d8',
            color: isCode ? '#d8d8d8' : '#121212'

          }} >
            Preview
          </div>

          <div onClick={() => {
            setIsCode(true)
          }} style={{
            width: '10%',
            height: '100%',
            border: '1px solid #d8d8d8',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: !isCode ? 'transparent' : '#d8d8d8',
            color: !isCode ? '#d8d8d8' : '#121212'


          }} >
            Code
          </div>

        </div>

        <div style={{
          height: '75%',

        }} >

          {!isCode ? <div className="" >
            <h2>Preview</h2>

            {Component.code.length > 5 ? <ReactCom label="Button" onClick={() => console.log("Clicked")} />
              : <div>No Component Selected</div>}
          </div> : <div style={{
            height: '100%',

          }} className="" >
            <h2>Code</h2>

            {Component.code.length > 0 ? <code   >
              <textarea style={{
                height: '100%',
                maxHeight: '100%',
                width: '90%',
                overflow: 'auto',
                padding: 20,
                borderRadius: 8,
                filter: "invert(1)"

              }}
                value={code}


                onChange={(e) => {

                  setCode(e.currentTarget.value)

                  console.log(e.currentTarget.value)

                }} contentEditable={true}  >



              </textarea>

              <div style={{
                width: '100%',
                height: 400
              }} >

              </div>


            </code>
              : <div>No Component Selected</div>}
          </div>
          }

        </div>






      </div>
      <div className="header">
        Header
      </div>
    </div>

  )
}

