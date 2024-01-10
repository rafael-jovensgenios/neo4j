import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

export const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  ),
  {
    maxConnectionLifetime: 8 * 60 * 1000,
    maxConnectionPoolSize: 45,
    connectionAcquisitionTimeout: 2 * 60 * 1000,
    disableLosslessIntegers: true,
  }
);
