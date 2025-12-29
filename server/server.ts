import express from 'express';
import serverRoutes from "./routes/serverRoutes";
import cors from 'cors';
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors(
    {
        origin: [
            "http://localhost:5173",
            process.env.FRONTEND_URL || "*" // Replace '*' with your Vercel URL later
        ],
        allowedHeaders: ["Content-Type", "Authorization", "token"]
    }
));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', serverRoutes);

app.listen(PORT, () => console.log('Example app listening on port 5000!'));