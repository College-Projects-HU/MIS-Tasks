const neo4j = require("neo4j-driver");

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "12345678";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
    const session = driver.session();

    try {
        console.log("Connecting to Neo4j...");

        // --- STEP 4: FIND NODES BASED ON CONDITIONS ---

        // Find all people older than 24
        const result1 = await session.run(`
      MATCH (p:Person)
      WHERE p.age > 24
      RETURN p.name AS name, p.age AS age, p.city AS city
    `);
        console.log("\nPeople older than 24:");
        result1.records.forEach(record => {
            console.log(`- ${record.get("name")}, Age: ${record.get("age")}, City: ${record.get("city")}`);
        });

        // Find all people who live in Cairo
        const result2 = await session.run(`
      MATCH (p:Person)
      WHERE p.city = 'Cairo'
      RETURN p.name AS name, p.age AS age, p.city AS city
    `);
        console.log("\nPeople living in Cairo:");
        result2.records.forEach(record => {
            console.log(`- ${record.get("name")}, Age: ${record.get("age")}, City: ${record.get("city")}`);
        });

        // Find all people ordered by age
        const result3 = await session.run(`
      MATCH (p:Person)
      RETURN p.name AS name, p.age AS age, p.city AS city
      ORDER BY p.age ASC
    `);
        console.log("\nAll people ordered by age:");
        result3.records.forEach(record => {
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