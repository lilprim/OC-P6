const bcrypt = require('bcrypt'); // Hachage du mot de passe
const jwt    = require('jsonwebtoken'); // Création et vérification des tokens d'authentification

const User   = require('../models/user'); // Import du model User


// Inscription de l'utilisateur

exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10) // On sale 10 fois
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save() // Sauvegarde de l'utilisateur dans la BDD
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Identification de l'utilisateur

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Cherche le mail saisi dans la BDD
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // Si la mail est trouvé, comparaison du cryptage du mot de passe saisi avec celui enregistré
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, // Id utilisateur
                            process.env.DB_USER , // Token secret
                            { expiresIn: '24h' } // Durée de validité du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};