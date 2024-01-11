import { driver } from '../clients/neo4j';

export default {
    Query: {
        getMovie: async (_, args, context, requestInfo) => {
            const session = driver.session();

            try {
              const result =  await session.run('MATCH (m:Movie {title: $title}) RETURN m', {title: 'Teste2'});
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
};