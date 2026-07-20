import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// POST /api/channels (protected) — create a channel for the logged-in user
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName || channelName.trim().length < 3) {
      return res.status(400).json({ message: "Channel name must be at least 3 characters" });
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });

    return res.status(201).json({ message: "Channel created", channel });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating channel", error: error.message });
  }
};

// GET /api/channels/:id — fetch a single channel with its videos populated
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json({ channel });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching channel", error: error.message });
  }
};

// GET /api/channels/mine/list (protected)
export const getMyChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id });
    return res.status(200).json({ channels });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching your channels", error: error.message });
  }
};

// PUT /api/channels/:id (protected, owner only)
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this channel" });
    }

    const { channelName, description, channelBanner } = req.body;
    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner) channel.channelBanner = channelBanner;

    await channel.save();
    return res.status(200).json({ message: "Channel updated", channel });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating channel", error: error.message });
  }
};

// DELETE /api/channels/:id (protected, owner only)
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this channel" });
    }

    await Video.deleteMany({ channelId: channel._id });
    await channel.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { channels: channel._id } });

    return res.status(200).json({ message: "Channel and its videos deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting channel", error: error.message });
  }
};
