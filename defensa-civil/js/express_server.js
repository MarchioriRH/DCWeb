import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';


import { createConnection } from 'mysql2';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Clave secreta para firmar los JWT
const JWT_SECRET = 'your_jwt_secret_key';

/** Data base connection */
const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'events'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, password, rol } = req.body;
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await getUser(username);
    if (user.length > 0) {
        return res.status(400).send('El usuario ya existe');
    } else {
        //users.push({ username, password: hashedPassword });
        const query = 'INSERT INTO users (username, password, rol) VALUES (?, ?, ?)';
        connection.query(query, [username, hashedPassword, rol], (err, result) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return result.status(500).send('Error al registrar el usuario');
            }

        });
        //console.log(users);
        res.status(201).send('Usuario registrado');
    }
});

function getUser(username) {
    debugger;
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        connection.query(query, [username], (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password, keepSesion } = req.body;
    //console.log('users: ', users);
    const user = await getUser(username);
    console.log('user: ', user);
    if (user.length === 0) {
        console.log('Usuario no registrado');
        res.status(400).send('Usuario no registrado');
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
        res.status(400).send('Constraseña incorrecta');
        return;
    } else {   
        // Generar el token JWT
        const rol = user[0].rol;
        //console.log('rol: ', rol);
        const expiresPeriod = '1h';
        if (keepSesion) {
            expiresPeriod = '7d'
        }             
        const token = jwt.sign({ username: user[0].username }, JWT_SECRET, { expiresIn: expiresPeriod });
        //console.log('token: ', token);
        res.status(200).json({ token, rol });
        return;       
    }
    
});

// Ruta protegida (requiere autenticación)
app.get('/protected', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Acceso denegado');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Token invalido');
        }

        res.status(201).send('/defensa-civil/eventos/control_panel.html');
    });
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.sendStatus(403); 
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}




/** Events routes */ 
app.get('/events', (req, res) => {
    const { date, date1, date2, street, type, derivation } = req.query;
    let query = 'SELECT * FROM events_form WHERE 1';
    let values = [];
    
    if (date) {
        query += ' AND date = ?';
        values.push(date);
    }

    if (date1 && date2) {
        query += ' AND date BETWEEN ? AND ?';
        values.push(date1);
        values.push(date2);
    }
    
    if (street) {
        query += ' AND street = ? OR street_1 = ? OR street_2 = ?';
        values.push(street, street, street);
    }
    
    if (type) {
        query += ' AND type = ?';
        values.push(type);
    }

    if (derivation) {
        query += ' AND derivation = ?';
        values.push(derivation);
    }

    connection.query(query, values, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

app.post('/events', (req, res) => {
    const { date, time, eventType, street_1, street_1_number, street_2, street_3, derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email } = req.body;
    const query = 'INSERT INTO events_form (date, time, type, street, number, street_1, street_2, derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [date, time, eventType, street_1, street_1_number, street_2, street_3, derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email];
    
    connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return result.status(500).send(err);
                
            }
            console.log('Evento agregado');
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
