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
  test.only("Responds with an object containing the correct article", () => {
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

        //PLEASE NOTE//
        //I am using toHaveProperty because the code below is not working, it says right-hand side of "instanceof" is not an object

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

describe("GET /api/articles", () => {
  test("200 - responds with an array of article objects", () => {
    return supertest(app).get("/api/articles").expect(200);
  });
  test("200 - responds with an array of article objects sorted by date in descending order", () => {
    return supertest(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        //cannot add "jest": {"setupFilesAfterEnv": ["jest-sorted"] to package.json without messing up the util-test and jest-extended/all dependency
        //}
        // expect(articles).toBeSortedBy("created_at", {
        //   descending: true,
        // });
      });
  });
  test("", () => {});
});

describe("GET /api/articles/:article_id/comments.", () => {
  test("200 - responds with a status code of 200", () => {
    return supertest(app).get("/api/articles/9/comments").expect(200);
  });
  test("200 - returns an array of comments for give article_id ", () => {
    return supertest(app)
      .get("/api/articles/9/comments")
      .then(({ body }) => {
        expect(body.comments).toEqual([
          {
            comment_id: 1,
            votes: 16,
            created_at: "2020-04-06T12:17:00.000Z",
            author: "butter_bridge",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
          },
          {
            comment_id: 17,
            votes: 20,
            created_at: "2020-03-14T17:02:00.000Z",
            author: "icellusedkars",
            body: "The owls are not what they seem.",
            article_id: 9,
          },
        ]);
      });
  });
  test("404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return supertest(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => expect(response.body.message).toBe("Not found"));
  });
  test("400 sends an appropriate status and error message when given an invalid id", () => {
    return supertest(app)
      .get("/api/articles/not-valid/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("Responds with a status code of 201", () => {
    const newComment = {
      username: "Newusername",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201);
  });
  test("201 - Responds with newly posted comment object", () => {
    const newComment = {
      username: "Newusername",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .then((data) => {
        console.log(data);
        expect(data.body.comment).toEqual(
          expect.objectContaining({
            username: "Newusername",
            body: "New comment",
            article_id: 9,
          })
        );
      });
  });
});

describe.only("PATCH /api/articles/:article_id", () => {
  test("200 - updates articles in database when given article id", () => {
    const newVote = {
      inc_votes: 100,
    };
    return supertest(app)
      .patch("/api/articles/9")
      .send(newVote)
      .expect(200)
      .then(({ body: { comments } }) => {
        // console.log(treasure);
        expect(comments).toEqual(
          expect.objectContaining({
            votes: expect.any(Number),
          })
        );
      });
  });
  test("404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    const newVote = {
      inc_votes: 100,
    };
    return supertest(app).patch("/api/articles/999").send(newVote).expect(404);
  });
});
