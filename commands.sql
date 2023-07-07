CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) values ('Martin Fowler', 'https://martinfowler.com/articles/intro-pet.html', 'Privacy Enhancing Technologies: An Introduction for Technologists');
INSERT INTO blogs (author, url, title) values ('Troy Hunt', 'https://www.troyhunt.com/data-breach-disclosure-101-how-to-succeed-after-youve-failed/', 'Data breach disclosure 101: How to succeed after you have failed');
select * from blogs;