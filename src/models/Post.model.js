const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [10, "Content must be at least 10 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "Author is required"],
    },
    category: {
      type: String,
      enum: ["technology", "lifestyle", "education", "other"],
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, 
  }
);

postSchema.virtual("readingTime").get(function () {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(" ").length;
  return Math.ceil(wordCount / wordsPerMinute) + " min read";
});

postSchema.pre("save", async function () {
  if (!this.isModified("title")) return;
  this.slug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");
});

postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model("Post", postSchema);