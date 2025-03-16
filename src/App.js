import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import {createProc, process, ProcListDeets, FIFOChart, SJFChart, Context, StepFIFO, StepSJF} from "./utils.js";


function App() {

    //User generated proclist
    const[procList, setProcList] = useState([]);

    //FIFO stuff
    const[FIFO_procList, setFIFOProcList] = useState([]);
    const[FIFO_context, setFIFOContext] = useState(new Context());
    const[FIFO_data, setFIFOdata] = useState([]);

    //SJF stuff
    const[SJF_procList, setSJFProcList] = useState([]);
    const[SJF_context, setSJFContext] = useState(new Context());
    const[SJF_data, setSJFdata] = useState([]);

    //STCF stuff

    //MLFQ stuff

    //Simulation display setting
    const[displayOption setDisplayOption] = useState("");

    //Time quantum counter and start status
    const[timeQuant , setTimeQuant] = useState(0);
    let[running, setRunning] = useState(false);

    //CPU scheduler clock 1hz
    useEffect(() => {
	
	const interval = setInterval(() => running &&  setTimeQuant(timeQuant + 1), 1000);

	handleStep();

	
	return () => clearInterval(interval);
	
    },[timeQuant, running]);

    function handleDisplay(event){
	setDisplayOption(event.target.value);
    }


    function handleProcSubmit(event){
	
	event.preventDefault();
	const formData = new FormData(event.target)
        const numProc = Number(formData.get("quantity"));
	const newProcList = createProc(numProc); //resturns process list of size numProc
	setProcList(newProcList); //updates state of procList with newProcList (just created)

	
	//FIFO//
	//proclists for every operation need to be created using structuredClone of newProclist
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

	//SJF//
	setSJFProcList(prevState => {
	    const newList = structuredClone(newProcList);

	    let labels = [];
	    let values = [];

	    for (let i = 0; i < newList.length; i++) {
		let pc = SJF_context.getPC(newList[i]);
		let progress = newList[i].instrArr.length - pc;

		labels.push(newList[i].id);
		values.push(progress);
	    }

	    console.log("Updated SJF Data:", values);
	    setSJFdata([values, labels]);

	    return newList; // Ensures state is updated properly
	});
	

    }
    

    function handleStep(){
	let labels = [];
	let values = [];
	let pc = 0;
	let progress = 0;
	
	

	//FIFO//
	let {fProcList , fContext} = StepFIFO(FIFO_procList, FIFO_context);
	setFIFOProcList(fProcList);
	setFIFOContext(fContext);

	//Organize data to send to chart (FIFOdata)
	labels = [];
	values = [];

	for(let i = 0; i < FIFO_procList.length ; i++){

	    pc = FIFO_context.getPC(FIFO_procList[i]);
	    progress = (FIFO_procList[i].instrArr.length - pc);

	    //TODO: check setter in context , id setting may not be working
	    labels.push(FIFO_procList[i].id);
	    values.push(progress);
	    
	}
	setFIFOdata([values, labels]);
	

	//SJF//
	let {sProcList, sContext} = StepSJF(SJF_procList, SJF_context);
	setSJFProcList(sProcList);
	setSJFContext(sContext);

	labels = [];
	values = [];

	for(let i = 0; i < SJF_procList.length ; i++){

	    pc = SJF_context.getPC(SJF_procList[i]);
	    progress = (SJF_procList[i].instrArr.length - pc);

	    labels.push(SJF_procList[i].id);
	    values.push(progress);
	    
	}
	setSJFdata([values, labels]);
	
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

      <div className="top-header-group">
	  
	  <div className="lr-header-sections">

	    <h2>Generated Process Properties</h2>
	      <ul>
		  {procList.map((proc, index) => (
		      <li key={index}>
			  Process: {index} -  Number of instructions: {proc.getProcLen()}
		      </li>
		  ))}
	      </ul>
	    
	  </div>
	  
	  <div className="lr-header-sections">
	      <h2>Simulation Settings</h2>
	      <label> htmlFor="options">Choose Simulation to Display</label>

	      
	      <button onClick={() => setRunning((prevRunning) => !prevRunning)}>Start/Stop</button>


	     
	 </div>
	  
      </div>

      <hr />

      <div className="chart-grid">
	   
	  <div className="chart-box">
	      <h2>FIFO</h2>
	      <FIFOChart indata={FIFO_data} />
	      <button onClick = {handleStep}>Step once</button>

	  </div>
	  
	  <div className="chart-box">

	      <h2>SJF</h2>
	      <SJFChart indata={SJF_data} />
	      <button onClick = {handleStep}>Step once</button>
	  
	  </div>

      </div>
      
 </>   
  
    );

    
}

export default App;
