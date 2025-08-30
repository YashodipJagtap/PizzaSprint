const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
			.then(({ _id }) => {
				return Pizza.findOneAndUpdate(
					{ _id: params.pizzaId },
					// $push adds data to an array
					// using the $push method to add the comment's _id to the specific pizza we want to update
					{ $push: { comments: _id } },
					{ new: true, runValidators: true }
				);
			})
			.then(dbPizzaData => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch(err => res.json(err));
  },

	// add reply to comment
	addReply({ params, body }, res) {
		// instead of creating a reply document, we're updating an existing comment
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  // remove comment
  removeComment({ params }, res) {
		// delete the comment, then use its _id to remove it from the pizza
		Comment.findOneAndDelete({ _id: params.commentId })
			.then(deletedComment => {
				if (!deletedComment) {
					return res.status(404).json({ message: 'No comment with this id!' });
				}
				// take the comment data and use it to identify and remove it from the associated pizza using $pull method
				return Pizza.findOneAndUpdate(
					{ _id: params.pizzaId },
					{ $pull: { comments: params.commentId } },
					{ new: true }
				);
			})
			.then(dbPizzaData => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch(err => res.json(err));
	},

	// remove reply
	removeReply({ params }, res) {
		// update a comment to remove a specific reply from its array
		Comment.findOneAndUpdate(
			{ _id: params.commentId },
			// use the $pull operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.
			{ $pull: { replies: { replyId: params.replyId } } },
			{ new: true }
		)
			.then(dbPizzaData => res.json(dbPizzaData))
			.catch(err => res.json(err));
	}
};

module.exports = commentController;