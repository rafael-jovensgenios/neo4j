import { readFileSync, readdirSync } from "fs";

export const typeDefs = readdirSync("./src/types")
  .filter((file) => file.endsWith(".graphql"))
  .map((file) => readFileSync(`./src/types/${file}`, "UTF-8"))
  .join("\n");
