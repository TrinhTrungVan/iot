const mongoose = require("mongoose");

const TemperHumidSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
            trim: true,
        },
        time: {
            type: String,
            required: true,
            trim: true,
        },
        temperature: {
            type: String,
            required: true,
            trim: true,
        },
        humidity: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

let Dataset = mongoose.models.temperhumids || mongoose.model("temperhumids", TemperHumidSchema);
module.exports = Dataset;
