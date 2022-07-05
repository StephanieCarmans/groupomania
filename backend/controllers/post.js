//Partie gestion des posts
const Post = require('../models/post');
const fs = require('fs');

//création des posts
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  const post = new Post({
    ...postObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`});
  post.save()
    .then(() => res.status(201).json({ message: "Post enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//obtenir un post selon son id
exports.getOnePost = (req, res, next) => {
  Post.findOne({_id: req.params.id})
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

//modifier un post selon son id
exports.modifyPost = (req, res, next) => {
  //retirer image du post si existante dans dossier "/images" et si modification image
  if(req.file) {
    Post.findOne({ _id: req.params.id })
      .then(post => {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if(err) throw err;
        });
      })
      .catch(error => res.status(400).json({ error }));
  }
   // Mise à jour des infos suite à modification (nouvelle image + détails)
  const postObject = req.file ?
    {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Post modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

//suppression d'un post selon son id
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      const filename = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Post supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//obtenir tous les posts
exports.getAllPost = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Partie systeme de like et dislike
//Memo : like = req.body.like ----------// userId = req.body.userId------------// sauceId = req.params.id
//Operateur Mongo : $inc = incrémentation ----------// $push = ajouter au tableau ------------// $pull = retirer du tableau

exports.rankPost = (req, res, next) => {
  Post.findOne({_id : req.params.id})
    .then(post => {

      switch(req.body.like) {
        case 1 : 
          //ajout du nouveau userId dans le tableau usersLiked & +1 like
          if(!post.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            console.log("ajout 1 like d'un nouveau userID dans tableau usersLiked")
             
            Post.updateOne(
              {_id : req.params.id},
              {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
              }
            )
              .then(() => res.status(200).json({message: "post +1 like"}))
              .catch((error) => res.status(400).json({error}));
          }
          break;
        
        case -1 :
          //ajout du nouveau userId dans le tableau usersDisliked & +1 dislike
          if(!post.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            console.log("ajout 1 dislike d'un nouveau userID dans tableau usersDisliked")
              
            Post.updateOne(
              { _id : req.params.id },
              {
                $inc: {dislikes: 1},
                $push: {usersDisliked: req.body.userId}
              }
            )
              .then(() => res.status(200).json({message: "post +1 dislike"}))
              .catch((error) => res.status(400).json({error}));
          }
          break;

          case 0 :
            //retrait d'un userId dans le tableau usersLiked et de son like
            if(post.usersLiked.includes(req.body.userId)) {
              console.log("retrait 1 like d'un userID connu dans tableau usersLiked")
              
              Post.updateOne(
                { _id : req.params.id },
                {
                  $inc: {likes: -1},
                  $pull: {usersLiked: req.body.userId}
                }
              )
                .then(() => res.status(200).json({message: "post -1 like"}))
                .catch((error) => res.status(400).json({error}));
            }

            //retrait d'un userId dans le tableau usersDisliked et de son dislike
            if(post.usersDisliked.includes(req.body.userId)) {
              console.log("retrait 1 dislike d'un userID connu dans tableau usersDisliked")
        
              Post.updateOne(
                {_id : req.params.id},
                {
                  $inc: {dislikes: -1},
                  $pull: {usersDisliked: req.body.userId}
                }
              )
                .then(() => res.status(200).json({message: "post -1 dislike"}))
                .catch((error) => res.status(400).json({error}));
            }     

          } 
        })

      
    .catch((error) => res.status(404).json({error}));
  }