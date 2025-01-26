import Message from "../models/message.models.js";
import User from "../models/user.models.js";

export const getUsersForSiderbar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSiderbar controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userToChatId },
        { sender: userToChatId, receiver: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image); // upload image to cloudinary
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    // realtime functionality goes to socket.io
    res.status(200).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller ", error.message);
    return res.status(500).json({ message: "Server error  " });
  }
};
