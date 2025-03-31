import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaUser, FaTimes } from 'react-icons/fa';

const ChatAssistant = ({ onClose, language = 'english' }) => {
    const [messages, setMessages] = useState([
        { text: "Welcome to TRAVEL LOTUS! 🌸 I'm here to guide you through our platform and ensure your experience is as smooth as possible. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    
    // Enhanced knowledge base for the chatbot with more detailed information and keywords
    const knowledgeBase = {
        booking: {
            response: "To book a room on Travel Lotus, please login to your account and browse our available accommodations. Each listing includes photos, amenities, pricing, and availability calendars. Once you find your ideal place, you can directly book through our secure platform or contact the owner for more details before confirming.",
            keywords: ["book", "reserve", "booking", "reservation", "stay", "accommodate"]
        },
        browse: {
            response: "You can explore our extensive collection of rooms, apartments, and properties across various locations. Our advanced search filters let you narrow down options by price range, amenities, location, property type, and more. Each listing features high-quality photos, detailed descriptions, and verified reviews from previous guests.",
            keywords: ["browse", "explore", "find", "search", "view", "listings", "properties", "rooms", "apartments"]
        },
        communication: {
            response: "Our platform facilitates direct communication between guests and property owners. You can send messages, ask questions about the property, negotiate terms, or request specific arrangements—all within our secure messaging system. This ensures transparent and documented communication for both parties.",
            keywords: ["contact", "message", "communicate", "talk", "chat", "connect", "landlord", "owner", "host"]
        },
        bills: {
            response: "Travel Lotus offers a comprehensive bills management system. You can view all your monthly bills, track payment history, receive payment reminders, and even make payments directly through our platform. This centralized system helps you stay organized and avoid missing any payments.",
            keywords: ["bill", "payment", "pay", "invoice", "receipt", "transaction", "money", "fee", "cost"]
        },
        complaints: {
            response: "If you encounter any issues with your accommodation, our complaint management system makes it easy to report problems. Simply navigate to your booking details, click on 'Report Issue', and provide the necessary information. Property owners are notified immediately, and you can track the resolution process in real-time.",
            keywords: ["complaint", "issue", "problem", "concern", "report", "fix", "broken", "maintenance", "repair"]
        },
        language: {
            response: "Travel Lotus is available in multiple languages. You can switch between languages using the language selector at the top of our landing page. Currently, we support English, Spanish, French, German, Chinese, Japanese, and Arabic to make our platform accessible to a global audience.",
            keywords: ["language", "translate", "translation", "english", "spanish", "french", "localize", "international", "multi-language"]
        },
        login: {
            response: "To access all features of Travel Lotus, you need to log in or create an account. Our registration process is quick and simple—requiring just your email, name, and password. Once logged in, you can book properties, save favorites, view your bookings, manage payments, and communicate with property owners.",
            keywords: ["login", "sign in", "register", "account", "profile", "sign up", "password", "authentication", "credentials"]
        },
        owners_dashboard: {
            response: "As a property owner, you have access to a specialized dashboard designed to make property management effortless. From this central hub, you can list properties, manage bookings, communicate with guests, track payments, handle complaints, and view comprehensive analytics about your property performance.",
            keywords: ["owner", "landlord", "host", "dashboard", "manage", "property management", "listing management", "landlord portal"]
        },
        properties: {
            response: "Adding your property to Travel Lotus is a straightforward process. From your owner dashboard, click 'Add New Property' and provide details such as title, description, location, pricing, amenities, and high-quality photos. Our system guides you through optimizing your listing to attract more bookings and achieve better visibility in search results.",
            keywords: ["add property", "list property", "create listing", "publish", "property details", "upload", "my property"]
        },
        records: {
            response: "Property owners can access comprehensive record keeping tools through Travel Lotus. You can manage tenant information, track rental history, document property maintenance, store important agreements, and generate reports for tax or accounting purposes—all in one secure location.",
            keywords: ["records", "history", "document", "track", "tenant", "rental history", "documentation", "agreements", "contracts"]
        },
        complaints_tracking: {
            response: "Our advanced complaint tracking system helps property owners efficiently manage and resolve tenant issues. You'll receive instant notifications when a complaint is filed, can assign priority levels, track resolution progress, communicate directly with tenants, and maintain a record of all resolved issues for future reference.",
            keywords: ["complaint management", "issue tracking", "resolve complaints", "tenant problems", "maintenance requests", "issue resolution"]
        },
        costs: {
            response: "Travel Lotus allows property owners to transparently manage and update costs associated with their listings. You can set base rates, seasonal pricing, special offers, additional fees, and security deposits. The platform also provides pricing recommendations based on market analysis to help maximize your revenue.",
            keywords: ["cost", "price", "fee", "rate", "rent", "pricing", "payment terms", "deposit", "charge"]
        },
        transportation: {
            response: "We've partnered with popular transportation services like Uber and PickMe to help you get around easily. You can book these services directly through our platform. Additionally, we offer airport transfer arrangements for a seamless travel experience. Just let us know your flight details, and we'll take care of the rest.",
            keywords: ["transport", "transportation", "travel", "taxi", "uber", "pickme", "airport", "shuttle", "transfer"]
        },
        security: {
            response: "Your security is our priority at Travel Lotus. We implement strict verification processes for all users, secure payment processing, encrypted communications, and privacy protection measures. Both guests and property owners can use our secure messaging and payment systems with confidence.",
            keywords: ["security", "safety", "secure", "protection", "privacy", "safe", "verification", "trust", "encrypted"]
        },
        reviews: {
            response: "Authentic reviews help build trust in our community. After your stay, you'll be prompted to leave a review about your experience. Similarly, property owners can review guests. These honest evaluations help future users make informed decisions and maintain high standards across our platform.",
            keywords: ["review", "rating", "feedback", "testimonial", "comment", "experience", "stars", "opinion", "evaluate"]
        },
        cancellation: {
            response: "Travel Lotus offers flexible cancellation policies that vary by property. Each listing clearly displays its cancellation terms, which might be flexible, moderate, or strict. You can view the specific refund percentages based on how far in advance you cancel. We recommend checking these details before booking.",
            keywords: ["cancel", "cancellation", "refund", "policy", "change", "reschedule", "booking change", "terms"]
        }
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Enhanced query processing with AI-like capabilities
    const processQuery = (query) => {
        const lowerQuery = query.toLowerCase();
        
        // Check for greetings and general inquiries first
        if (containsAny(lowerQuery, ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"])) {
            return "Hello! Welcome to Travel Lotus. How can I assist you with your accommodation needs today?";
        }
        
        if (containsAny(lowerQuery, ["what can you do", "help me", "how does this work", "about", "features", "what is travel lotus"])) {
            return "**Travel Lotus** is your all-in-one accommodation platform! I can help you with browsing properties, booking rooms, managing payments, communicating with property owners, reporting issues, and more. What specific aspect would you like to explore?";
        }
        
        if (containsAny(lowerQuery, ["thank", "thanks", "appreciate", "helpful"])) {
            return "You're welcome! I'm happy to assist. Is there anything else you'd like to know about Travel Lotus?";
        }
        
        // Search for the most relevant response
        let bestMatch = findBestMatch(lowerQuery);
        
        // If no good match found, provide a helpful general response
        if (!bestMatch) {
            return "I'm not quite sure what you're asking about. Could you please rephrase your question? I'm here to help with bookings, property listings, payments, owner services, or any other aspect of Travel Lotus.";
        }
        
        return bestMatch;
    };

    // Helper function to check if the query contains any keywords from an array
    const containsAny = (text, keywords) => {
        return keywords.some(keyword => text.includes(keyword));
    };
    
    // Enhanced function to find the best match from the knowledge base
    const findBestMatch = (query) => {
        let bestResponse = null;
        let highestScore = 0;
        
        // Calculate relevance score for each topic
        Object.entries(knowledgeBase).forEach(([topic, data]) => {
            let score = 0;
            
            // Check direct keyword matches
            data.keywords.forEach(keyword => {
                if (query.includes(keyword)) {
                    // Single word keywords get lower weight
                    const weight = keyword.split(' ').length > 1 ? 2 : 1;
                    score += weight;
                    
                    // Boost score for exact phrase matches
                    if (query.includes(` ${keyword} `)) {
                        score += 1;
                    }
                }
            });
            
            // Process context-specific queries
            if (topic === 'booking' && containsAny(query, ['how to book', 'how do i book', 'want to book', 'interested in booking'])) {
                score += 3;
            } else if (topic === 'login' && containsAny(query, ['cant login', 'trouble logging in', 'forgot password', 'create account'])) {
                score += 3;
            } else if (topic === 'cancellation' && containsAny(query, ['need to cancel', 'want to cancel', 'refund policy', 'change my booking'])) {
                score += 3;
            }
            
            // Check for question patterns
            if (query.startsWith('how') || query.startsWith('what') || query.startsWith('where') || 
                query.startsWith('can i') || query.startsWith('do you') || query.includes('?')) {
                // More specific matches for questions
                if ((topic === 'booking' && containsAny(query, ['how book', 'how to book', 'how can i book'])) ||
                    (topic === 'browse' && containsAny(query, ['how find', 'how search', 'how to find'])) ||
                    (topic === 'complaints' && containsAny(query, ['how report', 'how to report', 'how complain'])) ||
                    (topic === 'login' && containsAny(query, ['how login', 'how to login', 'how sign up', 'how create account']))) {
                    score += 2;
                }
            }
            
            // Update best match if this topic has a higher score
            if (score > highestScore) {
                highestScore = score;
                bestResponse = data.response;
            }
        });
        
        // Return the best matching response or null if no good match
        return highestScore > 0 ? bestResponse : null;
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = { text: input, isBot: false };
        setMessages([...messages, userMessage]);
        setInput('');

        // Process and respond with realistic typing delay
        setTimeout(() => {
            const response = processQuery(input);
            setMessages(prevMessages => [...prevMessages, { text: response, isBot: true }]);
        }, Math.min(600 + response.length * 10, 1500)); // Dynamic delay based on response length
    };
    
    // Get a personalized response based on query length for more natural feel
    const response = (input) => {
        const processed = processQuery(input);
        return processed;
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-popup">
                <div className="chatbot-header">
                    <div className="d-flex align-items-center">
                        <FaRobot className="me-2" size={20} />
                        <h5 className="m-0">Lotus Assistant</h5>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes size={16} />
                    </button>
                </div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`message-container ${msg.isBot ? 'bot-message' : 'user-message'}`}
                        >
                            <div className="message-bubble">
                                <div className="message-sender">
                                    {msg.isBot ? 
                                        <><FaRobot className="me-1" size={12} /> <small>Lotus Assistant</small></> :
                                        <><small>You</small> <FaUser className="ms-1" size={12} /></>
                                    }
                                </div>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chatbot-input" onSubmit={handleSendMessage}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your question here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" disabled={!input.trim()}>
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
            
            <style jsx>{`
                .chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                
                .chatbot-popup {
                    width: 350px;
                    height: 450px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .chatbot-header {
                    background: linear-gradient(135deg, #4a6bff 0%, #2b41a0 100%);
                    color: white;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .close-button {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.3s;
                }
                
                .close-button:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                
                .chatbot-messages {
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .message-container {
                    display: flex;
                    margin-bottom: 10px;
                }
                
                .bot-message {
                    justify-content: flex-start;
                }
                
                .user-message {
                    justify-content: flex-end;
                }
                
                .message-bubble {
                    max-width: 80%;
                    padding: 10px 12px;
                    border-radius: 12px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                
                .bot-message .message-bubble {
                    background-color: #f0f2f5;
                    color: #333;
                    border-bottom-left-radius: 4px;
                }
                
                .user-message .message-bubble {
                    background-color: #4a6bff;
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                
                .message-sender {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    margin-bottom: 4px;
                    opacity: 0.8;
                }
                
                .message-text {
                    line-height: 1.4;
                    white-space: pre-wrap;
                }
                
                .chatbot-input {
                    display: flex;
                    padding: 10px;
                    border-top: 1px solid #eaeaea;
                    background-color: #f8f9fa;
                }
                
                .chatbot-input input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    outline: none;
                    transition: border-color 0.3s;
                }
                
                .chatbot-input input:focus {
                    border-color: #4a6bff;
                }
                
                .chatbot-input button {
                    margin-left: 10px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #4a6bff;
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .chatbot-input button:hover {
                    background-color: #3a55cc;
                }
                
                .chatbot-input button:disabled {
                    background-color: #b4c0ff;
                    cursor: not-allowed;
                }
                
                @media (max-width: 480px) {
                    .chatbot-popup {
                        width: 300px;
                        height: 400px;
                        bottom: 0;
                        right: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatAssistant;