import Resolvers from '../resolvers/movie.resolver';
import { driver } from '../clients/neo4j';

const resolvers = Resolvers(driver);

const getMovies = async (req, res) => {
    const movies = await resolvers.Query.getMovies();
    res.send({ status: 200, data: movies });
};

const getMovie = async (req, res) => {
    const { id } = req.params;
    const movie = await resolvers.Query.getMovie(id);

    res.status(200).json({ status: 200, data: movie });
};

const storeMovie = async (req, res) => {
    const { movie } = req.body;
    try {
        const mutationInput = {
            title: movie.title,
            director: movie.director,
            releaseDate: movie.releaseDate,
        };

        const createdMovie = await resolvers.Mutation.createMovie(null, { input: mutationInput });

        res.status(200).json({ status: 200, data: createdMovie });
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateMovie =async (req, res) => {
    try {
        const { id } = req.params;
        const { title, director, releaseDate } = req.body;
        const createdMovie = await resolvers.Mutation.updateMovie(null, { id, input:{title, director, releaseDate} });
        res.status(200).json(createdMovie);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        await resolvers.Mutation.deleteMovie(null, { id });

        res.status(200).json({
            status: 200,
            message: `Movie with ID ${id} deleted successfully.`,
        });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { getMovies, storeMovie, updateMovie, deleteMovie, getMovie };
