import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // exclude password by default
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// 🔹 Hash password before saving (async/await)
// Hash password before saving

userSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔹 Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export User model
const User = mongoose.model("User", userSchema);
export default User;