import Resolvers from '../resolvers/movie.resolver';
import { driver } from '../clients/neo4j';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import { validateMovieFields } from '../validators/validatorMovie'

const resolvers = Resolvers(driver);

const getMovies = async (req, res) => {
    const movies = await resolvers.Query.getMovies();
    res.send({ status: HTTP_STATUS.OK, data: movies });
};

const getMovie = async (req, res) => {
    const { id } = req.params;
    const movie = await resolvers.Query.getMovie(parseInt(id));

    res.status(HTTP_STATUS.OK).json({ data: movie });
};

const storeMovie = async (req, res) => {
    const { movie } = req.body;

    try {
        const { title, director, releaseDate } = movie;

        if (validateMovieFields(movie)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.MISSING_PROPERTIES_MOVIE });
        }

        const createdMovie = await resolvers.Mutation.createMovie(null, { input: { title, director, releaseDate } });
        res.status(HTTP_STATUS.OK).json({ data: createdMovie });
    } catch (error) {
        console.error(`${ERROR_MESSAGES.MISSING_PROPERTIES_MOVIE}:`, error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, director, releaseDate } = req.body;

        if (!validateMovieFields({ title, director, releaseDate })) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.MISSING_FIELDS_MOVIE });
        }

        const createdMovie = await resolvers.Mutation.updateMovie(null, { id, input: { title, director, releaseDate } });
        res.status(HTTP_STATUS.OK).json(createdMovie);
    } catch (error) {
        console.error(`${ERROR_MESSAGES.ERROR_UPDATING_MOVIE}:`, error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        await resolvers.Mutation.deleteMovie(null, { id });

        res.status(HTTP_STATUS.OK).json({ message: `Movie with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error(ERROR_MESSAGES.ERROR_DELETING_MOVIE, error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export { getMovies, storeMovie, updateMovie, deleteMovie, getMovie };
