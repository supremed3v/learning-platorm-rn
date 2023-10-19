import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 24,
  },
  description: {
    type: String,
    required: true,
    minLength: 30,
  },
  poster: {
    public_id: {
      required: true,
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
  },
  lectures: [
    {
      title: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
      },
      video: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      description: {
        type: String,
      },
    },
  ],
  view: {
    type: Number,
    default: 0,
  },
  numOfVideos: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const Course = mongoose.model("Course", schema);
