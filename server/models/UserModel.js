import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    auth0Id: { 
      type: String,
      required: true,
      unique: true,
    },

    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      default: "jobseeker",
    },

    resume: {
      type: String,
    },

    profilePicture: {
      type: String,
    },

    bio: {
      type: String,
      default: "No bio provided",
    },

    profession: {
      type: String,
      default: "Unemployed",
    },

    
    skills: {
      type: [String],
      default: [],
    },

    education: [
      {
        university: { type: String, required: true },
        degree: { type: String }, 
        fieldOfStudy: { type: String }, 
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],

    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrentJob: { type: Boolean, default: false },
        description: { type: String },
      },
    ],

    resume: {
      type: String, 
    },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
