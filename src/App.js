import React, { useState } from "react";
import "./styles.css";
import {createProc, process, ProcListDeets, FIFOChart, Context} from "./utils.js";


function App() {

    const[procList, setProcList] = useState([]);
    const[instrLen, setProcLen] = useState(0);

    function handleProcSubmit(event){
	
	event.preventDefault();
	const formData = new FormData(event.target)
        const numProc = Number(formData.get("quantity"));

	
	const newProcList = createProc(numProc); //resturns process list of size numProc
	setProcList(newProcList); //updates state of procList with newProcList (just created)

    }


    let FIFO_procList = procList;
    let FIFO_context = new Context();
    
    return (
  <>
        <div className="center">
            <h1>Dirns OS Scheduler Simulation</h1>
        </div>
      
      <hr />
      
      	<form onSubmit={handleProcSubmit} className ="center">
	    <input name="quantity"/>
	    <button type="submit">Create Processes</button>
	</form>

      <div>

	  <ProcListDeets procList={FIFO_procList}/>
	  
      </div>


      <div style={{ width: "600px", margin: "auto" }}>
	  <h2>FIFO</h2>
	  <FIFOChart procs={FIFO_procList} pContext={FIFO_context} />
      </div>

 </>
	


      
  
    );

    
}

export default App;
