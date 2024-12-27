import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux to manage state
import axios from 'axios'; // Import axios

function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null); // Store messages for the selected user
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const senderId = user?.id;
  
  
  
  useEffect(() => {
     // Fetch users from the server
     const fetchUsers = async () => {
    
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/history?userId=${senderId}`);
        console.log("sss",response.data)
        setUsers(response.data?.conversations);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }; 
    fetchUsers();
  }, []);

 

  useEffect(() => {
    if (selectedUser) {
      
      fetchMessages(selectedUser.userB);
    }
  }, [selectedUser]);

  const fetchMessages = async (parentId) => {

    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/userMessage?userId=${parentId}&otherUserId=${senderId}`
      );
      console.log("Messages fetched:", response);
      setMessages(response?.data?.messages); // Set the messages for the right column
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


   
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      };
      console.log(users)
      console.log(senderId,selectedUser?.userB)
      const sendMessage = async () => {
        if (!messageText.trim()) return;
      
        // Check if senderId and receiverId are the same
        if (senderId === selectedUser?.userB) {
          alert("You cannot send a message to yourself.");
          return; // Stop further execution
        }
      
        // Create the new message
        const newMessage = {
          senderId,
          receiverId: selectedUser?.userB,
          content: messageText,
          timestamp: new Date(),
        };
      
        // Optimistic update: Append the new message directly to the state
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage, // Add the new message to the end of the list
        ]);
      
        // Clear the input field after sending the message
        setMessageText("");
      
        try {
          // Send the message to the server
          const response = await axios.post("http://localhost:5000/api/messages/send", newMessage);
      
          // Refetch the messages after sending
          fetchMessages(selectedUser.userB); // Fetch the latest messages from the server
        } catch (err) {
          setError(err.response?.data?.message || err.message);
        }
      };
      
      
      

      const selectedUserMessages = selectedUser
      ? messages
      : [];

   console.log(users)
  return (
    <div className="flex h-screen overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>
    {/* Left: User List */}
    <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="font-semibold text-xl mb-4">Messages</h2>
      <div className="space-y-4">
        {users?.map((user) => (
          <div
            key={user.receiverId}
            onClick={() => setSelectedUser(user)}
            className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer rounded-md"
          >
            <div className="flex items-center space-x-4">
              {/* Profile picture */}
              <img
                src={user.userBProfilePicture}
                alt={user.userBName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                {/* User name */}
                <p className="font-semibold text-lg">{user.userBName}</p>
                {/* Last message */}
                <p className="text-sm text-gray-500">{user.lastMessage}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatTimestamp(user.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  
    {/* Right: Chat Area */}
    <div className="w-2/3 bg-white flex flex-col">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
          </div>
  
          {/* Messages Container */}
          <div
            className="flex-1 p-4 space-y-4 overflow-y-auto"
            style={{
                maxHeight: 'calc(60vh - 70px)', // Adjust as needed
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // Internet Explorer/Edge
              }} // Adjust 120px to the header/input height
          >
            {selectedUserMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === senderId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.senderId === senderId
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  } max-w-xs`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 text-right">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
  
          {/* Message Input */}
          <div className="p-4 border-t">
          <textarea
  className="w-full p-3 border rounded-md"
  rows="3"
  placeholder="Type a message"
  value={messageText}
  onChange={(e) => setMessageText(e.target.value)} // Update messageText state
></textarea>

            <button
               onClick={sendMessage}
            className="w-full bg-green-600 text-white py-2 rounded-md mt-2">
              Send Message
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 p-4">
          Select a user to start chatting.
        </p>
      )}
    </div>
  </div>
  
  );
}

export default Messages;
