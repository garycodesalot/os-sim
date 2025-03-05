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

	
	const newProcList = createProc(numProc); //resturns process list of size numProc
	setProcList(newProcList); //updates state of procList with newProcList (just created)

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
