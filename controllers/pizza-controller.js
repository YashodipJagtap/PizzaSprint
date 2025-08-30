// controller file to handle the Pizza model updates
// import Pizza model
const { Pizza } = require('../models');

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
			// populate comments field to display comment information (id, writtenBy, commentBody, createdAt)
			// select '-__v' to remove __v field from comments and again for pizzas
			.populate({
				path: 'comments',
				select: '-__v'
			})
			.select('-__v')
			// use this to sort in DESC order by the _id value, gets the newest pizza
			.sort({ _id: -1 })
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
	// destructured params since it's the only data we need for this request to be fulfilled
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
			.populate({
				path: 'comments',
				select: '-__v'
			})
			.select('-__v')
      .then(dbPizzaData => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

	// createPizza
	// destructure body from req object
	// Mongoose executes validators automatically when new data is created
	createPizza({ body }, res) {
		Pizza.create(body)
			.then(dbPizzaData => res.json(dbPizzaData))
			.catch(err => res.status(400).json(err));
	},

	// update pizza by id
	updatePizza({ params, body }, res) {
		// setting { new: true } instructs Mongoose to return the new version of the document
		// setting {runValidators: true } instructs Mongoose to run validators when updating data
		Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
			.then(dbPizzaData => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch(err => res.status(400).json(err));
	},

	// delete pizza
	deletePizza({ params }, res) {
		Pizza.findOneAndDelete({ _id: params.id })
			.then(dbPizzaData => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch(err => res.status(400).json(err));
	}
}

module.exports = pizzaController;