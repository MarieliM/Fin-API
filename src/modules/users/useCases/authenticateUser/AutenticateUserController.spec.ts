import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import authConfig from "../../../../config/auth";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "superSecret123321";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate an user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "password",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "password",
    });

    expect(response.body.user).toHaveProperty("email", "user@test.com");
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate an unexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "Fake_user",
      password: "password",
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate an user with an incorrect password", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "password",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "wrongPassword",
    });

    expect(response.status).toBe(401);
  });
});