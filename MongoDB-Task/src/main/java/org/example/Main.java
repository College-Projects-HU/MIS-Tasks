package org.example;

import com.mongodb.client.*;
import org.bson.Document;
import java.util.*;

public class Main {

    public static void main(String[] args) {

        // ================= CONNECT =================
        MongoClient client = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase db = client.getDatabase("taskDB");

        MongoCollection<Document> users = db.getCollection("users");
        MongoCollection<Document> courses = db.getCollection("courses");

        // CLEAN 
        users.drop();
        courses.drop();

        // INSERT USERS (3 docs)
        users.insertMany(Arrays.asList(
                new Document("_id", 1).append("name", "Ali").append("courseIds", Arrays.asList(101, 102)),
                new Document("_id", 2).append("name", "Sara").append("courseIds", Arrays.asList(101, 103)),
                new Document("_id", 3).append("name", "Omar").append("courseIds", Arrays.asList(102, 103))
        ));

        //INSERT COURSES (3 docs)
        courses.insertMany(Arrays.asList(
                new Document("_id", 101).append("title", "Math"),
                new Document("_id", 102).append("title", "CS"),
                new Document("_id", 103).append("title", "AI")
        ));

        //  DELETE (from BOTH collections)
        users.deleteOne(new Document("_id", 3));
        courses.deleteOne(new Document("_id", 103));

        // ADD SCORE
        users.updateMany(new Document(),
                new Document("$set", new Document("Score", new ArrayList<>(Arrays.asList(1, 2, 3, 4)))));

        courses.updateMany(new Document(),
                new Document("$set", new Document("Score", new ArrayList<>(Arrays.asList(5, 6, 7, 8)))));

        //  CONDITION (_id logic)

        // users
        for (Document doc : users.find()) {
            List<Integer> score = (List<Integer>) doc.get("Score");

            if (doc.getInteger("_id") == 1) {
                // insert 5 in 3rd position (index 2)
                score.add(2, 5);
            } else {
                // insert 6 in 4th position (index 3)
                    score.add(3, 6);
            }

            users.updateOne(
                    new Document("_id", doc.get("_id")),
                    new Document("$set", new Document("Score", score))
            );
        }

        // courses
        for (Document doc : courses.find()) {
            List<Integer> score = (List<Integer>) doc.get("Score");

            if (doc.getInteger("_id") == 101) {
                score.add(2, 5);
            } else {
                    score.add(3, 6);
            }

            courses.updateOne(
                    new Document("_id", doc.get("_id")),
                    new Document("$set", new Document("Score", score))
            );
        }

        // MULTIPLY SCORE
        multiply(users);
        multiply(courses);

        System.out.println("MongoDB Task Completed");
    }

    // ================= MULTIPLY FUNCTION =================
    public static void multiply(MongoCollection<Document> collection) {

        for (Document doc : collection.find()) {

            List<Integer> score = (List<Integer>) doc.get("Score");

            for (int i = 0; i < score.size(); i++) {
                score.set(i, score.get(i) * 20);
            }

            collection.updateOne(
                    new Document("_id", doc.get("_id")),
                    new Document("$set", new Document("Score", score))
            );
        }
    }
}