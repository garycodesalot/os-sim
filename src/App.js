import React, { useState } from "react";
import "./styles.css";
import {createProc, process, getProcLen} from "./utils.js";

function App() {

     const[procList, setProcList] = useState([]);

    function handleProcSubmit(event){
	
	event.preventDefault();
	const formData = new FormData(event.target);
        const numProc = Number(formData.get("quantity"));
	const newProcList = createProc(numProc);

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

	  Number of instructions in process 1: {getProcLen(2, procList)}
	  
      </div>
      
       
  </>
    );

    
}

export default App;
