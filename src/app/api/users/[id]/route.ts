import connectMongo from "@/app/lib/mongodb";
import {NextResponse} from "next/server";
import Users from "@/app/models/Users";
import users from "@/app/models/Users";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();
        const { id } = params;

        const user = await Users.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
    }
}

// UPDATE USER BY ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();
        const { id } = params;

        // Extract the data to update from the request body
        const { name, email } = await req.json();

        // Find user by ID and update their data
        const updatedUser = await users.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        );

        // If no user found with that ID
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Return success with the updated user data
        return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Error updating user:", error);
        // @ts-ignore
        return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
    }
}

// DELETE USER BY ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();
        const { id } = params;

        const deletedUser = await Users.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting user", error }, { status: 500 });
    }
}
