import express from "express";
import { getMovies } from "../controllers/moviesController";

const router = express.Router();

// Endpoint /movies
router.get("/", async (req, res) => {
  try {
    const result = await getMovies(req.app.locals.server);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;