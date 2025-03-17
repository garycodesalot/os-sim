import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import {createProc, process, FIFO_SJF_STCF_RR_Chart, Context, StepFIFO, StepSJF, StepSTCF, StepRR} from "./utils.js";


function App() {

    //User generated random procList
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
    const[STCF_procList, setSTCFProcList] = useState([]);
    const[STCF_context, setSTCFContext] = useState(new Context());
    const[STCF_data, setSTCFdata] = useState([]);

    //MLFQ stuff

    //RR stuff
    const[RR_procList, setRRProcList] = useState([]);
    const[RR_context, setRRContext] = useState(new Context());
    const[RR_data, setRRdata] = useState([]);

    //Simulation display setting
    const[displayOption, setDisplayOption] = useState("");

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

		FIFO_context.setContext(newList[i]);
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
		SJF_context.setContext(newList[i]);
		let pc = SJF_context.getPC(newList[i]);
		let progress = newList[i].instrArr.length - pc;

		labels.push(newList[i].id);
		values.push(progress);
	    }

	    console.log("Updated SJF Data:", values);
	    setSJFdata([values, labels]);

	    return newList; // Ensures state is updated properly
	});

	//STCF//
	setSTCFProcList(prevState => {
	    const newList = structuredClone(newProcList);

	    let labels = [];
	    let values = [];

	    for (let i = 0; i < newList.length; i++) {
		STCF_context.setContext(newList[i]);
		let pc = STCF_context.getPC(newList[i]);
		let progress = newList[i].instrArr.length - pc;

		labels.push(newList[i].id);
		values.push(progress);
	    }

	    console.log("Updated STCF Data:", values);
	    setSTCFdata([values, labels]);

	    return newList; // Ensures state is updated properly
	});

	//RR//
	setRRProcList(prevState => {
	    const newList = structuredClone(newProcList);

	    let labels = [];
	    let values = [];

	    for (let i = 0; i < newList.length; i++) {
		RR_context.setContext(newList[i]);
		let pc = RR_context.getPC(newList[i]);
		let progress = newList[i].instrArr.length - pc;

		labels.push(newList[i].id);
		values.push(progress);
	    }

	    console.log("Updated RR Data:", values);
	    setRRdata([values, labels]);

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

	//STCF//
	let {stProcList, stContext} = StepSTCF(STCF_procList, STCF_context);
	setSTCFProcList(stProcList);
	setSTCFContext(stContext);

	labels = [];
	values = [];

	for(let i = 0; i < STCF_procList.length ; i++){
	    
	    pc = STCF_context.getPC(STCF_procList[i]);
	    progress = (STCF_procList[i].instrArr.length - pc);

	    labels.push(STCF_procList[i].id);
	    values.push(progress);
	    
	}
	setSTCFdata([values, labels]);

	//RR//
	let {rProcList, rContext} = StepRR(RR_procList, RR_context);
	setRRProcList(rProcList);
	setRRContext(rContext);

	labels = [];
	values = [];

	for(let i = 0; i < RR_procList.length ; i++){
	    
	    pc = RR_context.getPC(RR_procList[i]);
	    progress = (RR_procList[i].instrArr.length - pc);

	    labels.push(RR_procList[i].id);
	    values.push(progress);
	    
	}
	setRRdata([values, labels]);

	
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
	      <label>Choose Simulation to Display: </label>
	      <select> id="options" value="{displayOption} onChange={handleDisplay}>
		  <option value="All">Show All</option>
		  <option value="FIFO">FIFO</option>
		  <option value="SJF">SJF</option>
		  <option value="RR">Round Robin</option>
		  <option value="MLFQ">MLFQ</option>
		  <option value="STCF">STCF</option>
	      </select>

	      <div style={{padding: "10px"}}>
		  <label>Start Simulation(s) at 1hz or stop: </label>
		  <button onClick={() => setRunning((prevRunning) => !prevRunning)}>Start/Stop</button>
	      </div>
	      


	     
	 </div>
	  
      </div>

      <hr />

      <div className="chart-grid">
	   
	  <div className="chart-box">
	      <h2>FIFO</h2>
	      <FIFO_SJF_STCF_RR_Chart indata={FIFO_data} />

	  </div>
	  
	  <div className="chart-box">

	      <h2>SJF</h2>
	      <FIFO_SJF_STCF_RR_Chart indata={SJF_data} />
	  
	  </div>

	  <div className="chart-box">

	      <h2>STCF</h2>
	      <FIFO_SJF_STCF_RR_Chart indata={STCF_data} />
	  
	  </div>

	  <div className="chart-box">

	      <h2>RR</h2>
	      <FIFO_SJF_STCF_RR_Chart indata={RR_data} />
	  
	  </div>

      </div>
      
 </>   
  
    );

    
}

export default App;
