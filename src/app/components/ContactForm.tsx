"use client";

import { useState, useOptimistic, startTransition } from "react";
import {submitContact} from "@/app/optimistic/actions";

interface Contact {
    id: number;
    name: string;
    email: string;
    message: string;
}

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [optimisticContacts, setOptimisticContacts] = useOptimistic<Contact[]>([]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        // Create the new optimistic contact
        const newContact: Contact = { id: Date.now(), ...formData };

        // Wrap the optimistic update inside `startTransition`
        startTransition(() => {
            setOptimisticContacts((prev) => [...prev, newContact]);
        });

        // Call the Server Action
        await submitContact(newContact);

        // Reset form
        setFormData({ name: "", email: "", message: "" });
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded"
                />
                <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">Submit</button>
            </form>

            <h3 className="mt-6 text-lg font-semibold">Recent Contacts</h3>
            <ul className="mt-2 space-y-2">
                {optimisticContacts.map((contact) => (
                    <li key={contact.id} className="p-2 border rounded">
                        <strong>{contact.name}</strong> - {contact.email}
                        <p>{contact.message}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
