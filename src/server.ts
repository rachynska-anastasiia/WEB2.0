import express from "express";
import cors from "cors";


import usersRoutes from "./users/router";
import boardsRoutes from "./boards/router";
import todoRoutes from "./concrete_board/router";
import taskRoutes from "./tasks/router";
import { errorHandler } from "./errorHandler/service";
import { authMiddleware } from "./middleware/auth";
//import {Request, Response} from "express";

const app = express();

// midleware
app.use(cors());
app.use(express.json());

//routers
app.use("/users", authMiddleware, usersRoutes);
app.use("/boards", authMiddleware, boardsRoutes);
app.use("/concrete_board", authMiddleware, todoRoutes);
app.use("/tasks", authMiddleware, taskRoutes);

app.use(errorHandler);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});





