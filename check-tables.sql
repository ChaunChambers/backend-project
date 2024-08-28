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

SELECT COUNT (comments.article_id) AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id 
GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id 
ORDER BY created_at DESC;