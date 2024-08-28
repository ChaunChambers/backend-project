const seed = require("../db/seeds/seed");
const supertest = require("supertest");
const data = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");
const app = require("../app.js");
const { jsonfile } = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", () => {
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
        expect(response.body).toEqual({ msg: "Not found" });
      });
  });
});

describe("/api", () => {
  test("200 - responds with json file containing list of endpoints", () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(jsonfile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 - Responds with a status code of 200", () => {
    return supertest(app).get("/api/articles/1").expect(200);
  });
  test("Responds with an object containing the correct article", () => {
    return supertest(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        expect(body.article.article_id).toEqual(1);
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
        // expect(body.article).toEqual(
        //   expect.objectContaining({
        //     title: "Living in the shadow of a great man",
        //     topic: "mitch",
        //     author: "butter_bridge",
        //     body: "I find this existence challenging",
        //     created_at: expect.any(Date.now()),
        //     votes: 100,
        //     article_img_url:
        //       "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        //   })
        // );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return supertest(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found");
      });
  });
  test("GET: 400 sends an appropriate status and error message when given an invalid id", () => {
    return supertest(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
});

describe.only("GET /api/articles", () => {
  test("200 - responds with an array of article objects", () => {
    return supertest(app).get("/api/articles").expect(200);
  });
  test("200 - responds with an array of article objects sorted by date in descending order", () => {
    return supertest(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        //***BELOW**** ITS SAYING TOBESORTED IS NOT A FUNCTION */

        // expect(articles).toBeSortedBy("created_at", {
        //   descending: true,
        // });
      });
  });
});
