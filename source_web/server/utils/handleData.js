const handleData = (data) => {
    const date = new Date();
    const day = date.toLocaleDateString();
    const time = date.toLocaleTimeString();
    const temper = Math.round(parseFloat(data.Temperature) * 10) / 10;
    const humid = parseInt(data.Humidity);

    return {
        day: day,
        time: time,
        temperature: temper,
        humidity: humid,
    };
};

module.exports = handleData;
