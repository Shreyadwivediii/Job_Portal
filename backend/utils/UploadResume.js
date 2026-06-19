import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

const uploadResume = (file) => {
  return new Promise((resolve, reject) => {
    const safeFileName = file.originalname
      .replace(".pdf", "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "job_portal/resumes",
        resource_type: "raw",
        public_id: `${safeFileName}_${Date.now()}.pdf`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export default uploadResume;