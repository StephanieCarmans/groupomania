//importation d'express
const express = require("express");
const router = express.Router();

//importation des middleware
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const idTrust = require("../middleware/idTrust");

//importation du controller post
const postCtrl = require("../controllers/post");

//route de l'Api pour les posts et le like
router.get("/", auth, postCtrl.getAllPost);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, idTrust, multer, postCtrl.modifyPost);
router.delete("/:id", auth, idTrust, postCtrl.deletePost);
router.post("/:id/like", auth, postCtrl.rankPost);

//exportation des routes
module.exports = router;
