const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    owner: {
      name: String,
      age: Number,
    },
  },
  {
    methods: {
      printOwner() {
        const id = this._id.toString()
        mongoose
          .model('Product')
          .find({})
          .then(([product]) => console.log(product.owner.name))
      },
    },
    statics: {
      printTitle(id) {
        mongoose
          .model('Product')
          .find({ _id: id })
          .then(([product]) => console.log(product.title))
      },
    },
  },
)

module.exports = mongoose.model('Product', productShema)
