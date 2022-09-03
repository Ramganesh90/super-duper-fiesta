import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.js";
import apiLogs from "./middleware/logger.js";
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);
app.use(apiLogs);

const URI = "mongodb+srv://api-user-test:test-user-api@cluster0.dapg4.mongodb.net/tinyapp?retryWrites=true&w=majority";

function connect() {
    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

mongoose.connection.on("disconnected", () => {
    console.log("Mongo DB disconnected!!!");
});
mongoose.connection.on("connected", () => {
    console.log("Mongo DB connected!!!");
});

app.get("/", (req, res) => {
    res.send("Hello from Api");
});
app.use("/api", routes);

app.listen(5000, () => {
    connect();
    console.log("App started and listening at port 5000");
});
