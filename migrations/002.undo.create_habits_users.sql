ALTER TABLE blogful_articles
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS habits_users;