import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux to manage state
import axios from 'axios'; // Import axios
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null); // Store messages for the selected user
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const senderId = user?.id;
  
  const senderPhoneNumber = user?.phoneNumber;
  const [receiverDetails, setReceiverDetails] = useState(null); // State to store the receiver's static details
const [ReceiverNumber,setTutorPhoneNumber]=useState(null)
  useEffect(() => {
    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/history?userId=${senderId}`);

        setUsers(response.data?.conversations);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
    
    
      
      // Fetch the messages for the selected conversation
      fetchMessages(selectedUser?.id);
      setTutorPhoneNumber(selectedUser?.id);
      // // Fetch receiver details (static details)
      // fetchReceiverDetails(selectedUser.userB);
    }
  }, [selectedUser]);

  const fetchReceiverDetails = async (receiverId) => {
    try {
      
      // Assuming receiver's details are available by receiverId
      const response = await axios.get(`http://localhost:5000/api/users/${ReceiverNumber}`);
      
      setReceiverDetails(response.data);
    } catch (error) {
      console.error('Error fetching receiver details:', error);
    }
  };

  const fetchMessages = async (id) => {
    try {
      
      const response = await axios.get(
`http://localhost:5000/api/messages/userMessage?senderId=${user?.id}&receiverId=${id}`
      );
     
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    
    if (!messageText.trim()) return;
    if (user?.id === ReceiverNumber) {
      alert("You cannot send a message to yourself.");
      return;
    }

   

    const newMessage = {
      senderId,
      receiverId: ReceiverNumber,
      content: messageText, 
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);
    setMessageText("");

    try {
      await axios.post("http://localhost:5000/api/messages/send", newMessage);
      fetchMessages(selectedUser.userB);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      {/* Left: User List */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="font-semibold text-xl mb-4">Messages</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.receiverId}
              onClick={() => setSelectedUser(user)}
              className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img
                     src={`${BASE_URL_IMAGE}uploads/${user.profilePicture}`}
                  alt={user.profilePicture}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
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
              <h2 className="text-xl font-semibold">{receiverDetails?.name}</h2>
            </div>

            {/* Messages Container */}
            <div
              className="flex-1 p-4 space-y-4 overflow-y-auto"
              style={{
                maxHeight: 'calc(60vh - 70px)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {messages.map((message, index) => (
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
                    <p className="text-xs text-black font-semibold text-right">
                      {formatTimestamp(message.timestamp)}
                    </p>
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
                onChange={(e) => setMessageText(e.target.value)}
              ></textarea>

              <button
                onClick={sendMessage}
                className="w-full bg-teal-700 text-white py-2 rounded-md mt-2"
              >
                Send Message
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 p-4">Select a user to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
