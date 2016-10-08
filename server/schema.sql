DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

CREATE TABLE users (
  id int primary key auto_increment,
  username varchar(255),
  text_color varchar(255)
);

CREATE TABLE rooms (
  id int primary key auto_increment,
  roomname varchar(255)
);

CREATE TABLE messages (
  id int primary key auto_increment,
  room_id int,
  foreign key (room_id) references rooms(id),
  user_id int,
  foreign key (user_id) references users(id),
  text varchar(500)
);


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

