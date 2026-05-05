package org.example;

import com.mongodb.client.*;
import org.bson.Document;

import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

public class Main {

    public static void main(String[] args) {

        MongoClient client = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase db = client.getDatabase("taskDB");

        MongoCollection<Document> teachers = db.getCollection("teachers");
        MongoCollection<Document> courses = db.getCollection("courses");

        // CLEAN
        teachers.drop();
        courses.drop();

        // INSERT
        teachers.insertMany(Arrays.asList(
                new Document("_id", 1).append("name", "Dr Ahmed"),
                new Document("_id", 2).append("name", "Dr Sara"),
                new Document("_id", 3).append("name", "Dr Omar")
        ));

        courses.insertMany(Arrays.asList(
                new Document("_id", 101).append("title", "Math").append("teacherId", 1),
                new Document("_id", 102).append("title", "CS").append("teacherId", 1),
                new Document("_id", 103).append("title", "AI").append("teacherId", 2),
                new Document("_id", 104).append("title", "IS").append("teacherId", 3)

        ));

        // ================= DELETE =================
        teachers.deleteOne(eq("_id", 3));
        courses.deleteOne(eq("_id", 104));

        // ADD SCORE ARRAY
        teachers.updateMany(new Document(), set("Score", Arrays.asList(1, 2, 3, 4)));
        courses.updateMany(new Document(), set("Score", Arrays.asList(10, 20, 30, 40)));

        // CONDITIONAL UPDATE
        // if id == 1 -> put 5 in position 3
        teachers.updateOne(eq("_id", 1),
                pushEach("Score", Arrays.asList(5),
                        new com.mongodb.client.model.PushOptions().position(2)));

        courses.updateOne(eq("_id", 101),
                pushEach("Score", Arrays.asList(5),
                        new com.mongodb.client.model.PushOptions().position(2)));

        // else → put 6 in position 4
        teachers.updateMany(ne("_id", 1),
                pushEach("Score", Arrays.asList(6),
                        new com.mongodb.client.model.PushOptions().position(3)));

        courses.updateMany(ne("_id", 101),
                pushEach("Score", Arrays.asList(6),
                        new com.mongodb.client.model.PushOptions().position(3)));

        // MULTIPLY SCORE BY 20
        teachers.updateMany(new Document(), mul("Score.$[]", 20));
        courses.updateMany(new Document(), mul("Score.$[]", 20));

        System.out.println("MongoDB Task Completed");
    }
}