let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductSchema = new Schema(
    {
        name : {type: String, required: true, maxLength: 50},
        description : {type: String, required: true, maxLength: 100},
        category : {type: Schema.Types.ObjectId, required: true, ref: 'Category'},
        price : {type: Number, required: true },
        inventory : {type: Number, required: true}
    }
)

// Generate virtual URL property.
ProductSchema
.virtual('url')
.get(function() {
    return "/product/" + this._id;
});

// Export model.
module.exports = mongoose.model('Product', ProductSchema);