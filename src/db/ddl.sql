create database log;

use log;

# Log entries
create table entry (
  id      int auto_increment primary key,
  message varchar(32)
);
