import React, { useEffect, useState } from "react";

const TidioChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Embedded chatbot config
    window.embeddedChatbotConfig = {
      chatbotId: "KQsKTS8teAiF4IAdFC8vP",
      domain: "www.chatbase.co",
    };
    
    // Create script element
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("chatbotId", "WFstMZKdEyyuwbjxfxKei");
    script.setAttribute("domain", "www.chatbase.co");
    
    // Append script to the document body
    document.body.appendChild(script);
    
    // Cleanup function to remove the script when the component is unmounted
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // Empty dependency array to ensure this runs only on mount/unmount

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg" style={{ width: "300px", height: "400px" }}>
          <div className="bg-blue-600 text-white p-2 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Chat Support</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-blue-200"
            >
              ✕
            </button>
          </div>
          <div className="h-full">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/WFstMZKdEyyuwbjxfxKei"
              width="100%"
              height="360px"
              frameBorder="0"
              className="rounded-b-lg"
            ></iframe>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default TidioChat;