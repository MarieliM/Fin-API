import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import authConfig from "../../../../config/auth";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get balance controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "superSecret123321";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able get the balance from an user account", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "password",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "password",
    });

    const { token } = auth.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toHaveProperty("balance", 100);
  });

  it("Should not be able get the balance from an unexistent user account", async () => {
    const token = "fake_token";

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });

});