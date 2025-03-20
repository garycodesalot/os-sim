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


class Context{

    nextID = 1; //Value assigned as each processes ID. Incremented when new process context is initialized with set().

    constructor(){ //Map to manage all processes and PC's
	
	this.PCBmap = new Map();
	this.procTime = new Map(); //only needed for MLFQ to track amt of time steps a process has been active an a queue.
	
    }

    setContext(proc){   //This will set the process ID for a single process and associate a pc variable to that ID in a key-value pair.

	let pc = 0;
	let time = 1;
	proc.id = this.nextID;
	this.PCBmap.set(proc.id, pc);
	this.procTime.set(proc.id, time);
	this.nextID = this.nextID + 1; //inc to next ID.
	
    }

    setProcTime(proc, value){

	this.procTime.set(proc.id, value);

    }

    getProcTime(proc){

	return this.procTime.get(proc.id);
	
    }

    getPC(proc){
	
	return this.PCBmap.get(proc.id) ?? 0; //"Nullish coalescing operator" returns 0 if process doesnt have a PC (null or undefined, im not sure)
	
    }

    incrementPC(proc){
	
	let currPC = this.getPC(proc) 
	this.PCBmap.set(proc.id, currPC + 1);
	
    }

}




//stepFIFO will manipulate the process / process list as appropiate for FIFO for a singular time quantum of the operation.
function StepFIFO (FIFO_procList, FIFO_context){

    //Have to make working context and proclist elements so that useEffect in the barchart function detects a refrence update and changes the chart.
    let fContext = new Context();
    fContext = FIFO_context;
    let fProcList = FIFO_procList

    
    if (!fProcList || fProcList.length == 0){

	//maybe return a flag here that calls a function to display the function stats
	return {fProcList, fContext};
	
	
    }

    let pc = fContext.getPC(fProcList[0]);

    //PC 0 means PC has not been set for a process. PC is 1 minumimum for line 1.
    if(pc == 0){

	fContext.setContext(fProcList[0]);

    }

    if(fProcList[0].instrArr[pc] == 'RETURN'){
	
	fProcList.shift();
	
    }
    else{

	fContext.incrementPC(fProcList[0]);
	
    }

    return {fProcList, fContext};
    
}


//Assuming processes do not all arrive at the same time, SJF is pretty much the exact same as FIFO, being non preemptive. I dont even know why I am making a new function. 
function StepSJF(SJF_procList, SJF_context){


    //Have to make working context and proclist elements so that useEffect in the barchart function detects a refrence update and changes the chart.
    let sContext = new Context();
    sContext = SJF_context;
    let sProcList = SJF_procList

    
    if (!sProcList || sProcList.length == 0){

	//maybe return a flag here that calls a function to display the function stats
	return {sProcList, sContext};
	
    }

    let pc = sContext.getPC(sProcList[0]);

    //PC 0 means PC has not been set for a process. PC is 1 minumimum for line 1.
    if(pc == 0){

	sContext.setContext(sProcList[0]);

    }

    if(sProcList[0].instrArr[pc] == 'RETURN'){
	
	sProcList.shift();
	
    }
    else{

	sContext.incrementPC(sProcList[0]);
	
    }

    //returns updated context, procList should be passed by reference and is modified in place so it does not need to be returned.
    return {sProcList, sContext};

}

function StepSTCF(STCF_procList, STCF_context) {

    //For the first process and then every time the function process list shifts, the first process (in work process) length must be checked against each of the remaining
    //process lengths, scheduling the shortest job, whichever it may be. TODO: fix the ID's during this one.

    let stContext = new Context();
    stContext = STCF_context;
    let stProcList = STCF_procList;

    if (!stProcList || stProcList.length == 0){

	//maybe return a flag here that calls a function to display the function stats
	return {stProcList, stContext};
	
    }

    let shortestIndex = 0;
    for(let i = 1; i < stProcList.length; i++){
	
	if(stProcList[i].instrArr.length < stProcList[shortestIndex].instrArr.length){
	    shortestIndex = i;
	}
    }

    //Swap shortest process with first process (one that will be stepped thru) if it has changed

    if(shortestIndex !== 0){
	[stProcList[0], stProcList[shortestIndex]] = [stProcList[shortestIndex], stProcList[0]];
    }

    let pc = stContext.getPC(stProcList[0]);

    if(pc == 0){

	stContext.setContext(stProcList[0]);

    }
    //execute process

    if(stProcList[0].instrArr[pc] == 'RETURN'){
	
	stProcList.shift();
	console.log("IF 2");
	
    }
    else{

	stContext.incrementPC(stProcList[0]);
	
    }

    return{stProcList, stContext};
}

function StepRR(RR_procList, RR_context){

    let rContext = new Context();
    rContext = RR_context;
    let rProcList = RR_procList;
    let temp = RR_procList[0];

   if (!rProcList || rProcList.length == 0){

	//maybe return a flag here that calls a function to display the function stats
	return {rProcList, rContext};
	
    }
    
    let pc = rContext.getPC(rProcList[0]);

    if(pc == 0){

	rContext.setContext(rProcList[0]);

    }
    
    if(rProcList[0].instrArr[pc] == 'RETURN'){
	
	rProcList.shift();
	
    }
    else{

	rContext.incrementPC(rProcList[0]);
	rProcList.shift();
	rProcList.push(temp);
	
    }

    return{rProcList, rContext};
    
}

function StepMLFQ(MLFQ_A, MLFQ_B, MLFQ_context, allotment, timeQuant){

    let mContext = new Context();
    mContext = MLFQ_context;
    let queA = MLFQ_A;
    let queB = MLFQ_B;

    if (!queA || queA.length == 0){

	//maybe return a flag here that calls a function to display the function stats
	return {queA, queB, mContext};
	
    }

    let pc = mContext.getPC(queA[0]);

    if(pc == 0){

	mContext.setContext(queA[0]);

    }

    if(queA[0].instrArr[pc] == 'RETURN'){

	//Process is done, push it off the process list
	queA.shift();
    }
    
    if( mContext.getProcTime(queA[0]) % allotment == 0){

	//Process used its whole allotment, deranking to queue B and reset its time executing
	mContext.setProcTime(queA[0], 1);
	queB.push(queA[0]);
	queA.shift();
	
    }else{

	//Increment processes time runnning and PC
	mContext.setProcTime(queA[0], mContext.getProcTime(queA[0]) + 1);
	mContext.incrementPC(queA[0]);

    }

    let boostTime = 7;

    if(timeQuant % boostTime == 0){

	for(let i = 0; i < queB.length ; i++){

	    queA.push(queB[0]);
	    queB.shift();
	    
	}

    }

    return{queA, queB, mContext};
    
}







    
function FIFO_SJF_STCF_RR_Chart({indata}) {

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
	      beginAtZero: true,
	      grid: { display: true },
	      ticks: { display: true },
	      min: 0,
	      max: 20
	  },
	},
    };

    return <Bar data={chartData} options={options} />;
};

export { createProc, process, Context, StepFIFO, StepSJF, StepSTCF, StepRR, StepMLFQ, FIFO_SJF_STCF_RR_Chart };
