class process{

    procLen = 0;
    instrArr = []; //Array to simulate instructions for a given process, will have RETURN as the last element. See Constructor.
    
    constructor(){ 

	this.procLen = Math.floor(Math.random() * (20)) + 1;
	this.instrArr = new Array(this.procLen).fill(1);
	this.instrArr[this.procLen - 1] = "RETURN";
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

//TODO: function will return HTML that displays all of the processes, their index in proclist, and length.
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

    export { createProc, process, ProcListDeets };
