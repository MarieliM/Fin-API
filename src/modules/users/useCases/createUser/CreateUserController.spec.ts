import request  from "supertest"
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "password",
    });
    
    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new user with an email already exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "password",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "User Test 2",
      email: "user@test.com",
      password: "password",
    });

    expect(response.status).toBe(400);
  });
})