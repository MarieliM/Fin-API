import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import authConfig from "../../../../config/auth";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get statement operation controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "superSecret123321";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get infos about an existent operation", async () => {
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

    const statement = {
      amount: 100.0,
      description: "Deposit test",
    };

    const createdStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send(statement)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const statement_id = createdStatement.body.id;

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toHaveProperty("description", statement.description);
    expect(response.body).toHaveProperty("amount", statement.amount.toFixed(2));
  });

  it("should not be able to get operation for an unexists user", async () => {
    const token = "fake_token";

    const statement_id = "fake_statement_id";

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });

  it("should not be able to get an unexists operation", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test user2",
      email: "User Supertest2",
      password: "1234",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "User Supertest2",
      password: "1234",
    });

    const { token } = auth.body;

    const statement_id = "superSecret123321";

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });
});