const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    homeCity: {
      type: String,
      required: true,
    },
    homeCountry: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
      required: true,
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
      }],
  },
  { timestamps: true }
);

// static sigup method
userSchema.statics.signup = async function (
  firstName,
  lastName,
  homeCity,
  homeCountry,
  email,
  password,
  imageUrl
) {
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !homeCity ||
    !homeCountry
  ) {
    throw Error("All fields are required!");
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("Email already exists!");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    homeCity,
    homeCountry,
    email,
    password: hash,
    imageUrl,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields are required!");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email!");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password!");
  }

  return user;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
