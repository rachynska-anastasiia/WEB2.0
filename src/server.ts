//server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connect } from "./mq/rabbit";
import { startJobsEventsConsumer } from "./jobs/events.consumer";

import usersRoutes from "./users/router";
import boardsRoutes from "./boards/router";
import todoRoutes from "./concrete_board/router";
import taskRoutes from "./tasks/router";
import jobsRoutes from "./jobs/router";
import { errorHandler } from "./errorHandler/service";
import { authMiddleware } from "./middleware/auth";
//import {Request, Response} from "express";

dotenv.config();

const app = express();

// midleware
app.use(cors());
app.use(express.json());

//routers
app.use("/users", usersRoutes);
app.use("/boards", authMiddleware, boardsRoutes);
app.use("/concrete_board", authMiddleware, todoRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/jobs", authMiddleware, jobsRoutes);

app.use(errorHandler);

const startServer = async () => {
    try{
        await connect();
        await startJobsEventsConsumer();
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}

startServer();




