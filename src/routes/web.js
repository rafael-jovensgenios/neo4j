import express from 'express';
import { getMovies , storeMovie, updateMovie, deleteMovie } from '../controllers/moviesController';
const router = express.Router();

router.get('/movies', getMovies);
router.get('/movie/:id', getMovies);
router.post('/movie', storeMovie);
router.put('/movie/:id', updateMovie);
router.delete('/movie/:id', deleteMovie);

export default router;