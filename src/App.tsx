
import './App.css'
import {FolderTree} from './components/FolderTree';
import { ComponentStore } from './services/zustand/store/ComponentStore';
import { StringToComponent } from './functions/StringToComponent';
import { ModelBoxStore } from './services/zustand/store/ModelBoxStore';
import { ModelBox } from './components/ModelBox';



export  function App() {


  const { Component } = ComponentStore()

  const {isOpen} = ModelBoxStore()
  const ReactCom = StringToComponent(Component)






  return (

    <div className="parent h-full">
      

      <div style={{
        visibility:isOpen? 'visible' :'hidden'
      }} className=' model ' >

        //Box

        <div style={{
              transform: "translateY(100px)"

        }} className='model_box' >

          <ModelBox/>

        </div>

      </div>
      
      <div className="component h-full ">
        <FolderTree type={"Components"} />
      </div>
      <div className="folder h-full">
        <FolderTree type={"Source"} />
      </div>
      <div className="content h-full">
        <div className="" >
          <h2>Preview</h2>
          {Component.code.length > 0 ? <ReactCom label="Button" onClick={() => console.log("Clicked")} />
            : <div>No Component Selected</div>}
        </div>
      </div>
      <div className="header">
        Header
      </div>
    </div>

  )
}

