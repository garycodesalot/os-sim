class process{

    procLen = 0;
    instrArr = []; //Array to simulate instructions for a given process, will have RETURN as the last element. See Constructor.
    
    constructor(){ 

	this.procLen = Math.floor(Math.random() * (20)) + 1;
	this.instrArr = new Array(this.procLen).fill(1);
	this.instrArr[this.procLen - 1] = "RETURN";
    }
}

function createProc(quantity){
    
    let procList = [];
    
    for(let i = 0 ; i < quantity ; i++){

	procList.push(new process());

    }

  return procList;

}

function getProcLen(num, procList){

    return procList[num]?.procLen || 0;
    
}


export { createProc, process, getProcLen };
