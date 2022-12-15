import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CSVLink } from "react-csv";

const Chart = (props) => {
    const socket = props.socket;
    const [data, setData] = useState([]);
    const prevData = useRef();

    useEffect(() => {
        const getData = async () => {
            let res = await fetch("http://localhost:1904/api/temperhumid")
                .then((res) => res.json())
                .then((res) => {
                    return res.slice(0, 20);
                });
            prevData.current = res;
            setData(res);
        };
        getData();
        console.log(data);
    }, []);

    useEffect(() => {
        prevData.current = data;
        socket.on("temperature-humidity", (value) => {
            const newData = [...prevData.current, value];
            newData.shift();
            prevData.current = newData;
            setData(newData);
        });
    }, [socket]);

    return (
        <>
            <h1 className='chart-title'>Chart</h1>
            <LineChart
                width={1400}
                height={350}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray='2 2' />
                <XAxis dataKey='time' />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='temperature' isAnimationActive={false} stroke='#8884d8' activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type='monotone' dataKey='humidity' isAnimationActive={false} stroke='#82ca9d' activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
            <button className='button' style={{ width: "120px", marginLeft: "680px" }}>
                <CSVLink data={data} filename={"data.csv"}>
                    Xuất Excel
                </CSVLink>
            </button>
        </>
    );
};

export default Chart;
