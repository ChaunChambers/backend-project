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
      .then(({ body: { article } }) => {
        expect(article.article_id).toEqual(1);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            comment_count: expect.any(Number),
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
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
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
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
      username: "butter_bridge",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201);
  });
  test("201 - Responds with newly posted comment object", () => {
    const newComment = {
      username: "butter_bridge",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .then((data) => {
        expect(data.body.comment).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            body: "New comment",
            article_id: 9,
          })
        );
      });
  });
  test("201 - posts comment if extra properties sent with post", () => {
    const newComment = {
      username: "butter_bridge",
      content_body: "New comment",
      votes: 20,
    };
    return supertest(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((data) => {
        expect(data.body.comment).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            body: "New comment",
            article_id: 3,
          })
        );
      });
  });
  test("404 sends an appropriate status and error message when attempting to post with a valid but non-existent article id", () => {
    const newComment = {
      username: "butter_bridge",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => expect(response.body.message).toBe("Not found"));
  });
  test("400 sends an appropriate status and error message when attempting to post with an invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/invalid/comments")
      .send(newComment)
      .expect(400)
      .then((response) => expect(response.body.message).toBe("Bad request"));
  });
  test("404 Error when attempting to post with an invalid username", () => {
    const newComment = {
      username: "fake_username",
      content_body: "New comment",
    };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then((response) => expect(response.body.message).toBe("Not found"));
  });
  test("400 - if username or body is missing", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then((response) => expect(response.body.message).toBe("Not found"));
  });
});

describe("PATCH /api/articles/:article_id", () => {
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
    return supertest(app)
      .patch("/api/articles/999")
      .send(newVote)
      .expect(404)
      .then((response) => expect(response.body.message).toBe("Not found"));
  });
  test("400 sends an appropriate status and error message when given an invalid id", () => {
    const newVote = {
      inc_votes: 100,
    };
    return supertest(app)
      .patch("/api/articles/not-valid")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Responds with status 204 no content", () => {
    return supertest(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.res.statusMessage).toBe("No Content");
      });
  });
  test("400: Attempt to delete comment by comment_id that is the wrong type", () => {
    return supertest(app)
      .delete("/api/comments/wrong")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
  test("404: Attempt to delete comment by comment_id that is valid but doesn't exist", () => {
    return supertest(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200 responds with an array of objects with the correct properties", () => {
    return supertest(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        // expect(body.user).toHaveProperty("username");
        // expect(body.user).toHaveProperty("name");
        // expect(body.user).toHaveProperty("avatar_url")
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200 - responds with all articles sorted by any column in order given", () => {
    return supertest(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200 - responds with all articles sorted by created_at (default) given the order only", () => {
    return supertest(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("200 - responds will all articles sorted by given column in ascending order (default)", () => {
    return supertest(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("topic", { ascending: true });
      });
  });
  test("404 - responds with appropriate status and message given an valid sort_by query that doesn't exist", () => {
    return supertest(app)
      .get("/api/articles?sort_by=apple")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found");
      });
  });
  test("404 - responds with appropriate status code and message given valid order query that doesn't exist", () => {
    return supertest(app)
      .get("/api/articles?order=up")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200 - responds with only the articles that match the topic query", () => {
    return supertest(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
  test("200 - if topic query is omitted should respond with all articles", () => {
    return supertest(app)
      .get("/api/articles?topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              comment_count: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
  test("404 - reponds with appropriate code if non-existent topic given", () => {
    return supertest(app).get("/api/articles?topic=apple").expect(404);
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200 - Responds with article and comment_count given an article_id", () => {
    return supertest(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            comment_count: expect.any(Number),
          })
        );
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

describe("GET /api/users/:username", () => {
  test("200 - responds with 200 and returns a user by username", () => {
    return supertest(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body: { user } }) => {
        console.log(user);
        expect(user.username).toEqual("icellusedkars");
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });
  test("400 - responds with appropriate code and message when a username doesn't exist", () => {
    return supertest(app).get("/api/users/appletree").expect(404);
  });
});
