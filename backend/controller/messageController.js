const { Op, Sequelize } = require('sequelize');
const MessageModel = require("../models/messageModel.js");
const User= require('../models/user.js')

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const message = await MessageModel.create({ senderId, receiverId, content });
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Normalize sender and receiver IDs to group conversations consistently
    const conversations = await MessageModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      attributes: [
        [Sequelize.literal('LEAST(senderId, receiverId)'), 'userA'],
        [Sequelize.literal('GREATEST(senderId, receiverId)'), 'userB'],
      ],
      group: ['userA', 'userB'],
    });

    if (conversations.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    // Extract unique user IDs from conversations
    const userIds = [
      ...new Set(
        conversations.flatMap(({ dataValues: { userA, userB } }) => [userA, userB])
      ),
    ];

    // Fetch user details
    const users = await User.findAll({
      where: { id: { [Sequelize.Op.in]: userIds } },
      attributes: ['id', 'name', 'profilePicture', 'role'],
    });

    // Create a mapping of user details by userId
    const userDetails = users.reduce((acc, user) => {
      acc[user.id] = user; // Map user ID to user details
      return acc;
    }, {});

    // Get the latest message for each conversation
    const latestMessages = [];
    for (let { dataValues: { userA, userB } } of conversations) {
      const lastMessage = await MessageModel.findOne({
        where: {
          [Sequelize.Op.or]: [
            { senderId: userA, receiverId: userB },
            { senderId: userB, receiverId: userA },
          ],
        },
        order: [['timestamp', 'DESC']],
        limit: 1,
      });

      if (lastMessage) {
        latestMessages.push({ lastMessage, userA, userB });
      }
    }

    // Construct response with user details
    const messagesWithUserDetails = latestMessages.map(({ lastMessage, userA, userB }) => ({
      userA,
      userB,
      userAName: userDetails[userA]?.name,
      userAProfilePicture: userDetails[userA]?.profilePicture,
      userBName: userDetails[userB]?.name,
      userBProfilePicture: userDetails[userB]?.profilePicture,
      lastMessage: lastMessage.content,
      timestamp: lastMessage.timestamp,
    }));

    res.status(200).json({ conversations: messagesWithUserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};









const getSpecficUserMessage = async (req, res) => {
  try {
    const { userId, otherUserId } = req.query;  // Accept both userId (logged-in user) and otherUserId (the person to check messages with)

    if (!userId || !otherUserId) {
      return res.status(400).json({ message: "Both userId and otherUserId are required" });
    }

    // Find messages where the userId is either the sender or receiver and otherUserId is the counterpart
    const messages = await MessageModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      order: [["timestamp", "ASC"]], // Order by timestamp to get messages in sequence
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found between the users" });
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessages,getSpecficUserMessage };

