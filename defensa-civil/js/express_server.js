import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5500;


app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

// Simulación de una base de datos
const users = [];

// Clave secreta para firmar los JWT
const JWT_SECRET = 'your_jwt_secret_key';


// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    //console.log(req);
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    if (users.some(u => u.username === username)) {
        return res.status(400).send('User already exists');
    } else {
        users.push({ username, password: hashedPassword });

        console.log(users);
        res.status(201).send('User registered');
    }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    //console.log('users: ', users);
    const user = users.find(u => u.username === username);

    if (!user) {
        res.status(400).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }

    // Generar el token JWT
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

// Ruta protegida (requiere autenticación)
app.get('/protected', (req, res) => {
    const authHeader = req.headers['authorization'];
    //console.log('authHeader: ', authHeader)
    if (!authHeader) {
        return res.status(401).send('Access denied');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        res.json({ message: 'This is a protected route', user });
    });
});

app.get('/startbootstrap-agency-gh-pages/assets/sections/forms/event_form.html', (req, res) => {
    const authHeader = req.headers['authorization'];
    console.log('authHeader: ', authHeader)
    if (!authHeader) {
        return res.status(401).send('Access denied');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        res.json({ message: 'This is a protected route', user });
        res.sendFile(__dirname + '/startbootstrap-agency-gh-pages/assets/sections/forms/event_form.html');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
