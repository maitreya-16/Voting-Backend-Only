import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import connectDB from './db.js';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
