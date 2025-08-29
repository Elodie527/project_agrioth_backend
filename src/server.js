require('dotenv').config({ path: __dirname + '/.env' });

console.log("[DEBUG] MONGODB_URI:", process.env.MONGODB_URI);
console.log("[DEBUG] JWT_SECRET:", process.env.JWT_SECRET);

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;

// Vérification et valeurs par défaut
if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI non définie, utilisation de la valeur par défaut");
    process.env.MONGODB_URI = 'mongodb://localhost:27017/agrioth';
}

if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET non défini, utilisation d'une valeur temporaire");
    process.env.JWT_SECRET = 'secret_temporaire_' + Date.now();
}

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Middleware de débogage des routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


app.post('/api/test', (req, res) => {
  console.log('Test route appelée');
  res.json({ message: 'Test OK' });
});


// Routes
const routes = require('./routes');
app.use('/api', routes);

// Gestion des erreurs 404
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route non trouvée' });
// });

app.get("/", (request, response) => {
  response.statusCode = 200
  response.send({ message: "Mon premier JSON!" })
})

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur en écoute sur http://localhost:${PORT}`);
});