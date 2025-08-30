// create models first, will allow you to interact with database more easily.
// import Schema constructor and model function from mongoose
const { Schema, model } = require('mongoose');
// import getter function to format dates
const dateFormat = require('../utils/dateFormat');

// create schema for the model using the Schema constructor
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      // this will require data to exist for that field
      required: true,
      // this will remove white space before and after the input string
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      // set default value to JavaScript's Date.now function
      // if no value is provided, execute Date.now function
      default: Date.now,
      // use the getter here to format the createdAt field, returns a formatted time stamp
      // every time we retireve a pizza, the value in the createdAt field will be formatted 
      // by the dateFormat function and used instead of the default value
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      // validation option for array of options this field will accept, won't allow a size that is not listed in the array
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    // [] indicates an array as the data type, can also use Array
    toppings: [],
    // this tells Mongoose to expect an ObjectId and that its data comes from the Comment model
    comments: [
      {
        type: Schema.Types.ObjectId,
        // the ref property tells the Pizza model which documents to search to find the right comments
        ref: 'Comment'
      }
    ]
  },
  {
    // this tells the schema to use virtuals and getters
    // virtuals allow us to add more information to a database response
    // getters allow us to take the stored data we are looking to retrieve and modify or format it upon return. 
    toJSON: {
      virtuals: true,
      getters: true
    },
    // this is a virtual that Mongoose returns, set to false since we don’t need it.
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  // use the reduce method to tally up the total of every comment with its replies
  // reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment.
  // As reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, 
  // with the return of the function revising the total for the next iteration through the array.
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;