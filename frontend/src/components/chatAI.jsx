import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { axiosClient } from "../utils/axiosClient.js";
import { Send } from 'lucide-react';



function ChatAI({ problem }) {
    console.log("Problem:", problem);
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hi, How are you" }] },
        { role: 'user', parts: [{ text: "I am Good" }] }
    ]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
    const updatedMessages = [
        ...messages,
        {
            role: "user",
            parts: [{ text: data.message }]
        }
    ];

    setMessages(updatedMessages);
    reset();

    console.log({
    messages: updatedMessages,
    title: problem?.title,
    description: problem?.description,
    testCases: problem?.visibleTestCases,
    startCode: problem?.startCode
});

    try {
        const response = await axiosClient.post("/ai/chat", {
            messages: updatedMessages,
            title: problem?.title,
            description: problem?.description,
            testCases: problem?.visibleTestCases,
            startCode: problem?.startCode
        });

        setMessages(prev => [
            ...prev,
            {
                role: "model",
                parts: [{ text: response.data.message }]
            }
        ]);
    } catch (error) {
        console.error(error);

        setMessages(prev => [
            ...prev,
            {
                role: "model",
                parts: [{ text: "Error from AI Chatbot" }]
            }
        ]);
    }
};

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-125">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";

                    return (
                        <div 
                            key={index} 
                            className={`chat ${isUser ? "chat-end" : "chat-start"}`}
                        >
                            {/* Avatar Image */}
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt={isUser ? "User avatar" : "AI avatar"}
                                        src={
                                            isUser
                                                ? "https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                                                : "https://api.dicebear.com/9.x/bottts/svg?seed=Assistant"
                                        }
                                    />
                                </div>
                            </div>

                            {/* Header Label */}
                            <div className="chat-header text-xs opacity-50 mb-1">
                                {isUser ? "YOU" : "Codey"}
                            </div>

                            {/* Chat Bubble */}
                            <div className={`chat-bubble ${isUser ? "chat-bubble-primary" : "bg-base-200 text-base-content"}`}>
                                {msg.parts[0].text}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-ghost ml-2"
                        disabled={errors.message}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAI;