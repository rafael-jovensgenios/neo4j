import { gql } from "apollo-server";
import { movieResolvers } from "./graphql/movie/resolver";
import { movieTypeDefs } from "./graphql/movie/typedefs";

const rootTypedefs = gql `
    type Query {
        _empty: Boolean
    }
    type Mutation {
        _empty: Boolean
    }
`;

const rootResolvers = {
    Query: {
        _empty: () => true
    },
    Mutation: {
      _empty: () => true
    }
}

export const typeDefs = [rootTypedefs, movieTypeDefs]
export const resolvers = [rootResolvers, movieResolvers]