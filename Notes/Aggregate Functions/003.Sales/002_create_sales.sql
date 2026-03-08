CREATE TABLE sales(
    id UUID DEFAULT Gen_random_uuid() PRIMARY KEY,
    region VARCHAR(100) NOT NULL,
    amount INT NOT NULL,
    sold_at TIMESTAMP NOT NULL,
    salesperson_id UUID REFERENCES salesperson(id) ON DELETE RESTRICT
);