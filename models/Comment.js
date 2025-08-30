// import Types object to generate ObjectId() values
const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment's _id field
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String,
      required: true,
      trim: true
    },
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    commentBody: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    // use ReplySchema to validate data for a reply
    // replies will be nested directly in a comment's document and not referred to
    replies: [ReplySchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// virtual to get the total number of replies to a comment
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;