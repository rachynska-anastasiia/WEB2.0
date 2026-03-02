import express from "express";
import cors from "cors";


import usersRoutes from "./routes/users.routes";
import boardsRoutes from "./routes/boards.routes";

//import { initTodo } from "./db";

import {Request, Response} from "express";

const app = express();

// midleware
app.use(cors());
app.use(express.json());

//routers
app.use("/users", usersRoutes);
app.use("/boards", boardsRoutes);


/*app.get("/", (req: Request, res: Response) => {
    res.json({message: "Hello World"});
});*/
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});





