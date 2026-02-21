# Building a Library System.

-A simple library API with the following entities:

1.Books - core entity, has a title, author, genre

2.Members - people registered at the library

3.Loans - relationship between books and members,tracks who borrowed what, when.

Operations covered:

1. CRUD - adding books, registering members, issuing a loan, returning a book, deleting a record.

2.For joins, fetch loans with both the book and book details and member details attached.

## Writing SQL code

1.CREATE TABLE.

    CREATE TABLE table_name(
        first_column dataType,
        second_column dataType
    );


2.DROP TABLE

    DROP TABLE table_name;
    

## DEFINING CONSTRAINTS

-Helps us the kind of data acceptable in our tables.

-The constraint definition comes after the data type.

**TABLE VS COLUMN CONSTRAINTS.**

-Table constraints apply to the entire table while the latter applies only to the specific column it has been specified in.

Column constraints are written directly after the column definition attached to it:

    book_id UUID NOT NULL REFERENCES books(id)

Table constraints are written separately at the bottom of the table definition after all columns.

    CREATE TABLE loans(
        id UUID PRIMARY KEY,
        member_id UUID NOT NULL,
        book_id UUID NOT NULL,
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (book_id) REFERENCES books(id)
    );

-Note that the 5th line of the above code does the exact same thing as the column constraint defined above.

-Column constraints are cleaner and more readable hence are preferred.

-When are table constraints preferred:

1.When constraints involves multiple columns, as shown in the example above.

2.When a table has too many columns, it is often preferred to put all constraints at the bottom so the column definitions remain clean.


1.CHECK.

- Allows us to specify that the value in a certain column must satisfy a Boolean (truth-value) expression.

-An example is when only positive product prices are required.

    CREATE TABLE products(
        product_no integer,
        name text,
        price numeric CHECK (price > 0)
    );

-The constraint can be given a separate name for easier clarification of error messages.

    price numeric CONSTRAINT positive_price CHECK (price > 0)

-General pattern would be:

    column_name dataType CONSTRAINT constraint_name CHECK (condition)

-A check constraint is satisfied if the check expression evaluates to true or the null value.

-Cannot be used to verify data from another table

    CHECK(member_id EXISTS in members)
    //this is wrong as PostgreSQL does not allow that

-The correct code for that would be

    member_id UUID REFERENCES members(id)
    //foreign keys are used to enforce validity.

-Avoid using functions in check constraints, keep it simple, else the consequences are a bit complex, refer to official PostgreSQL docs.


2.NOT NULL.

-Specifies that a column must not assume a null value.

    CREATE TABLE book(
        book_no integr NOT NULL,
        name text NOT NULL,
        author text NOT NULL
    );

-Just as in the check constraint an explicit constraint name can also be specified here:

    name text CONSTRAINT book_name_not_null NOT NULL,

-In most database designs the majority of the columns should be markes as NOT NULL.

-A column can have more than one constraint, just write out one after the other.


3.UNIQUE.

-Ensures that the data in a column or a group of columns is unique among all the rows in the table.

-Use whenever business rules dictate that a combination of values should not repeat.


4.PRIMARY KEY.

-Indicates tha a column or a group can be used as the unique identifier of the table.

    CREATE TABLE members(
        id UUID PRIMARY KEY,
        ....
    );

    CREATE TABLE table_name(
        a integer,
        b text,
        c integer,
        PRIMARY KEY(a, c)
    );

-A table can have at most one primary key.


5.FOREIGN KEY.

-Specifies a value in a column that must match the values appearing in some row of another tables.

-Used to enforce validity and express the relationship between entities.

    CREATE TABLE table_name(
        a integer PRIMARY KEY,
        b integer,
        c integer,
        FOREIGN KEY(b, c) REFERENCES other_table(c1, c2)
    );

-The number and type of constrained columns need to match the number and type of the referenced columns.

-A table can have more than one foreign key constraint, this is used to implement many-many relationships.

-Behaviours associated with foreign keys:

-Tells PostgreSQL what to do once a column is deleted.

1.CASCADE.

-Delete all children as well.

-Used when the child data is meaningless without the parent data, e.g. deleting all data related to a book if the book is deleted.

    member_id UUID REFERENCES members(id) ON DELETE RESTRICT

2.RESTRICT.

-Do not allow delete if the children still exist, e.g. one cannot delete a member with loans.

-The default behavious is similar to RESTRICT, rejects the delete if related rows exist.



