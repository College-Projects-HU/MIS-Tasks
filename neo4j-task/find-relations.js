const neo4j = require("neo4j-driver");

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "12345678";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
    const session = driver.session();

    try {
        console.log("Connecting to Neo4j...");

        // --- STEP 5: FIND RELATIONSHIPS BASED ON CONDITIONS ---

        // Find all friendships that started before 2021
        const result1 = await session.run(`
      MATCH (a:Person)-[r:FRIENDS_WITH]->(b:Person)
      WHERE r.since < 2021
      RETURN a.name AS person1, b.name AS person2, r.since AS since, r.closeness AS closeness
    `);
        console.log("\nFriendships that started before 2021:");
        result1.records.forEach(record => {
            console.log(`- ${record.get("person1")} → ${record.get("person2")} | Since: ${record.get("since")} | Closeness: ${record.get("closeness")}`);
        });

        // Find all friendships where closeness is 'best friends'
        const result2 = await session.run(`
      MATCH (a:Person)-[r:FRIENDS_WITH]->(b:Person)
      WHERE r.closeness = 'best friends'
      RETURN a.name AS person1, b.name AS person2, r.since AS since, r.closeness AS closeness
    `);
        console.log("\nBest friend relationships:");
        result2.records.forEach(record => {
            console.log(`- ${record.get("person1")} → ${record.get("person2")} | Since: ${record.get("since")} | Closeness: ${record.get("closeness")}`);
        });

        // Find all friends of Alice (one hop away)
        const result3 = await session.run(`
      MATCH (a:Person {name: 'Alice'})-[:FRIENDS_WITH]->(friend:Person)
      RETURN friend.name AS name, friend.age AS age, friend.city AS city
    `);
        console.log("\nAlice's direct friends:");
        result3.records.forEach(record => {
            console.log(`- ${record.get("name")}, Age: ${record.get("age")}, City: ${record.get("city")}`);
        });

        // Find friends of friends of Alice (two hops away)
        const result4 = await session.run(`
      MATCH (a:Person {name: 'Alice'})-[:FRIENDS_WITH]->(friend:Person)-[:FRIENDS_WITH]->(fof:Person)
      WHERE fof.name <> 'Alice'
      RETURN DISTINCT fof.name AS name, fof.age AS age, fof.city AS city
    `);
        console.log("\nAlice's friends of friends:");
        result4.records.forEach(record => {
            console.log(`- ${record.get("name")}, Age: ${record.get("age")}, City: ${record.get("city")}`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await session.close();
        await driver.close();
        console.log("\nConnection closed.");
    }
}

main();