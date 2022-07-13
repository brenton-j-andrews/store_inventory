// Single product model.

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name : {type: String, required: true, maxLength: 50},
        description : {type: String, required: true, maxLength: 100}
    }
)

// Generate virtual URL property.
CategorySchema
.virtual('url')
.get(function() {
    return "/categories/" + this.name;
});

// Export model.
module.exports = mongoose.model('Category', CategorySchema);