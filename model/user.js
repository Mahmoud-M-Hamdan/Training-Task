const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.includes("@")) {
          throw new Error("should contain @");
        }
      },
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("make it much than 6 character");
        }
      },
    },

    age: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  console.log("am saving");
  next();
});
userSchema.methods.generateToken = async function () {
  const user = this;
  console.log(user);
  const token = await jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.statics.findByCredentials = async (password, email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("there is no user with this email");
  }

  console.log(user.password);
  console.log(password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  console.log(user.password);
  console.log(password);
  if (!isMatch) {
    throw new Error("the email or password is wrong");
  }

  return user;
};
userSchema.pre("remove", async function (next) {
  const user = this;

  await deleteMany({ owner: user._id });
  next();
});

userSchema.virtual("tasks", {
  ref: "task",
  localField: "_id",
  foreignField: "owner",
});

const User = mongoose.model("user", userSchema);

module.exports = User;
