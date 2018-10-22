create database log;

use log;

create table category (
  id    int auto_increment primary key,
  label varchar(32) not null
);

insert into category (label) values ('UNASSIGNED');

# Log entries
create table entry (
  id          int auto_increment primary key,
  message     text not null,
  category_id int not null default 1,
  constraint foreign key (category_id) references category (id)
);
