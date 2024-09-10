import mongoose from "mongoose";

const UserFormResponseModel = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
      },
      answer_type: {
        type: String,
        required: true,
      },
    },
  ],
});
UserFormResponseModel.index({ userId: 1, formId: 1 }, { unique: true });
export default mongoose.models.UserFormResponse ||
  mongoose.model("UserFormResponse", UserFormResponseModel);
