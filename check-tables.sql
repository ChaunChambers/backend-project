\c nc_news_test


-- SELECT articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id 
-- ORDER BY created_at DESC;

-- SELECT * FROM articles
-- ORDER BY created_at DESC;

-- SELECT COUNT (comments.body) articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,articles.article_img_url, comments.article_id, comments.body FROM articles 
-- JOIN comments ON articles.article_id = comments.article_id
-- ORDER BY articles.created_at DESC;

-- SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url
-- FROM articles 
-- ORDER BY articles.created_at DESC;

-- SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id
-- FROM articles 
-- JOIN comments ON articles.article_id = comments.article_id  
-- ORDER BY articles.created_at DESC;

-- SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles
-- JOIN comments ON articles.article_id = comments.article_id

-- SELECT articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id 
--   ORDER BY created_at DESC;

-- SELECT COUNT (comments.article_id) AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id 
-- GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id 
-- ORDER BY created_at DESC;

-- SELECT comments.comment_id, 
-- comments.votes, comments.created_at, comments.author, comments.body, articles.article_id FROM comments JOIN articles ON articles.article_id = comments.article_id 
-- WHERE articles.article_id=1
-- ORDER BY created_at DESC;
-- INSERT INTO comments 
--         (author, body,article_id)
-- VALUES 
--     ('new user','new comment',9)  RETURNING *;
-- -- SET foreign_key_checks = 1;

SELECT COUNT (comments.article_id) AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id
WHERE topic = 'mitch'
ORDER BY created_at DESC