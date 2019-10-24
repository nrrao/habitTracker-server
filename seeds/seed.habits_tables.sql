BEGIN;

TRUNCATE
  habits,
  habits_users,
  habit_dates
  RESTART IDENTITY CASCADE;

INSERT INTO habits_users (user_name, password)
VALUES
  ('dunder',  '$2a$12$4DYlOqLEa5r4X4UGRAH6yevzKPO.uhLbazMrO1j6gPSApfqebUaLu'),
  ('b.deboop', 'bo-password'),
  ('c.bloggs',  '$2a$12$dsdIZ886.yJjHTVstWTA.uVWulvrTdqER565Re/3OfkhJ4ynHBol2'),
  ('s.smith',  '$2a$12$2rQqoKZpYarSQkB6pdK3wOi0wkNe90do4IhnZkdOYuV5iXX7i6NNu'),
  ('lexlor',  '$2a$12$CJe0O.Vnir27B6k.3ySdtelXQYfIj9Gt6C0inAgm/aXva19cT.3/O'),
  ('wippy', '$2a$12$fCzfLUy9C4XM8oLxcn/u8um/C6JhW4rVQOnfAVfiEuDOL1eVfwTT2');

INSERT INTO habits(habit_title,user_id)
VALUES
('Walk 10K steps' ,1),
('Read Daily' , 1),
('Drink 64Oz water',3),
('Meditate' ,5),
('Exercises' ,2),
('Learn French',4),
('Walk 10K steps' ,6);

INSERT INTO habit_dates(percentage,habit_id,date_added)
VALUES
(100,1,'2019-10-15 21:05:00''),
(75,1, ' 2017-08-15 21:05:15'),
(35,2, '2019-15-28'),
(55,3,'2019-10-22'),
(45,4,' 2019-10-16 21:05:00),
(80,1, ' 2019-10-16 21:05:00'),
(90,1, ' 2019-10-15 21:05:00');

COMMIT;
