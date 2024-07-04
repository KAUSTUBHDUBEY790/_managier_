const router  = require("express").Router();
const Project = require("../modals/projectmodule")
const authmiddleware = require("../middlewares/authmiddleware")
const user = require("../modals/usermodule")


// const User = require("../modals/usermodule");

// create a project
router.post("/create-project", authmiddleware, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.send({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all projects
router.post("/get-all-projects", authmiddleware, async (req, res) => {
  try {
    const filters = req.body.filters;
    const projects = await Project.find(filters || {}).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get project by id
router.post("/get-project-by-id", authmiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.body._id)
      .populate("owner", "firstName lastName email")
      .populate("members.user", "firstName lastName email");
    if (!project) {
      throw new Error('Project not found');
    }
    res.status(200).send({
      success: true,
      data: project,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      error: error.message,
      success: false,
    });
  }
});



// edit a project
router.post("/edit-project", authmiddleware, async (req, res) => {
    try {
      await Project.findByIdAndUpdate(req.body._id, req.body);
      res.send({
        success: true,
        message: "Project updated successfully",
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  });
  // delete a project
router.post("/delete-project", authmiddleware, async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.body._id)
      res.send({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  });

// get projects by role
router.post("/get-projects-by-role", authmiddleware, async (req, res) => {
    try {
      const userId = req.body.userId;
      const projects = await Project.find({ "members.user": userId })
        .sort({
          createdAt: -1,
        })
      res.send({
        success: true,
        data: projects,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  });

//project add members
router.post("/add-members", authmiddleware, async (req, res) => {
  try {
    const { projectId,email,role } = req.body;
    const User = await user.findOne({ email });
    if (!User) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        members: {
          user: User._id,
          role,
        },
      },
    });

    res.send({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//remove members from project
router.post("/remove-member",authmiddleware,async (req,res)=>{
  try {
    const {projectId,member_id} = req.body;
    const project = await Project.findById(projectId);
    project.members.pull(member_id);
    await project.save();
    res.send({
      success:true,
      message:"member is removed",
    })

    
  } catch (error) {
    res.send({
      success:false,
      message:error.message,
    })
  }
})


module.exports = router;
