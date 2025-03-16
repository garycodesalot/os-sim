import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import {createProc, process, ProcListDeets, FIFOChart, Context, StepFIFO} from "./utils.js";


function App() {

    const[procList, setProcList] = useState([]);

    const[FIFO_procList, setFIFOProcList] = useState([]);
    const[FIFO_context, setFIFOContext] = useState(new Context());
    const[FIFO_data, setFIFOdata] = useState([]);
    
    const[instrLen, setProcLen] = useState(0);
   
   

    function handleProcSubmit(event){
	
	event.preventDefault();
	const formData = new FormData(event.target)
        const numProc = Number(formData.get("quantity"));

	
	const newProcList = createProc(numProc); //resturns process list of size numProc
	setProcList(newProcList); //updates state of procList with newProcList (just created)

	//proclists for every operation need to be created using structuredClone of newProclist
	setFIFOProcList( structuredClone(newProcList) );
	setFIFOProcList(prevState => {
	    const newList = structuredClone(newProcList);

	    let labels = [];
	    let values = [];

	    for (let i = 0; i < newList.length; i++) {
		let pc = FIFO_context.getPC(newList[i]);
		let progress = newList[i].instrArr.length - pc;

		labels.push(newList[i].id);
		values.push(progress);
	    }

	    console.log("Updated FIFO Data:", values);
	    setFIFOdata([values, labels]);

	    return newList; // Ensures state is updated properly
	});



    }
    

    function handleStep(event){

	//step FIFO

	let {wProcList , wContext} = StepFIFO(FIFO_procList, FIFO_context);
	setFIFOProcList(wProcList);
	setFIFOContext(wContext);

	//Organize data to send to chart (FIFOdata)

	let labels = [];
	let values = [];

	for(let i = 0; i < FIFO_procList.length ; i++){

	    let pc = FIFO_context.getPC(FIFO_procList[i]);
	    let progress = (FIFO_procList[i].instrArr.length - pc);

	    //check setter in context , id setting may not be working
	    labels.push(FIFO_procList[i].id);
	    values.push(progress);

	    console.log(labels);
	    
	}

	setFIFOdata([values, labels]);
	
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
	  <FIFOChart indata={FIFO_data} />
	  
	  <button onClick = {handleStep}>Step once</button>

	  
      </div>

 </>   
  
    );

    
}

export default App;
