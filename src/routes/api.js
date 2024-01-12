import express from 'express';
import { getMovies , storeMovie, updateMovie, deleteMovie, getMovie } from '../controllers/moviesController';
const router = express.Router();

router.get('/api/movies', getMovies);
router.get('/api/movie/:id', getMovie);
router.post('/api/movie', storeMovie);
router.put('/api/movie/:id', updateMovie);
router.delete('/api/movie/:id', deleteMovie);

export default router;