const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const userRouter = express.Router();

const USER_DATA = "firstName lastName photoUrl age skills gender about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const userLoggedIn = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: userLoggedIn._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);
    if (!connectionRequest || connectionRequest.length === 0) {
      return res.status(404).send("No connection requests found");
    }

    res.send({
      data: connectionRequest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userLoggedIn = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: userLoggedIn._id, status: "accepted" },
        { toUserId: userLoggedIn._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_DATA)
    
    if (!connectionRequest || connectionRequest.length === 0) {
      return res.status(404).send("No connection requests found");
    }

    const data = connectionRequest.map((request) => {
      if (request.fromUserId._id.toString() === userLoggedIn._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.send({
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err.message);
  }
});

// userRouter.get("/user/feed", userAuth, async (req, res) => {
//     try{
//         const userLoggedIn = req.user;
//         const page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || 10;
//         if (limit > 50) {
//             limit = 50; 
//         }
//         const skip = (page - 1) * limit;
     
//          const connectionRequest = await ConnectionRequest.find({
//             $or: [
//                 { fromUserId: userLoggedIn._id},
//                 { toUserId: userLoggedIn._id},
//             ],
//         }).select("fromUserId toUserId")


//         if (!connectionRequest || connectionRequest.length === 0) {
//             return res.status(404).send("No connection requests found");
//         }

//         const hideUsersfromFeed= new Set();
//         connectionRequest.forEach((request) => {
//             hideUsersfromFeed.add(request.fromUserId.toString())
//             hideUsersfromFeed.add(request.toUserId.toString())
//         })

//         const users = await user.find({
//             $and: [
//               { _id: { $nin: Array.from(hideUsersfromFeed) } },
//               { _id: { $ne: userLoggedIn._id } },
//             ],
//           }).select(USER_DATA).skip(skip).limit(limit)
//         if (!users || users.length === 0) {
//             return res.status(404).send("No users found");
//         }

//           res.send({data:users})

//     }catch(err){
//         console.log(err);
//         res.status(400).send("ERROR: " + err.message);
//     }
// })

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
      const userLoggedIn = req.user;
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      if (limit > 50) limit = 50;

      const skip = (page - 1) * limit;

      const connectionRequest = await ConnectionRequest.find({
          $or: [
              { fromUserId: userLoggedIn._id },
              { toUserId: userLoggedIn._id },
          ],
      }).select("fromUserId toUserId");

      const hideUsersfromFeed = new Set();
      if (connectionRequest && connectionRequest.length > 0) {
          connectionRequest.forEach((request) => {
              hideUsersfromFeed.add(request.fromUserId.toString());
              hideUsersfromFeed.add(request.toUserId.toString());
          });
      }

      const users = await user.find({
          $and: [
              { _id: { $nin: Array.from(hideUsersfromFeed) } },
              { _id: { $ne: userLoggedIn._id } },
          ],
      }).select(USER_DATA).skip(skip).limit(limit);

      if (!users || users.length === 0) {
          return res.status(404).send("No users found");
      }

      const totalUsers = await user.countDocuments({
          $and: [
              { _id: { $nin: Array.from(hideUsersfromFeed) } },
              { _id: { $ne: userLoggedIn._id } },
          ],
      });

      res.send({
          data: users,
          pagination: {
              currentPage: page,
              totalUsers: totalUsers,
              totalPages: Math.ceil(totalUsers / limit),
              hasMore: skip + users.length < totalUsers,
          },
      });

  } catch (err) {
      console.log(err);
      res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = userRouter;
