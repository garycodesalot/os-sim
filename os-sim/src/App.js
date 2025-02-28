import React from "react";

function App() {
    return (
        <div>
            <h1>Hello, React!</h1>
            <Car brand="Toyota" />
        </div>
    );
}

function Car(props) {
    return <h2>This car is a {props.brand}.</h2>;
}

export default App;
