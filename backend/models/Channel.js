import mongoose from "mongoose";
const ChannelSchema = new mongoose.Schema(
    {
       channelName:{
            type: String,
            required: [true, "Channel name is required"],
            trim: true,
            minlength:3,
            maxlength: 40,
        },
        owner: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
        description: { type: String, default: "", maxlength: 500},
        channelBanner: {
            type: String,
            default: "https://placehold.co/1200x250/222/fff?text=Channel+Banner",
        },
        subscribers: { type:Number, default: 0},
        videos: [{type: mongoose.Schema.Types.ObjectId, ref: "Video"}],
    },
    {
        timestamps: true
    }

);
export default mongoose.model("Channel", ChannelSchema);
