import express from "express";
import cors from "cors";
//import { initTodo } from "./db";

import router from "./routes";

import {Request, Response} from "express";

const app = express();
app.use(cors());

/*app.get("/", (req: Request, res: Response) => {
    res.json({message: "Hello World"});
});*/
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
