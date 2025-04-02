"use server";

import { revalidatePath } from "next/cache";

interface Contact {
    id: number;
    name: string;
    email: string;
    message: string;
}

// Fake Database (in-memory)
const contacts: Contact[] = [];

// Server Action: Simulate saving form data
export async function submitContact(formData: Contact) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
    contacts.push({ ...formData, id: contacts.length + 1 });
    revalidatePath("/"); // Refresh UI
}
