import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import "./contact.css";

export default function Contact() {
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            notification.error({
                message: "All fields are required",
                description: "Please fill in both the subject and the message.",
            });
            return;
        }

        notification.success({
            message: "Message Prepared",
            description: "Your message is ready to be sent!",
        });

        setSubject("");
        setMessage("");
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
                        Trimite
                    </Button>
                </form>
            </div>
        </div>
    );
}
