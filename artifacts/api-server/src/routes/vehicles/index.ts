import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { vehiclesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/v1/vehicles", async (req, res) => {
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

    res.json({ vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      error: "InternalServerError",
      message: "Failed to fetch vehicles",
    });
  }
});

export default router;