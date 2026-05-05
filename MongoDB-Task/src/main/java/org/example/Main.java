package org.example;

import com.mongodb.client.*;
import org.bson.Document;

import java.util.Arrays;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

public class Main {

    public static void main(String[] args) {

        MongoClient client = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase db = client.getDatabase("taskDB");

        MongoCollection<Document> users = db.getCollection("users");
        MongoCollection<Document> courses = db.getCollection("courses");

        // CLEAN
        users.drop();
        courses.drop();

        // INSERT USERS
        users.insertMany(Arrays.asList(
                new Document("_id", 1).append("name", "Ali").append("courseIds", Arrays.asList(101, 102)),
                new Document("_id", 2).append("name", "Sara").append("courseIds", Arrays.asList(101, 102)),
                new Document("_id", 3).append("name", "Omar").append("courseIds", Arrays.asList(102, 101))
        ));

        // INSERT COURSES
        courses.insertMany(Arrays.asList(
                new Document("_id", 101).append("title", "Math"),
                new Document("_id", 102).append("title", "CS"),
                new Document("_id", 103).append("title", "AI")
        ));

        // DELETE
        users.deleteOne(eq("_id", 3));
        courses.deleteOne(eq("_id", 103));

        // ADD SCORE ARRAY
        users.updateMany(new Document(), set("Score", Arrays.asList(1, 2, 3, 4)));
        courses.updateMany(new Document(), set("Score", Arrays.asList(5, 6, 7, 8)));

        // CONDITIONAL UPDATE 

        // users: id = 1 -> add 5 in index 2
        users.updateOne(eq("_id", 1),
                pushEach("Score", Arrays.asList(5), new com.mongodb.client.model.PushOptions().position(2)));

        // users: others -> add 6 in index 3
        users.updateMany(ne("_id", 1),
                pushEach("Score", Arrays.asList(6), new com.mongodb.client.model.PushOptions().position(3)));

        // courses: id = 101 -> add 5
        courses.updateOne(eq("_id", 101),
                pushEach("Score", Arrays.asList(5), new com.mongodb.client.model.PushOptions().position(2)));

        // courses: others -> add 6
        courses.updateMany(ne("_id", 101),
                pushEach("Score", Arrays.asList(6), new com.mongodb.client.model.PushOptions().position(3)));

        //  MULTIPLY * 20

        users.updateMany(new Document(),
                mul("Score.$[]", 20));

        courses.updateMany(new Document(),
                mul("Score.$[]", 20));

        System.out.println("MongoDB Task Completed");
    }
}