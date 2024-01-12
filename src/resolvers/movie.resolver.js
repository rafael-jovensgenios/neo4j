import { driver } from '../clients/neo4j';

export default (neo4jDriver) => ({
  Query: {
    getMovie: async (id) => {
      const session = neo4jDriver.session();

      try {
        if (!id) {
          throw new Error('ID do filme não fornecido.');
        }

        const query = `
            MATCH (m:Movie)
            WHERE ID(m) = ${id}
            RETURN m
        `;
        const result = await session.run(query);

        if (result.records.length === 0) {
          console.error(`Nenhum filme encontrado com o ID ${id}.`);
          return (`Nenhum filme encontrado com o ID ${id}.`);
        }
        const movie = { ...result.records[0].get('m').properties };

        return movie
      } catch (error) {
        console.error('Erro durante a execução da função getMovie:', error.message);
        throw error;
      } finally {
        await session.close();
      }
    },
    getMovies: async (_, args, context, requestInfo) => {
      const session = driver.session();

      try {
        const result = await session.run('MATCH (m:Movie) RETURN m');

        const movies = result.records.map(record => {
          const movie = record.get('m').properties;
          return {
            title: movie.title,
            director: movie.director,
            releaseDate: movie.releaseDate,
          };
        });

        return movies;
      } finally {
        await session.close();
      }
    },
  },
  Mutation: {
    createMovie: async (_, { input }) => {
      const session = driver.session();

      try {
        const result = await session.run(
          'CREATE (m:Movie {title: $title, director: $director, releaseDate: $releaseDate}) RETURN m',
          {
            title: input.title,
            director: input.director,
            releaseDate: input.releaseDate,
          }
        );

        const createdMovie = result.records[0].get('m').properties;
        return createdMovie;
      } finally {
        await session.close();
      }
    },
    updateMovie: async (_, { id, input }) => {
      const session = driver.session();
      try {
        const result = await session.run(
          'MATCH (m:Movie {id: $id}) SET m += {title: $title, director: $director, releaseDate: $releaseDate} RETURN m',
          {
            id: id,
            title: input.title,
            director: input.director,
            releaseDate: input.releaseDate,
          }
        );

        if (result.records.length > 0) {
          const updatedMovie = result.records[0].get('m').properties;
          return updatedMovie;
        } else {
          return ('Filme não encontrado com o ID especificado.');
        }
      } finally {
        await session.close();
      }
    },
    deleteMovie: async (_, { id }) => {
      const session = driver.session();

      try {
        const result = await session.run('MATCH (m:Movie {id: $id}) DETACH DELETE m', {
          id: id,
        });

        return result.summary.counters.nodesDeleted > 0;
      } finally {
        await session.close();
      }
    },
  }
});