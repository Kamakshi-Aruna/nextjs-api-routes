
import connectMongo from "../../lib/mongodb";
import User from "../../models/Users"
import { NextResponse } from "next/server";

//  CREATE
export async function POST(req: Request) {
    try {
        await connectMongo();
        const { name, email } = await req.json();
        const newUser = new User({ name, email });
        await newUser.save();
        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating user", error }, { status: 500 });
    }
}

//  READ
export async function GET() {
    try {
        await connectMongo();
        const users = await User.find();
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users", error }, { status: 500 });
    }
}


// DELETE ALL USERS
export async function DELETE() {
    try {
        await connectMongo();

        // Use deleteMany to remove all users
        const result = await User.deleteMany({});

        // If no users were deleted, return a message
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "No users to delete" }, { status: 404 });
        }

        return NextResponse.json({ message: "All users deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting all users:", error);
        // @ts-ignore
        return NextResponse.json({ message: "Error deleting users", error: error.message }, { status: 500 });
    }
}
