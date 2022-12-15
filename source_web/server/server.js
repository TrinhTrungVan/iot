const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");

const connectDB = require("./utils/connectDB.js");
const handleData = require("./utils/handleData.js");
const TemperHumid = require("./models/dataModel.js");
//Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});

var client = mqtt.connect("mqtt://192.168.1.104:1883");

client.on("connect", function () {
    console.log("connected mqtt " + client.connected);
});

client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1);
});
client.subscribe("temperature-humidity");

app.get("/api/temperhumid", async (req, res) => {
    const values = await TemperHumid.find({});
    res.json(values);
});

socketIO.on("connection", (socket) => {
    console.log(`${socket.id} user just connected!`);

    client.on("message", async (topic, message) => {
        const rawData = JSON.parse(message.toString());
        const data = handleData(rawData);
        const newData = await TemperHumid(data);
        await newData.save();
        console.log(data);
        socket.emit("temperature-humidity", data);
    });

    socket.on("led_change", (data) => {
        if (data.ledStatus) {
            client.publish("led", "OFF");
            console.log("LED : OFF");
        } else {
            client.publish("led", "ON");
            console.log("LED : ON");
        }
    });

    socket.on("bell_change", (data) => {
        if (data.bellStatus) {
            client.publish("bell", "OFF");
            console.log("BELL : OFF");
        } else {
            client.publish("bell", "ON");
            console.log("BELL : ON");
        }
    });
    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

http.listen(1904, () => {
    console.log("Server is running on port: 1904");
});
