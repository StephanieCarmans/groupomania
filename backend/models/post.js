//importation de mongoose
const mongoose = require("mongoose");

//modèle données post
const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, trim: true, maxLength: 500 },
    imageUrl: { type: String },

    //système like et dislike
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] },
    admin: false,
  },
  {
    timestamps: true,
  }
);

//exportation du module
module.exports = mongoose.model("Post", postSchema);
