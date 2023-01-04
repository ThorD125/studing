create schema exam_movies;

use exam_movies;

create table users
(
	username varchar(30) unique,
	password varchar(255) null,
	constraint users_pk
		primary key (username)
);

create table reviews
(
	id int auto_increment,
	username varchar(30) null,
	movie_id int null,
	review varchar(255) null,
	score int null,
	constraint reviews_pk
		primary key (id)
);
