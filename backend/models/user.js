//importation de mongoose
const mongoose = require("mongoose");

//importation validateur unique
const uniqueValidator = require("mongoose-unique-validator");

//modèle données connexion
const userSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: { type: String, required: true, maxLength: 1024, minLength: 8 },

    role: { type: String, default: "user"},
  },
  {
    timestamps: true,
  }
);

//mise en place du plugin unique validator
userSchema.plugin(uniqueValidator);

//exportation du module
module.exports = mongoose.model("User", userSchema);
