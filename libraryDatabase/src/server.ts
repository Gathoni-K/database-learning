import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import bookRoutes from './routes/books.routes';
import memberRoutes from './routes/members.routes';
import loanRoutes from './routes/loans.routes';
import fineRoutes from './routes/fines.routes';
import authRoutes from './auth/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Library Management System API is running' });
});

// Routes go here
app.use('/api/auth', authRoutes);    
app.use('/api/books', bookRoutes);
// "any request that starts with /api/books → hand it to bookRoutes"
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/fines', fineRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});