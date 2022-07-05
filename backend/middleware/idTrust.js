//variable environnement
require("dotenv").config();

//appel methode token
const jwt = require("jsonwebtoken");

const Post = require("../models/post");
const User = require("../models/user");

module.exports = (req, res, next) => {
  // Récupération du token d'authentification
  const token = req.headers.authorization.split(" ")[1];
  // Décodage du token
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  // Récupération du userId encodé dans le token
  const userId = decodedToken.userId;
  User.findOne({ _id: userId }).then((user) => {
    let hasRight = false;
    let isOwner = false;

    // Comparaison du userId du post et celui du token & autorisation de l'admin
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        //mise en place condition admin
        if (user.role == "admin") { 
          hasRight = true;
        }
        // mise en place condition proprietaire du post
        if (post.userId && post.userId === userId) {
          isOwner = true;
        }
        // interdiction a user different du proprietaire du post et qui n'est pas admin
        if (hasRight === false && isOwner === false) {
          //console.log(user.id, "user db");
          //console.log(post.userId, "user post");
          //console.log(userId, "user token");
          res.status(403).json({ message: "Requête non autorisée" });
        } else {
            next();
        }
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
};
