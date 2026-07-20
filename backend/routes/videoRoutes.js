import express from "express";
import {
  getVideos, getVideoById, createVideo, updateVideo, deleteVideo,
  likeVideo, dislikeVideo, addComment, updateComment, deleteComment,
} from "../controllers/videoController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

router.patch("/:id/like", protect, likeVideo);
router.patch("/:id/dislike", protect, dislikeVideo);

router.post("/:id/comments", protect, addComment);
router.put("/:videoId/comments/:commentId", protect, updateComment);
router.delete("/:videoId/comments/:commentId", protect, deleteComment);

export default router;