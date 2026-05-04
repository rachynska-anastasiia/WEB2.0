import { Router } from "express";
import { Request, Response } from "express";
import { JobsService } from "./service";
import { AppError } from "../errorHandler/service";

export const jobsRoutes = Router();
const service = new JobsService();

jobsRoutes.post("/createJob", async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { title, idempotency_key } = req.body;

    if (!title) throw new AppError(401, "title is required");
    if (!idempotency_key) throw new AppError(401, "Idempotency key is required");

    const result = await service.createJob(userId, { idempotency_key, title });

    return res.status(202).json(result);
});

jobsRoutes.get("/", async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const rows = await service.listJobs(userId);
    return res.status(200).json(rows);
});

jobsRoutes.get("/:id", async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const result = await service.getJobStatus(userId, Number(req.params.id));

    if (!result) return res.status(404).json({ error: "Job not found" });

    return res.status(200).json(result);
});

jobsRoutes.get("/:id/result", async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const result = await service.getJobResult(userId, Number(req.params.id));

    return res.status(200).json(result);
});

export default jobsRoutes;