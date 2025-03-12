import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


class process{

    procLen = 0;
    instrArr = []; //Array to simulate instructions for a given process, will have RETURN as the last element. See Constructor.

    id = 0; //set by ProcessCB
    
    constructor(){ 

	this.procLen = Math.floor(Math.random() * (20)) + 1;
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
function ProcListDeets({procList}){

    return(
	    <div>

	    <h2>Generated Process Properties</h2>
	    
	    <ul>
	    
	    {procList.map((proc, index) => (
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

	let pc = 1;
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
function stepFIFO ({ FIFO_procList }, {FIFO_context}){

    //PC 0 means PC has not been set for a process. PC is 1 minumimum for line 1.
    if(FIFO_context.getPC(FIFO_procList[0]) == 0){

	FIFO_context.setContext(FIFO_procList[0]); 

    }

    let pc = FIFO_context.getPC(FIFO_procList[0]);

    if(FIFO_procList[0].instrArr[pc-1] == 'RETURN'){
	
	FIFO_procList.shift();
	
    }
    else{

	FIFO_context.incrementPC(FIFO_procList[0]);
	
    }


}

function FIFOChart({procs , pContext}) {

    //This took forever to fix. BarChart expects initialized labels and datasets for first render. 
    const [chartData, setChartData] = useState({

	labels: [],
	datasets: []

    });


     useEffect(() => {

	 
	const labels = [];
	const values = [];

	for(let i = 0; i < procs.length ; i++){

	    let pc = pContext.getPC(procs[i])
	    let progress = (procs[i].instrArr.length - pc);

	    labels.push(procs[i].id);
	    values.push(progress);
	    
	}
	
    setChartData({
	
    labels: labels,
    datasets: [
      {
          label: "# of instructions",
          data: values,
          backgroundColor: ["red", "blue", "green", "orange", "purple", "yellow"],
        borderColor: "black",
        borderWidth: 1,
      },
     	
    ],
    });
    }, [procs]); //Second argument for useEffect, updates when data changes.

    
  const options = {
      responsive: true,
      
      plugins: { legend: { display: false }, title: { display: false },
	       },
      
      scales: {
	  y: { beginAtZero: true, grid: { display: false }, ticks: { display: true } },
      },
  };

  return <Bar data={chartData} options={options} />;
};



export { createProc, process, ProcListDeets, Context, FIFOChart };
