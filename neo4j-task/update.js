const neo4j = require("neo4j-driver");

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "12345678";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
    const session = driver.session();

    try {
        console.log("Connecting to Neo4j...");

        // --- STEP 3: UPDATE NODE PROPERTIES ---
        await session.run(`
      MATCH (a:Person {name: 'Alice'})
      SET a.age = 26, a.city = 'Cairo'
    `);
        console.log("Alice's properties updated!");

        await session.run(`
      MATCH (b:Person {name: 'Bob'})
      SET b.age = 29, b.city = 'Alexandria'
    `);
        console.log("Bob's properties updated!");

        await session.run(`
      MATCH (c:Person {name: 'Charlie'})
      SET c.age = 24, c.city = 'Cairo'
    `);
        console.log("Charlie's properties updated!");

        await session.run(`
      MATCH (d:Person {name: 'Diana'})
      SET d.age = 27, d.city = 'Giza'
    `);
        console.log("Diana's properties updated!");

        // --- STEP 3: UPDATE RELATIONSHIP PROPERTIES ---
        await session.run(`
      MATCH (a:Person {name: 'Alice'})-[r:FRIENDS_WITH]->(b:Person {name: 'Bob'})
      SET r.since = 2018, r.closeness = 'best friends'
    `);
        console.log("Alice-Bob relationship updated!");

        await session.run(`
      MATCH (b:Person {name: 'Bob'})-[r:FRIENDS_WITH]->(d:Person {name: 'Diana'})
      SET r.since = 2017, r.closeness = 'close friends'
    `);
        console.log("Bob-Diana relationship updated!");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await session.close();
        await driver.close();
        console.log("Connection closed.");
    }
}

main();