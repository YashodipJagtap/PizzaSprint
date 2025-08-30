const router = require('express').Router();
// import controller methods
const {
	addComment,
	removeComment,
	addReply,
	removeReply
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
// need two parameters to delete comments, one for a particular comment Id and one for the Id of the pizza the comment originated from
router
	.route('/:pizzaId/:commentId')
	// use put route for adding replies since we're just updating an existing comment resource
	.put(addReply)
	.delete(removeComment);

// /api/comments/<pizzaId>/<commentId>/<replyId>
// best practice to include the ids of the parent resource in the endpoint
// "Go to this pizza, look for this particular comment, then delete this one reply"
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;