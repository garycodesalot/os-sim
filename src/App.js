import React, { useState } from "react";
import "./styles.css";
import {createProcess, process} from "./utils.js";

function App() {
    return (
  <>
        <div className="center">
            <h1>Dirns OS Scheduler Simulation</h1>
        </div>
      
      <hr />
      
      	<form action={createProcess}>
	    <input name="length" />
	    <button type="submit">Create Processes</button>
	</form>

  </>
    );

    
}

export default App;
