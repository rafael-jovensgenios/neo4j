export const validateMovieFields = (movie) => {
    const { title, director, releaseDate } = movie;
    return title && director && releaseDate;
};