// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Create a UserSchema with the Schema class
var SavedArticlesSchema = new Schema({
  // title of article
  title: {
    type: String,
    unique: true
  },
  link: {
    type: String,
    unique: true
  },
  // notes property for the user
  notes: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Note model
    ref: "Note"
  }]
});

// Create the Article model with the SavedAritcleSchema
var SavedArticles = mongoose.model("SavedArticles", SavedArticlesSchema);

// Export the user model
module.exports = SavedArticles;
