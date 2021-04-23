---
title: MySQL
---

## 创建数据库

> CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name

### 创建表

> CREATE [TEMPORARY] TABLE [IF NOT EXISTS] _tbl_name_
> (_create_definition_,...)
> [*table_options*] > [*partition_options*]

列级约束：针对某一个字段

- 可以在列定义时声明，也可以在列定义之后声明

表级约束：针对两个或两个以上的字段

- 只能在列定义之后声明

按照类型划分：

### 主键约束 PRIMARY KEY

- 每张表只能有一个主键
- 保证记录的唯一性
- 自动为 not null

auto_increment 必须定义为主键，但是主键不一定和 auto_increment 一起使用。

### 唯一约束 UNIQUE KEY

- 保证记录的唯一性
- 字段可以为空值（Null）
- 每张表可以存在多个唯一约束

3. 非空约束 NOT NULL

4. 默认约束 DEFAULT
5. 外建约束 FOREIGN KEY 实现一对一或者一对多
   - 父表（子表的参照列）和子表（具有外建列的表）必须使用相同的存储引擎，禁止使用临时表。
   - 存储引擎必须是 InnoDB
   - 外建列和参照列具有相似的数据类型。（数字的长度或者是否有符号位必须相同，字符串长度可以不同）
   - 外建列和参照列必须创建索引。如果外建列不存在索引，mysql 就会自动创建索引。

查看数据表结构

> show columns from [tbl_name];

增加列

> alter table [tbl_name] add truename varchar(20) not null first;
>
> alter table b add area varchar(20) not null after username;

删除列

> alter table [tbl_name] drop [column_name];
>
> alter table [tbl_name] drop [column_name], drop [column_name];

增加主键约束

> alter table [tbl_name] add primary key(column_name);

删除主键约束

> alter table [tbl_name] drop primary key;

删除唯一约束

> alter table [tbl_name] drop indexes [name];

删除外建约束

> alter table [tbl_name] drop foreign key [name];

修改列定义

> alter table [tbl_name] modify [column_name] [smallint not null] [first];

修改表名

> alter table [tbl_name] rename [tbl_name];
>
> rename table [tbl_name] to [tbl_name];

## 插入记录

### INSERT

可以插入多条记录

```js
INSERT [INTO] tbl_name [(col_name,...)] {VALUES|VALUE} ({expr|DEFAULT},...),(...)...
```

### INSERT-SET

子查询（SubQuery），一次插入一条记录

```js
INSERT [INTO] tbl_name SET col_name={expr|DEFAULT},...
```

### INSERT-SELECT

将查询结果插入到指定数据表

```js
INSERT [INTO] tbl_name [(col_name,...)] SELECT ...
```

## 更新数据表

### 单表更新

```
UPDATE [LOW_PRIORITY] [IGNORE] table_reference
    SET col_name1={expr|DEFAULT}[,col_name2={expr|DEFAULT}]...
    [WHERE where_condition]
```

### 单表删除

```js
DELETE FROM tbl_name [WHERE where_condition]
```

## 查询

### 查询记录

```js
-- CREATE DATABASE IF NOT EXISTS learn;

USE learn;

-- CREATE TABLE users (
--   id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
--   username varchar(20) NOT NULL,
--   password varchar(50) NOT NULL,
--   age TINYINT UNSIGNED NOT NULL DEFAULT 20,
--   sex BOOlEAN
-- );

-- SELECT * FROM users;

-- id 自动编号
-- insert users values(null, 'Jhon', '123456', 25, 1);
-- insert users values(default, 'Shimy', '123456', 28, 0); // 默认值
-- insert users values(default, 'Tom', '1256', 3*7 + 5, 1); // 计算
-- insert users values(default, 'Tim', '12536', default, 1),(null, 'Rose', md5('1234536'), 24, 0);
-- insert users set username='Lili', password=md5('456
-- update users set age = age+5;
-- update users set age = age - id, sex=0;
-- update users set age = age + 10 where id % 2 = 0;
-- delete from users where age=29;

-- SELECT username, password FROM users;
-- select users.username, users.id from users; 多表查询用
-- select users.username as name, users.id as uid from users; 别名
-- select age, username,id from users having age > 25;
-- select * from users order by id desc; 降序
-- select * from users order by id, age desc;
-- select * from users limit 3, 2;

-- insert select example
-- create table if not exists sub_users (
-- 	username  varchar(20),
--     id tinyint unsigned primary key auto_increment
-- );
-- insert sub_users(username) select username from users where age >= 25;
-- select * from sub_users;

select * from users;

```
