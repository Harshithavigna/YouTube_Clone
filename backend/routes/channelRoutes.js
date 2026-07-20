import express from "express";
import {
  createChannel, getChannel, getMyChannels, updateChannel, deleteChannel,
} from "../controllers/channelController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/mine/list", protect, getMyChannels);
router.get("/:id", getChannel);
router.put("/:id", protect, updateChannel);
router.delete("/:id", protect, deleteChannel);

export default router;