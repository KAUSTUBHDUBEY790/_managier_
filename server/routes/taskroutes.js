const router = require("express").Router();

const Task = require("../modals/taskmodule");
const Project = require("../modals/projectmodule");
const User = require("../modals/usermodule");
const authMiddleware = require("../middlewares/authmiddleware")
// const cloudinary = require("../config/cloudinaryConfig");

// create a task
router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all tasks
router.post("/get-all-tasks", authMiddleware, async (req, res) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "all") {
        delete req.body[key];
      }
    });
    delete req.body["userId"];
    const tasks = await Task.find(req.body)
    .populate("assignedTo")
    .populate("assignedBy")
    .populate("project")
    .sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update task
router.post("/update-task", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete task
router.post("/delete-task", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// create multer storage
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// router.post("/upload-image", authMiddleware, multer({ storage: storage }).single("file"), async (req, res) => {
//   try {
   
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "tasks",
//     });
//     const imageURL = result.secure_url;

//     await Task.findOneAndUpdate(
//       { _id: req.body.taskId },
//       {
//         $push: {
//           attachments: imageURL,
//         },
//       }
//     );

//     res.send({
//       success: true,
//       message: "Image uploaded successfully",
//       data: imageURL,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

module.exports = router;