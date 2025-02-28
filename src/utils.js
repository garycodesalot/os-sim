class process{

    proccLen;
    instrArr; //Array to simulate instructions for a given process, will have RETURN as the last element. See Constructor.
    
    constructor(){ 

	this.proccLen = proccLen;
	this.instrArr = new Array(proccLen).fill(1);
	this.instrArr[proccLen - 1] = "RETURN"
    }
}

function createProcesses(formData){


    let processList = [];

    
    const length = formData.get("numProcesses")

    for(int i = numProcesses0 ; i < numProcesses ; i++){

	processList[i] = new process();

    }
    

    
    const process1 = new process(formData);
	
    alert(`'${numProcesses}' processes created with random amounts of instructions.`);
}
