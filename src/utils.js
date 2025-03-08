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
	//this.instrArr[this.procLen - 1] = "RETURN";
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

    setContext(process){   //This will set the process ID for a single process and associate a pc variable to that ID in a key-value pair.

	let pc = 0; //default PC starts at "line 1" or index 0 of process.instr[].
	process.id = this.nextID;
	this.PCBmap.set(process.id, pc);
	this.nextID = this.nextID + 1; //inc to next ID.
	
    }

    getPC(process){
	
	return this.PCBmap.get(process.id) ?? 0; //"Nullish coalescing operator" returns 0 if process doesnt have a PC (null or undefined, im not sure)
	
    }

    incrementPC(process){
	
	let currPC = this.getPC(process) 
	this.PCBmap.set(process.id, currPC + 1);
	
    }

    removeProcess(process){

	this.PCBmap.delete(process.id);
	
    }

}


//Need a statement in App(): FIFO_procList = procList &  FIFO_context = new context(); This isnt normal to a real OS but since we are
//running multiple schedulers each operation needs their own process list to maniupulate.

//stepFIFO will manipulate the process / process list as appropiate for FIFO for a singular time quantum of the operation.
function stepFIFO ({ FIFO_procList }, {FIFO_context}){

    if(FIFO_context.getPC(FIFO_procList[0])){

	FIFO_context.setContext(FIFO_procList[0]); 

    }

    let progress = FIFO_procList[0].instrArr.length - FIFO_context.getPC(FIFO_procList[0]);

    if(progress == 0){
	FIFO_procList.shift();
    }
    else{

	FIFO_context.incrementPC(FIFO_procList[0]);
	
    }


}



function BarChart({procList}) {
  const data = {
    labels: ["red", "blue", "green", "orange", "purple", "yellow"],
    datasets: [
      {
        label: "# of instructions",
        data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ["red", "blue", "green", "orange", "purple", "yellow"],
        borderColor: "black",
        borderWidth: 1,
      },
     	
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
      scales: {
	  y: { beginAtZero: true, grid: { display: false }, ticks: { display: true } },
      },
  };

  return <Bar data={data} options={options} />;
};



export { createProc, process, ProcListDeets, Context, BarChart };
