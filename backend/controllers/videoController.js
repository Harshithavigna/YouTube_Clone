import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// GET /api/videos?search=&category=
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .populate("channelId", "channelName")
      .select("-comments");

    return res.status(200).json({ videos });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching videos", error: error.message });
  }
};

// GET /api/videos/:id
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("channelId", "channelName subscribers owner")
      .populate("comments.userId", "username avatar");

    if (!video) return res.status(404).json({ message: "Video not found" });

    return res.status(200).json({ video });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching video", error: error.message });
  }
};

// POST /api/videos (protected)
export const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, category, channelId } = req.body;

    if (!title || !thumbnailUrl || !videoUrl || !channelId) {
      return res.status(400).json({ message: "title, thumbnailUrl, videoUrl and channelId are required" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not own this channel" });
    }

    const video = await Video.create({
      title, description, thumbnailUrl, videoUrl, category, channelId,
      uploader: req.user._id,
    });

    channel.videos.push(video._id);
    await channel.save();

    return res.status(201).json({ message: "Video uploaded", video });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating video", error: error.message });
  }
};

// PUT /api/videos/:id (protected, uploader only)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this video" });
    }

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl) video.videoUrl = videoUrl;
    if (category) video.category = category;

    await video.save();
    return res.status(200).json({ message: "Video updated", video });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating video", error: error.message });
  }
};

// DELETE /api/videos/:id (protected, uploader only)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await video.deleteOne();
    await Channel.findByIdAndUpdate(video.channelId, { $pull: { videos: video._id } });

    return res.status(200).json({ message: "Video deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting video", error: error.message });
  }
};

// PATCH /api/videos/:id/like (protected)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = video.likes.some((id) => id.toString() === userId);

    video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    if (alreadyLiked) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.likes.push(req.user._id);
    }

    await video.save();
    return res.status(200).json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    return res.status(500).json({ message: "Server error liking video", error: error.message });
  }
};

// PATCH /api/videos/:id/dislike (protected)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();
    const alreadyDisliked = video.dislikes.some((id) => id.toString() === userId);

    video.likes = video.likes.filter((id) => id.toString() !== userId);
    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes.push(req.user._id);
    }

    await video.save();
    return res.status(200).json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    return res.status(500).json({ message: "Server error disliking video", error: error.message });
  }
};

// POST /api/videos/:id/comments (protected)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.comments.push({ userId: req.user._id, username: req.user.username, text });
    await video.save();

    return res.status(201).json({ message: "Comment added", comments: video.comments });
  } catch (error) {
    return res.status(500).json({ message: "Server error adding comment", error: error.message });
  }
};

// PUT /api/videos/:videoId/comments/:commentId (protected, comment author only)
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.text = text;
    await video.save();

    return res.status(200).json({ message: "Comment updated", comments: video.comments });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating comment", error: error.message });
  }
};

// DELETE /api/videos/:videoId/comments/:commentId (protected, comment author only)
export const deleteComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.deleteOne();
    await video.save();

    return res.status(200).json({ message: "Comment deleted", comments: video.comments });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting comment", error: error.message });
  }
};
