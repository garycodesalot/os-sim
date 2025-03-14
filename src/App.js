import React, { useState, useRef } from "react";
import "./styles.css";
import {createProc, process, ProcListDeets, FIFOChart, Context, stepFIFO} from "./utils.js";


function App() {

    const[procList, setProcList] = useState([]);

    const[FIFO_procList, setFIFOProcList] = useState([]);
    const[instrLen, setProcLen] = useState(0);
    const FIFO_context = useRef(new Context());
   

    function handleProcSubmit(event){
	
	event.preventDefault();
	const formData = new FormData(event.target)
        const numProc = Number(formData.get("quantity"));

	
	const newProcList = createProc(numProc); //resturns process list of size numProc
	setProcList(newProcList); //updates state of procList with newProcList (just created)
	setFIFOProcList(newProcList);

    }

    function handleStep(event){

	let newContext = stepFIFO(FIFO_procList, FIFO_context.current);

	FIFO_context.current = newContext;

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

	  <ProcListDeets procs={procList}/>
	  
      </div>


      <div style={{ width: "600px", margin: "auto" }}>
	  <h2>FIFO</h2>
	  <FIFOChart procs={FIFO_procList} pContext={FIFO_context.current} />
	  
	  <button onClick = {handleStep}>Step once</button>

	  
      </div>

 </>
	


      
  
    );

    
}

export default App;
