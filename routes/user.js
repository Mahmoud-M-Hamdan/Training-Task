const express = require("express");
const User = require("../model/user");
const Auth = require("../middleware/auth");
const multer = require("multer");
const router = new express.Router();
const sharp = require('sharp');
const { sendEmails } = require("../emails/emailSender");

// ***********************get all users ********************************
router.get("/users", async (req, res) => {
  const users = await User.find({});

  try {
    // if (!users) {
    //   throw new Error("there is no user");
    // }

    res.status(200).send(users);
  } catch (error) {
    res.status(404).send(error);
  }
});

// get your profile

//   router.get("/users", Auth, async (req, res) => {
//     // const users = await User.find({});

//     try {
//       // if (!users) {
//       //   throw new Error("there is no user");
//       // }

//       res.status(200).send(req.user);
//     } catch (error) {
//       res.status(404).send(error);
//     }
//   });

// ************************************create new user *****************************

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  const token = await user.generateToken();
  sendEmails(user.email,user.name)
  try {
    // await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(401).send(error);
  }
});

// *******************************get your profile ******************************************

router.get("/users/me", Auth, async (req, res) => {
  // const _id = req.params.id;
  // const user = await User.findById(_id);

  try {
    // if (!user) {
    //   throw new Error("there is no user");
    // }

    res.status(200).send(req.user);
  } catch (error) {
    res.status(404).send(error);
  }
});

// *****************************update user*****************************
router.patch("/users/me", Auth, async (req, res) => {
  // const _id = req.params.id;
  const updates = Object.keys(req.body);
  try {
    // const user = await User.findOneAndUpdate({_id:req.user._id}, {
    //   ...req.body,
    // });

    const user = await User.findById(req.user._id);
    console.log("here we are", user);
    updates.forEach((ele) => (user[ele] = req.body[ele]));

    user.save();
    // const userUpdate = await User.findById(req.user._id);

    res.status(401).send(user);
  } catch (error) {
    res.send(error);
  }
});

// ***********************delete user **************************

router.delete("/users/me", Auth, async (req, res) => {
  // const _id = req.params.id;

  try {
    // await User.findByIdAndDelete(_id);
    await req.user.remove();
    res.status(201).send("delete Sucsessful");
  } catch (error) {
    res.status(404).send(error);
  }
});

// ********************************login user *********************
router.post("/users/login", async (req, res) => {
  const user = await User.findByCredentials(req.body.password, req.body.email);
  const token = await user.generateToken();
  try {
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(404).send(error);
  }
});

// **********************logout user *************************
router.post("/users/logout", Auth, async (req, res) => {
  console.log("am in logout");
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send("logout sucsessfull");
  } catch (error) {
    res.status(500).send();
  }
});
// const storage = multer.memoryStorage()

const upload = multer({
  // dest: "avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|png|jpeg)$/)) {
      return cb(new Error("must be image"));
    }

    cb(undefined, true);
  },
  // storage
});

router.post(
  "/users/me/avatar",
  Auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer= await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    // console.log(req.user)
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Done !");
  },
  (error, req, res, next) => {
    res.send(error.message);
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findById(_id);
  res.set("Content-Type", "image/png");
  res.send(user.avatar);
});

router.delete('/users/avatar',Auth, async (req,res)=>{

  req.user.avatar=undefined
  req.user.save()
  res.send('Done!')
})

module.exports = router;
