import { gql } from "apollo-server";

export const movieTypeDefs = gql`
    extend type Query {
        movie: Movie
        movies: [Movie]
    }

    extend type Mutation {
        createMovie2(input: MovieInput): Movie
    }
        
    type Movie {
        id: ID! @id
        title: String,
        director: String,
        releaseYear: String,
        genre: String,
        duration: String,
        synopsis: String
    }

    input MovieInput {
        title: String,
        director: String,
        releaseYear: String,
        genre: String,
        duration: String,
        synopsis: String
    }    
`
