import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serwuj pliki statyczne z folderu dist
app.use(express.static(path.join(__dirname, 'dist')));

// Połączenie z MongoDB - używamy nazwy serwisu z docker-compose
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/todo_db';
console.log('Attempting to connect to MongoDB:', mongoUri);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    // Nie zatrzymuj aplikacji, spróbuj ponownie później
});

const todoSchema = new mongoose.Schema({
    todo: String,
    isDone: Boolean,
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// API endpoints
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json({
            todos: todos.filter(t => !t.isDone),
            completed: todos.filter(t => t.isDone)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const { todo } = req.body;
        const newTodo = new Todo({ todo, isDone: false });
        await newTodo.save();
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { todo, isDone } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { todo, isDone }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Catchall handler: wysyła plik index.html dla wszystkich innych ścieżek
// To jest potrzebne dla React Router (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));