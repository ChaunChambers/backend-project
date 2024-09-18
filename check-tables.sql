\c nc_news_test


-- SELECT COUNT (comments.article_id) AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = '1' GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id;

-- SELECT COUNT (comments.article_id)::int AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, articles.body, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = '1' GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.body, articles.votes,articles.article_img_url, comments.article_id;

SELECT * FROM comments WHERE comment_id='18';
