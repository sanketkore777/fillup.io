import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/CreatorForm";
import { decrypt } from "@/app/lib/crypto";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();
    const data = await req.json();
    const decryptFormId = decrypt(params.formid);

    // Validate the data object
    if (typeof data.isAcceptingResponses !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid datatype for isAcceptingResponses",
        },
        { status: 400 }
      );
    }

    // Update the form in the database
    const { id } = await currentUser();
    const form_ = await CreatorForm.findById(decryptFormId);
    if (!id || id !== form_.creatorId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized User" },
        { status: 401 }
      );
    }
    const updatedForm = await CreatorForm.findByIdAndUpdate(
      decryptFormId,
      data,
      { new: true, runValidators: true } // Ensures validation is run for the update
    );

    if (!updatedForm) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedForm },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating form:", error);

    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "EAI_AGAIN"
    ) {
      return NextResponse.json(
        { message: "Network error, please check your connection." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
