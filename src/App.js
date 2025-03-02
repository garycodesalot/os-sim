import React, { useState } from "react";
import "./styles.css";
import {createProc, process, ProcListDeets} from "./utils.js";

function App() {

    const[procList, setProcList] = useState([]);
    const[instrLen, setProcLen] = useState(0);

    function handleProcSubmit(event){
	
	event.preventDefault();
	const formData = new FormData(event.target);
        const numProc = Number(formData.get("quantity"));

	
	const newProcList = createProc(numProc);
	setProcList(newProcList);

	
	const instrLen = procList[2]?.getProcLen() || 0; //currently only gets number of instructions for process 2
	setProcLen(instrLen);

    }
    
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

	  <ProcListDeets procList={procList}/>
	  
      </div>
      
       
  </>
    );

    
}

export default App;
