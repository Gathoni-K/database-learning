CREATE TABLE products(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    price INT NOT NULL
);
