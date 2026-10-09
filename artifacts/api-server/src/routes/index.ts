import { Router, type IRouter } from "express";
import bookingsRouter from "./bookings";
import vehiclesRouter from "./vehicles";
import webhooksRouter from "./webhooks";
import paymentsRouter from "./payments";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(bookingsRouter);
router.use(vehiclesRouter);
router.use(webhooksRouter);
router.use(paymentsRouter);
router.use(healthRouter);

export default router;