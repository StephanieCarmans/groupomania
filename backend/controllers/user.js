//mise en place des variables d'environnement
require("dotenv").config();
// Appel du bcrypt (hachage mot de passe)
const bcrypt = require("bcrypt");
//Appel du Token pour identification sécurisée
const jwt = require("jsonwebtoken");
//Mise en place sécurisation email
const validator = require("validator");

const User = require("../models/user");

//inscription
exports.signup = (req, res, next) => {
  // verif du mail et protection du mot de passe
  if (validator.isEmail(req.body.email, { blacklisted_chars: '$="' })) {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash,
      });
      console.log(user);
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  } else {
    res
      .status(400)
      .json({ error: "Le format de l'adresse email est invalide" });
  }
};

//connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //reponse si valide
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


