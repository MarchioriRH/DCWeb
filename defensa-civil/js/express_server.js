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

/**
 * Conexión a la base de datos
 * @param {string} host - Host de la base de datos
 * @param {string} user - Usuario de la base de datos
 * @param {string} password - Contraseña de la base de datos
 * @param {string} database - Nombre de la base de datos
 * @returns {object} - Conexión a la base de datos
 * @throws {string} - Mensaje de error al conectar a la base de datos
 */
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

/**
 * Ruta de registro
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @param {string} rol - Rol del usuario
 * @returns {string} - Mensaje de usuario registrado
 * @throws {string} - Mensaje de usuario ya existente
 * 
 */
app.post('/register', async (req, res) => {
    const { username, password, rol } = req.body;
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await getUser(username);
    if (user.length > 0) {
        return res.status(400).send('El usuario ya existe');
    } else {
        const query = 'INSERT INTO users (username, password, rol) VALUES (?, ?, ?)';
        connection.query(query, [username, hashedPassword, rol], (err, result) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return result.status(500).send('Error al registrar el usuario');
            }

        });
        res.status(201).send('Usuario registrado');
    }
});

/**
 * Obtiene un usuario de la base de datos
 * @param {*} username 
 * @returns 
 */
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

/** 
 * Ruta de inicio de sesión
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @param {boolean} keepSesion - Mantener la sesión activa
 * @returns {object} - Token JWT
 * @throws {string} - Mensaje de usuario no registrado o contraseña incorrecta
 * 
 * */
app.post('/login', async (req, res) => {
    const { username, password, keepSesion } = req.body;
    const user = await getUser(username);
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
        const expiresPeriod = '1h';
        if (keepSesion) {
            expiresPeriod = '7d'
        }             
        const token = jwt.sign({ username: user[0].username }, JWT_SECRET, { expiresIn: expiresPeriod });
        res.status(200).json({ token, rol });
        return;       
    }    
});

/**
 * Ruta para verificar el token
 * @param {string} token - Token JWT
 * @returns {string} - Mensaje de token válido o inválido
 * @throws {string} - Mensaje de token inválido
 * 
 */
app.get('/verifyToken', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]; // Extraer el token
    // Lógica para verificar el token...
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Token invalido');
        }
        res.status(200).send('Token valido');
    });
});


// app.get('/verifyToken', async (req, res) => {  
//     const token = req.headers['token']; 
//     console.log('token: ', token);
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).send('Token invalido');
//         }
//         res.status(200).send('Token valido');
//     });
// });

/** 
 * Events routes 
 * @param {string} date - Event date
 * @param {string} date1 - Initial date range
 * @param {string} date2 - Final date range
 * @param {string} street - Street name
 * @param {string} type - Event type
 * @param {string} derivation - Event derivation
 * @returns {object} - Events list
 * @throws {object} - Error message
 * 
 * */ 
app.get('/events', (req, res) => {
    const { id, date, date1, date2, street, type, derivation } = req.query;
    let query = 'SELECT * FROM events_form WHERE 1';
    let values = [];

    if (id) {
        query += ' AND id = ?';
        values.push(id);
    }

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

/**
 * Ruta para agregar un evento
 * @param {string} date - Fecha del evento
 * @param {string} time - Hora del evento
 * @param {string} eventType - Tipo de evento
 * @param {string} street_1 - Calle del evento
 * @param {string} street_1_number - Número de calle
 * @param {string} street_2 - Entre calle
 * @param {string} street_3 - y calle
 * @param {string} derivation - Derivación del evento
 * @param {string} event_description - Descripción del evento
 * @param {string} informer_name - Nombre del informante
 * @param {string} informer_last_name - Apellido del informante
 * @param {string} informer_phone - Teléfono del informante
 * @param {string} informer_email - Email del informante
 * @returns {string} - Mensaje de evento agregado
 * @throws {object} - Error en la consulta
 */
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
