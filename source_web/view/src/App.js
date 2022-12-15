import Chart from "./components/Chart";
import ButtonGroup from "./components/ButtonGroup";
import TemperHumi from "./components/TemperHumid";

import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:1904");

function App() {
    const date = new Date();
    const day = date.toLocaleDateString();
    return (
        <>
            <div className='day'>{day}</div>
            <div className='section-top'>
                <TemperHumi socket={socket} />
                <ButtonGroup socket={socket} />
            </div>
            <Chart socket={socket} />
        </>
    );
}

export default App;
