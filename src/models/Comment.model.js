const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [2, "Comment must be at least 2 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified("content")) {
    this.isEdited = true;
  }
  next();
});

commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model("Comment", commentSchema);