import { driver } from '../clients/neo4j';

export default {
  Query: {
    getMovie: async (_, args, context, requestInfo) => {
      const session = driver.session();

      try {
        const result = await session.run('MATCH (m:Movie {title: $title}) RETURN m', { title: 'Teste2' });
        console.log(result.records.records, args);


        const movies = result.records.map(record => {
          const movie = record.get('m').properties;
          return {
            title: movie.title,
            director: movie.director,
            releaseDate: movie.releaseDate,
          };
        });
        console.log(movies);
        return movies
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
    updateMovie: async (_, { id, input }, context) => {
      const session = driver.session();
      console.log(id);
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
        console.log(result.records);
        if (result.records.length > 0) {
          const updatedMovie = result.records[0].get('m').properties;
          return updatedMovie;
        } else {
          throw new Error('Filme não encontrado com o ID especificado.');
        }
      } finally {
        await session.close();
      }
    },
    deleteMovie: async (_, { id }, context) => {
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
};