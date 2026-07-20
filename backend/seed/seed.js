import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteMany();
  await Channel.deleteMany();
  await Video.deleteMany();

  const john = await User.create({
    username: "JohnDoe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDoe",
  });

  const jane = await User.create({
    username: "JaneSmith",
    email: "jane@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JaneSmith",
  });

  const channel = await Channel.create({
    channelName: "Code with John",
    owner: john._id,
    description: "Coding tutorials and tech reviews by John Doe.",
    channelBanner: "https://placehold.co/1200x250/1a1a1a/fff?text=Code+with+John",
    subscribers: 5200,
  });

  john.channels.push(channel._id);
  await john.save();

  const videosData = [
    {
      title: "Learn React in 30 Minutes",
      description: "A quick tutorial to get started with React.",
      thumbnailUrl: "https://placehold.co/640x360/2563eb/fff?text=Learn+React",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      category: "Education",
      channelId: channel._id,
      uploader: john._id,
      views: 15200,
    },
    {
      title: "Top 10 JavaScript Tips",
      description: "Level up your JS skills with these tips.",
      thumbnailUrl: "https://placehold.co/640x360/f59e0b/fff?text=JS+Tips",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      category: "Technology",
      channelId: channel._id,
      uploader: john._id,
      views: 8300,
    },
    {
      title: "Chill Lo-fi Beats to Code To",
      description: "Relaxing music for deep work sessions.",
      thumbnailUrl: "https://placehold.co/640x360/9333ea/fff?text=Lofi+Beats",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      category: "Music",
      channelId: channel._id,
      uploader: john._id,
      views: 42100,
    },
  ];

  const videos = await Video.insertMany(videosData);
  channel.videos = videos.map((v) => v._id);
  await channel.save();

  videos[0].comments.push({
    userId: jane._id,
    username: jane.username,
    text: "Great video! Very helpful.",
  });
  await videos[0].save();

  console.log("Seed complete! Login with: john@example.com / password123");
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
