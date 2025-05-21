import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import "./contact.css";
import { sendContactMessage } from "../../api/contactApi";

export default function Contact() {
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const userId = localStorage.getItem("id");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            notification.error({
                message: "All fields are required",
                description: "Please fill in both the subject and the message.",
            });
            return;
        }

        if (!userId) {
            notification.error({
                message: "You must be logged in",
                description: "User ID not found. Please log in.",
            });
            return;
        }

        try {
            await sendContactMessage({
                userId: Number(userId),
                subject,
                message,
            });

            notification.success({
                message: "Message sent successfully",
                description: "Your message has been sent to the admin.",
            });

            setSubject("");
            setMessage("");
        } catch (error: any) {
            notification.error({
                message: "Failed to send message",
                description: error?.response?.data?.message || error.message,
            });
        }
    };


    return (
        <div className="contactContainer">
            <div>
                <div className="textMoto">
                    Get in touch
                    <div className="textKeyword">We're here to help</div>
                </div>
                <form onSubmit={handleSubmit} className="contactForm">
                    <label className="contactLabel">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="contactInput"
                        placeholder="Enter your subject"
                        required
                    />

                    <label className="contactLabel">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="contactTextarea"
                        placeholder="Write your message here..."
                        rows={6}
                        required
                    />

                    <Button htmlType="submit" size="large" className="travelButton">
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}
