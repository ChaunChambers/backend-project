const seed = require("../db/seeds/seed");
const supertest = require("supertest");
const data = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");
const app = require("../app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("GET /api/topics", () => {
  test.only("200: responds with an array of topic objects", () => {
    return supertest(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("404: responds with not found for wrong endpoint", () => {
    return supertest(app)
      .get("/api/something")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ error: "Not found" });
        expect(response.statusCode).toBe(404);
      });
  });
});

describe("/api", () => {
  test("200 - responds with json file containing list of endpoints", () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect("Content-Type", /json/);
      });
  });
});
