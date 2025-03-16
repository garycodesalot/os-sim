import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


class process{

    procLen = 0;
    instrArr = []; //Array to simulate instructions for a given process, will have RETURN as the last element. See Constructor.

    id = 0; //set by ProcessCB
    
    constructor(){ 

	//processes have at least one "line" and a return. 
	this.procLen = Math.floor(Math.random() * (20 - 2 + 1)) + 2;
	this.instrArr = new Array(this.procLen).fill(1);
	this.instrArr[this.procLen - 1] = 'RETURN';
    }

    getProcLen(){ return this.procLen }
    
}




//Generates process list of 'quantity' processes
function createProc(quantity){
    
    let procList = [];
    
    for(let i = 0 ; i < quantity ; i++){

	procList.push(new process());

    }

  return procList;

}


//function will return HTML that displays all of the processes, thei index in proclist, and length.
function ProcListDeets({procs}){

    return(
	    <div>

	    <h2>Generated Process Properties</h2>
	    
	    <ul>
	    
	    {procs.map((proc, index) => (
		<li key={index}>
		    Process: {index} -  Number of instructions: {proc.getProcLen()}
		</li>
	    ))}
	    </ul>
	</div>
    );
}





class Context{

    nextID = 1; //Value assigned as each processes ID. Incremented when new process context is initialized with set().

    constructor(){ //Map to manage all processes and PC's
	
	this.PCBmap = new Map();
	
    }

    setContext(proc){   //This will set the process ID for a single process and associate a pc variable to that ID in a key-value pair.

	let pc = 0;
	proc.id = this.nextID;
	this.PCBmap.set(proc.id, pc);
	this.nextID = this.nextID + 1; //inc to next ID.
	
    }

    getPC(proc){
	
	return this.PCBmap.get(proc.id) ?? 0; //"Nullish coalescing operator" returns 0 if process doesnt have a PC (null or undefined, im not sure)
	
    }

    incrementPC(proc){
	
	let currPC = this.getPC(proc) 
	this.PCBmap.set(proc.id, currPC + 1);
	
    }

    removeProcess(proc){

	this.PCBmap.delete(proc.id);
	
    }

}


//Need a statement in App(): FIFO_procList = procList &  FIFO_context = new context(); This isnt normal to a real OS but since we are
//running multiple schedulers each operation needs their own process list to maniupulate.

//stepFIFO will manipulate the process / process list as appropiate for FIFO for a singular time quantum of the operation.
function StepFIFO (FIFO_procList, FIFO_context){

    //Have to make working context and proclist elements so that useEffect in the barchart function detects a refrence update and changes the chart.
    let wContext = new Context();
    wContext = FIFO_context;
    let wProcList = FIFO_procList

    
    if (!wProcList || wProcList.length == 0){

	//maybe return a flag here that calls a function to display the function stats
	return {wProcList, wContext};
	
	
    }

    let pc = wContext.getPC(wProcList[0]);

    //PC 0 means PC has not been set for a process. PC is 1 minumimum for line 1.
    if(pc == 0){

	wContext.setContext(wProcList[0]);
	console.log("IF 1");

    }

    if(wProcList[0].instrArr[pc] == 'RETURN'){
	
	wProcList.shift();
	console.log("IF 2");
	
    }
    else{

	wContext.incrementPC(wProcList[0]);
	console.log("ELSE");
	
    }

    //returns updated context, procList should be passed by reference and is modified in place so it does not need to be returned.
    return {wProcList, wContext};
    
}

function FIFOChart({indata}) {

    const [progress, labels] = indata ?? [[0], [0]];

    const chartData = {
	labels,
	datasets: [
	    {
		label: "# of instructions",
		data: progress,
		backgroundColor: ["blue"],
		borderColor: "black",
		borderWidth: 1,
	    },
	],
    };

    
    const options = {
	devicePixelRatio: 1,
	animations: false,
	responsive: false,
	barThickness: 10,
      
	plugins: {
	    legend: { display: false },
	    title: { display: false },
	},
      
	scales: {
	  y: {
	      beginAtZero: true, grid: { display: true },
	      ticks: { display: true },
	      min: 0,
	      max: 20
	  },
	},
    };

  return <Bar data={chartData} options={options} />;
};



export { createProc, process, ProcListDeets, Context, FIFOChart, StepFIFO };
