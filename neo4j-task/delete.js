const neo4j = require("neo4j-driver");

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "12345678";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
    const session = driver.session();

    try {
        console.log("Connecting to Neo4j...");

        // --- STEP 2: DELETE A RELATIONSHIP FIRST ---
        await session.run(`
      MATCH (d:Person {name: 'Diana'})-[r:FRIENDS_WITH]->(e:Person {name: 'Eve'})
      DELETE r
    `);
        console.log("Relationship between Diana and Eve deleted!");

        // --- STEP 2: DELETE A NODE ---
        await session.run(`
      MATCH (e:Person {name: 'Eve'})
      DELETE e
    `);
        console.log("Node Eve deleted!");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await session.close();
        await driver.close();
        console.log("Connection closed.");
    }
}

main();