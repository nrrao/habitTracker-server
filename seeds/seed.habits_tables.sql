BEGIN;

TRUNCATE
  habits,
  habits_users
  RESTART IDENTITY CASCADE;

INSERT INTO habits_users (user_name, password)
VALUES
  ('dunder',  '$2a$12$4DYlOqLEa5r4X4UGRAH6yevzKPO.uhLbazMrO1j6gPSApfqebUaLu'),
  ('b.deboop', 'bo-password'),
  ('c.bloggs',  '$2a$12$dsdIZ886.yJjHTVstWTA.uVWulvrTdqER565Re/3OfkhJ4ynHBol2'),
  ('s.smith',  '$2a$12$2rQqoKZpYarSQkB6pdK3wOi0wkNe90do4IhnZkdOYuV5iXX7i6NNu'),
  ('lexlor',  '$2a$12$CJe0O.Vnir27B6k.3ySdtelXQYfIj9Gt6C0inAgm/aXva19cT.3/O'),
  ('wippy', '$2a$12$fCzfLUy9C4XM8oLxcn/u8um/C6JhW4rVQOnfAVfiEuDOL1eVfwTT2');

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
