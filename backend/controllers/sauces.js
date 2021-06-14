const Sauce = require('../models/sauces'); //Importe le modèle sauce

//Enregistrement d'une nouvelle sauce 
exports.createSauce = (req, res, next) => {
    console.log("kdlfgdf");
    const sauceObject = JSON.parse(req.body.sauce); //Transforme le JSON en objet JS
    const sauce = new Sauce({ //Nouvel objet sauce
        ...sauceObject, // Copie les éléments de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //Enregistre l'objet sauce dans la base de données
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};