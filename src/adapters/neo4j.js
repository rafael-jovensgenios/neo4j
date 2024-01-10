import { driver } from "../clients/neo4j";

export async function neo4jRead(cypher, variables) {
  const session = driver.session({ database: "neo4j" });

  try {
    const response = await session.executeRead((transaction) => {
      return transaction.run(cypher, variables);
    });
    return response;
  } catch (error) {
    console.error(
      `Error on executeRead Cypher: ${JSON.stringify({
        cypher,
        variables,
        error,
      })}`
    );
  } finally {
    await session.close();
  }
}

export async function neo4jWrite(cypher, variables) {
  const session = driver.session({ database: "neo4j" });

  /**
   * @type {import("neo4j-driver").QueryResult | undefined }
   */
  try {
    const response = await session.executeWrite((transaction) => {
      return transaction.run(cypher, variables);
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
