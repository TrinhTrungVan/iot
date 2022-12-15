import React, { useEffect, useRef } from "react";
import { useState } from "react";

const ButtonGroup = (props) => {
    const socket = props.socket;

    const temperLimit = useRef(100);
    const humidLimit = useRef(100);
    const [temper, setTemper] = useState("");
    const [humid, setHumid] = useState("");
    const [ledStatus, setLedStatus] = useState(false);
    const [bellStatus, setBellStatus] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const handleChangeLed = () => {
        socket.emit("led_change", {
            ledStatus: ledStatus,
            socketID: socket.id,
        });
        setLedStatus((ledStatus) => !ledStatus);
    };
    const handleChangeBell = () => {
        socket.emit("bell_change", {
            bellStatus: bellStatus,
            socketID: socket.id,
        });
        setBellStatus((bellStatus) => !bellStatus);
    };

    const handleChangeTemper = (e) => {
        setTemper(e.target.value);
    };
    const handleSetTemper = () => {
        temperLimit.current = temper;
        console.log(temperLimit);
        alert("Đặt giới hạn nhiệt độ thành công!");
    };

    const handleChangeHumid = (e) => {
        setHumid(e.target.value);
    };
    const handleSetHumid = () => {
        humidLimit.current = humid;
        console.log(humidLimit);
        alert("Đặt giới hạn độ ẩm thành công!");
    };

    const closeModal = () => {
        setShowWarning(false);
    };

    useEffect(() => {
        socket.on("temperature-humidity", (value) => {
            if (value.temperature > temperLimit.current || value.humidity > humidLimit.current) {
                socket.emit("led_change", {
                    ledStatus: false,
                    socketID: socket.id,
                });
                socket.emit("bell_change", {
                    ledStatus: false,
                    socketID: socket.id,
                });
                setLedStatus(true);
                setBellStatus(true);
                temperLimit.current = 100;
                humidLimit.current = 100;
                setTemper("");
                setHumid("");
                setShowWarning(true);
            }
        });
    }, [socket]);

    return (
        <>
            <div className='button-group'>
                <div className='temper-limit button-field'>
                    <span className='title'>Giới hạn nhiệt độ: </span>
                    <input className='input' type='text' value={temper} onChange={handleChangeTemper} />
                    <button className='button' onClick={handleSetTemper}>
                        Đặt
                    </button>
                </div>
                <div className='humid-limit button-field'>
                    <span className='title'> Giới hạn độ ẩm: </span>
                    <input className='input' type='text' value={humid} onChange={handleChangeHumid} />
                    <button className='button' onClick={handleSetHumid}>
                        Đặt
                    </button>
                </div>
                <div className='led button-field'>
                    <span className='title'>Đèn cảnh báo: </span>
                    <button className='led-button button' role='button' onClick={handleChangeLed}>
                        {ledStatus ? "ON" : "OFF"}
                    </button>
                </div>
                <div className='bell button-field'>
                    <span className='title'>Chuông cảnh báo: </span>
                    <button className='bell-button button' role='button' onClick={handleChangeBell}>
                        {bellStatus ? "ON" : "OFF"}
                    </button>
                </div>
            </div>
            {showWarning && (
                <div className='warning-modal'>
                    <div className='modal-content'>
                        <p className='modal-title'>Nhiệt độ hoặc độ ẩm vượt giới hạn!</p>
                        <button className='modal-confirm' onClick={closeModal}>
                            Đồng ý
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ButtonGroup;
