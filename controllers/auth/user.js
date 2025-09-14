const mongoose = require("mongoose");
const User = require("../../Models/user");
//const { Validator } = require("node-input-validator");
//const responceCode = require("../../ResponseCode/responce")
const passwordHash = require("password-hash");
//const { DBerror, InputError } = require("../../service/errorHandeler");
var jwt = require("jsonwebtoken");
//const path = require("path");


function createToken(data) {
  return jwt.sign(data, "DonateSmile");
}

const getTokenData = async (token) => {
  let adminData = await User.findOne({ token: token }).exec();
  return adminData;
};

const register = async (req, res) => {
  try {
    // Check if user already exists
    const check = await User.findOne({
      isDeleted: false,
      email: req.body.email, // Matching schema
    });

    if (check) {
      return res.status(400).json({
        status: false,
        message: "User already exists!",
      });
    }

    // Prepare user data
    const userData = {
      ...req.body,
      password: passwordHash.generate(req.body.password),
      token: createToken(req.body),
    };

    // Insert user into database
    const userInsert = new User(userData);
    const data = await userInsert.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid  Email",
      });
    }

    // Check password
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid password!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "LogggedIn successfully",
      data: user, // Sending user token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Server error, please try again",
      error: error.message,
    });
  }
};

const myProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password"); // exclude password if stored

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data:user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};


const editMyProfile = async (req, res) => {
  try {
    const updatedProfile = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({
        status: true,
        message: "my profile edited",
        data: updatedProfile,
      });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

// const getProfileById = async (req, res) => {
//   try {
//     const targetUserId = req.params.id;
//     const loggedInUserId = req.user._id;

//     // Fetch user profile
//     const userProfile = await User.findById(targetUserId).select("-password");
//     if (!userProfile) {
//       return res.status(404).json({
//         status: false,
//         message: "User not found with this id",
//       });
//     }

//     // Fetch followers of target user
//     const followers = await Followers.find({ followedUserId: targetUserId });
//     const filteredFollowers = followers.map((f) => ({
//       userId: f.userId,
//       userName: f.userName,
//       userImage: f.userImage,
//     }));

//     // Fetch following of target user
//     const following = await Followers.find({ userId: targetUserId });
//     const filteredFollowing = following.map((f) => ({
//       userId: f.followedUserId,
//       userName: f.followedUserName,
//       userImage: f.followedUserImage,
//     }));

//     // Check if logged-in user already follows target user
//     const existingFollow = await Followers.findOne({
//       userId: loggedInUserId,
//       followedUserId: targetUserId,
//     });

//     const isFollowed = !!existingFollow; // true if exists, false otherwise

//     return res.status(200).json({
//       status: true,
//       message: "Profile fetched successfully",
//       data: {
//         user: userProfile,
//         followers: filteredFollowers,
//         followersCount:filteredFollowers.length,
//         following: filteredFollowing,
//         followingCount:filteredFollowing.length,
//         isFollowed, // true or false
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching profile by ID:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const allUserProfile = async (req, res) => {
  try {
    const userProfile = await User.find();
    res
      .status(200)
      .json({
        status: true,
        message: "all user profile",
        data: userProfile,
      });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "server error",
      error: error.message,
    });
  }
};


module.exports = {
  allUserProfile,
  getTokenData,
  register,
  login,
  myProfile,
  editMyProfile,

};
