import React, { useState, useEffect } from "react";

const TemperHumi = (props) => {
    const socket = props.socket;

    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);

    useEffect(() => {
        socket.on("temperature-humidity", (data) => {
            const temper = data.temperature;
            const humid = data.humidity;
            // console.log(data);
            setTemperature(temper);
            setHumidity(humid);
        });
    }, [socket]);

    return (
        <div className='temperhumi-container'>
            <div className='block'>
                <p className='title'>Temperature (&#186;C)</p>
                <p className='content'>{temperature}</p>
            </div>
            <div className='block'>
                <p className='title'>Humidity (%)</p>
                <p className='content'>{humidity}</p>
            </div>
        </div>
    );
};

export default TemperHumi;
