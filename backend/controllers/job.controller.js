import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      salary === "" ||
      !location ||
      !jobType ||
      experienceLevel === undefined ||
      experienceLevel === "" ||
      position === undefined ||
      position === "" ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (Number.isNaN(Number(salary))) {
      return res.status(400).json({
        message: "Salary must be a number",
        success: false,
      });
    }

    if (Number.isNaN(Number(experienceLevel))) {
      return res.status(400).json({
        message: "Experience must be a number",
        success: false,
      });
    }

    if (Number.isNaN(Number(position))) {
      return res.status(400).json({
        message: "Position must be a number",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((item) => item.trim()),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experienceLevel),
      position: Number(position),
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({
        path: "company",
      })
      .populate({
        path: "applications",
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate({
        path: "company",
      })
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      salary === "" ||
      !location ||
      !jobType ||
      experienceLevel === undefined ||
      experienceLevel === "" ||
      position === undefined ||
      position === ""
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (Number.isNaN(Number(salary))) {
      return res.status(400).json({
        message: "Salary must be a number",
        success: false,
      });
    }

    if (Number.isNaN(Number(experienceLevel))) {
      return res.status(400).json({
        message: "Experience must be a number",
        success: false,
      });
    }

    if (Number.isNaN(Number(position))) {
      return res.status(400).json({
        message: "Position must be a number",
        success: false,
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        requirements: Array.isArray(requirements)
          ? requirements
          : requirements.split(",").map((item) => item.trim()),
        salary: Number(salary),
        location,
        jobType,
        experienceLevel: Number(experienceLevel),
        position: Number(position),
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};