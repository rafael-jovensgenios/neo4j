/**
 * This file serves as the entry point for the Student Answer Service API.
 * It imports necessary dependencies, initializes the Apollo Server, and starts the server.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";

import { typeDefs } from "./types/typeDefs";
import { resolvers } from "./resolvers/index";

import { driver } from "./clients/neo4j";

import { Neo4jGraphQL, CypherRuntime } from "@neo4j/graphql";
import routes from './routes/web';

dotenv.config();

const app = express();

const host = process.env.GRAPHQL_SERVER_HOST || "127.0.0.1";
const port = process.env.GRAPHQL_SERVER_PORT || 4000;
const path = process.env.GRAPHQL_SERVER_PATH || "/graphql";

const initializeNeo4jGraphql = async () => {
  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers,
  });
  return neoSchema.getSchema();
};

/**
 * Initializes the Apollo Server, sets up the necessary middleware, and starts the server.
 * @returns {Promise<void>} A promise that resolves when the server is successfully started.
 */
const initializeServer = async () => {
  const schema = await initializeNeo4jGraphql();
  const server = new ApolloServer({
    schema,
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  const httpServer = createServer(app);

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
  
  app.use(
    path,
    cors(),
    express.urlencoded({ extended: true, limit: "20mb" }),
    express.json({ limit: "20mb" }),
    expressMiddleware(server, {
      context: ({ req }) => ({ driver }),
    })
  );

  app.use('/', routes);

  httpServer.listen({ port, host, path }, () => {
    console.log(`🚀 Server ready at http://${host}:${port}${path}`);
  });

  app.get("/health", (req, res) => {
    res.status(200).send("Okay!");
  });
};

initializeServer();
