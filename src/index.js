import { ApolloServer, gql } from "apollo-server";
import {Neo4jGraphQL} from "@neo4j/graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { typeDefs } from "./squema";
import { movieResolvers } from "./graphql/movie/resolver";
console.log(movieResolvers);
require('dotenv').config();
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    
    const server = new ApolloServer({
      schema,
      resolvers: [movieResolvers],
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
          settings: {
            'editor.theme': 'dark',
          },
        }),
      ],
      context: ({ req }) => ({ driver })
    });
  
    server.listen(4001).then(({ url }) => {
      console.log(`GraphQL server ready on ${url}`);
    }).catch((error) => {
      console.error("Error starting server:", error);
    });
  }).catch((error) => {
    console.error("Error building schema:", error);
  });


// const { ApolloServer } = require("apollo-server");
// const { Neo4jGraphQL } = require("@neo4j/graphql");
// const neo4j = require("neo4j-driver");
// const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
// const fs = require("fs");
// const path = require("path");

// require('dotenv').config();

// // Configuração para aumentar o limite de ouvintes de eventos
// require('events').EventEmitter.defaultMaxListeners = 15;

// // Leitura do arquivo typedef.graphql para Movie
// const movieTypeDefs = fs.readFileSync(path.join(__dirname, "graphql/movie/typedef.graphql"), "utf-8");
// const queries = fs.readFileSync(path.join(__dirname, "graphql/query.graphql"), "utf-8");

// // Importando resolvers apenas para Movie
// const movieResolvers = require("./graphql/movie/resolver");

// const typeDefs = `${queries}`;

// const driver = neo4j.driver(
//   process.env.NEO4J_URI,
//   neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
// );

// const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

// neoSchema.getSchema().then((schema) => {
//   const server = new ApolloServer({
//     schema,
//     plugins: [
//       ApolloServerPluginLandingPageGraphQLPlayground({
//         settings: {
//           'editor.theme': 'light',
//         },
//       }),
//     ],
//   });

//   server.listen().then(({ url }) => {
//     console.log(`GraphQL server ready on ${url}`);
//   }).catch((error) => {
//     console.error("Error starting server:", error);
//   });
// }).catch((error) => {
//   console.error("Error building schema:", error);
// });