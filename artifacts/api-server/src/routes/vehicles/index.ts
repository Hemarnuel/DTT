import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { vehiclesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/v1/vehicles", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleClass } = req.query;

    if (vehicleClass && typeof vehicleClass === "string") {
      const vehicles = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.isActive, true),
            eq(vehiclesTable.vehicleClass, vehicleClass as any),
          ),
        );
      return res.json({ vehicles });
    }

    const vehicles = await db
      .select()
      .from(vehiclesTable)
      .where(eq(vehiclesTable.isActive, true));

    return res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

export default router;
