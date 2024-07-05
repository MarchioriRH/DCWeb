import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import { createConnection } from 'mysql2';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulación de una base de datos
// const users = [];

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
    const { username, password } = req.body;
    //console.log(req);
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    if (await getUser(username)) {
        return res.status(400).send('User already exists');
    } else {
        //users.push({ username, password: hashedPassword });
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return result.status(500).send
            }

        });
        //console.log(users);
        res.status(201).send('User registered');
    }
});

function getUser(username) {
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
        console.log('User not found');
        res.status(400).send('User not found');
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
        res.status(400).send('Invalid password');
        return;
    } else {   
        // Generar el token JWT
        const rol = user[0].rol;
        const expiresPeriod = '1h';
        if (keepSesion) {
            expiresPeriod = '7d'
        }   
            
        const token = jwt.sign({ username: user[0].username }, JWT_SECRET, { expiresIn: expiresPeriod });
        console.log('token: ', token);
        res.status(200).json({ token, rol });
        return;
       
    }
    
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

app.get('/defensa-civil/assets/sections/forms/event_form.html', (req, res) => {
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
     
        res.sendFile(path.join(__dirname, '/defensa-civil/assets/sections/forms/event_form.html'));
       
    });
});

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
            console.log('Event added');
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
