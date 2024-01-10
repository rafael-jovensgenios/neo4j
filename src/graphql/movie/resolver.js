
const createMovie1 = async (_, { input }, { driver }) => {
    console.log('log');
    const session = driver.session();
    const { title, director, releaseYear, genre, duration, synopsis } = input;

    try {
        const result = await session.run(
            `
        CREATE (movie:Movie {
          title: $title,
          director: $director,
          releaseYear: $releaseYear,
          genre: $genre,
          duration: $duration,
          synopsis: $synopsis
        })
        RETURN movie
        `,
            {
                title,
                director,
                releaseYear,
                genre,
                duration,
                synopsis,
            }
        );

        const createdMovie = result.records[0].get('movie').properties;
        return createdMovie;
    } catch (error) {
        console.error('Erro ao criar o Movie:', error); 
    } finally {
        console.error('Erro ao criar o Movie:', error);
        await session.close();
    }
};

export const movieResolvers = {
    Mutation: {
        createMovie1,
    },
};