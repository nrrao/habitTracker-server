TRUNCATE
  habits
  habits_users
  RESTART IDENTITY CASCADE;

INSERT INTO habits_users (user_name, password)
VALUES
  ('dunder',  'password'),
  ('b.deboop', 'bo-password'),
  ('c.bloggs',  'charlie-password'),
  ('s.smith',  'sam-password'),
  ('lexlor',  'lex-password'),
  ('wippy', 'ping-password');

INSERT INTO habits(habit_title,percentage,user_id)
VALUES
('Walk 10K steps' , '75',1),
('Read Daily' , '100',1),
('Drink 64Oz water' , '50',3),
('Meditate' , '0',5),
('Exercises' , '50',2),
('Learn French' , '30',4),
('Walk 10K steps' , '75',6);

COMMIT;
