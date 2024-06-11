import express from '../node_modules/express';
import bcrypt from '../node_modules/bcryptjs';
import jwt from '../node_modules/jsonwebtoken';
import bodyParser from '../node_modules/body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Simulación de una base de datos
const users = [];

// Clave secreta para firmar los JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });

    res.status(201).send('User registered');
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(400).send('User not found');
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
