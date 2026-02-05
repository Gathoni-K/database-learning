# Introduction.

1. Database - organized collection of related data.

2. Data - known facts that can be recorded and of interest to user.

3.Database Management System - software package facilitating creation and maintenance of a computerized database.

4. Database system - DBMS software + data.

5. Relational database - represents data as  2-dimensional tables called relation.

6.RDBMS - software for managing relational databases and lets users / applications interact with them.

7.Relation - basic element defined as a 2-dimensional table and organizes data into rows and columns, each column an attribute, each row a record / tuple.

8. SQL - a query language used to create tables, insert data, query data, updata / delete data.

9.PostgreSQL - RDBMS implementing SQL that stores data, enforces rules and understands SQL and executes it.

## RDBMS.

-A relational database is a database showing data in 2-d tables known as relations.

-A software application for managing relational databases.

## SQL.

Standard Query Language - the programming language used to communicate with a relational database.

-Has 3 sub-languages:

1.DDL: Data Definition Language - define structure of a database and the tables and columns within it.

2.DML: Data Manipulation Language - retrieves/modify data stored in a database.

3.DCL: Data Control Language - determines what various users are allowed to do when interacting with a database.


## Creating my first Database.

    CREATE USER userName WITH PASSWORD 'passwordHere';
    //creates user.
    //output: 'CREATE ROLE' means it is successful.

    ALTER USER userName CREATEDB;
    //
    //output: 'ALTER ROLE' if successful

    CREATE DATABASE database_name OWNER userName;
    //creates a database and declares the owner.
    //output: 'CREATE DATABASE' if successful

    GRANT ALL PRIVILEGES ON DATABASE database_name TO userName;
    //output: 'GRANT' if successful

    \l - lists all databases

    \q - to exit

    psql -U userName -d database_name
    //reconnects to database

-The first 2 commands are only run the first time to create the user account, done to set up PostgreSQL locally.

-Everytime we want to create a new database, run the third command.






