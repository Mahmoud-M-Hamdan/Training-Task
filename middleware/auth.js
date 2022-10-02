const jwt = require("jsonwebtoken");
const User = require("../model/user");

const Auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
console.log('helllooo')
    const decode = await jwt.verify(token, SECRET_KEY);
    console.log(token);
    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": token,
    });
    console.log(user);
    if (!user) {
      throw new Error("not Authorized");
    }
    req.user = user;
    req.token=token
    next();
  } catch (error) {
    res.status(401).send('please baby please login first');
  }
};

module.exports = Auth;
