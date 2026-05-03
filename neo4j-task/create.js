const neo4j = require("neo4j-driver");

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "12345678";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
    const session = driver.session();

    try {
        // --- CONNECT ---
        console.log("Connecting to Neo4j...");

        // --- STEP 1: CREATE NODES ---
        await session.run(`
      CREATE (a:Person {name: 'Alice', age: 24})
      CREATE (b:Person {name: 'Bob', age: 27})
      CREATE (c:Person {name: 'Charlie', age: 22})
      CREATE (d:Person {name: 'Diana', age: 25})
      CREATE (e:Person {name: 'Eve', age: 23})
    `);
        console.log("Nodes created!");

        // --- STEP 1: CREATE RELATIONSHIPS ---
        await session.run(`
      MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
      CREATE (a)-[:FRIENDS_WITH {since: 2020}]->(b)
    `);

        await session.run(`
      MATCH (a:Person {name: 'Alice'}), (c:Person {name: 'Charlie'})
      CREATE (a)-[:FRIENDS_WITH {since: 2021}]->(c)
    `);

        await session.run(`
      MATCH (b:Person {name: 'Bob'}), (d:Person {name: 'Diana'})
      CREATE (b)-[:FRIENDS_WITH {since: 2019}]->(d)
    `);

        await session.run(`
      MATCH (c:Person {name: 'Charlie'}), (d:Person {name: 'Diana'})
      CREATE (c)-[:FRIENDS_WITH {since: 2022}]->(d)
    `);

        await session.run(`
      MATCH (d:Person {name: 'Diana'}), (e:Person {name: 'Eve'})
      CREATE (d)-[:FRIENDS_WITH {since: 2023}]->(e)
    `);

        console.log("Relationships created!");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await session.close();
        await driver.close();
        console.log("Connection closed.");
    }
}

main();