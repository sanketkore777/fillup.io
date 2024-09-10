import { decrypt } from "@/app/lib/crypto";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/CreatorForm"; // Import the CreatorForm model
import UserFormResponse from "@/app/models/userFormResponse";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();
    const { id } = await currentUser();

    // Parsing the request body to get pageNo
    const { pageNo } = await request.json().catch(() => ({ pageNo: 0 }));
    const page = parseInt(pageNo, 10) || 0;
    const limit = 10;
    const start = page * limit;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const decryptedFormId = decrypt(params.formid);

    // Check if the form exists
    const formExists = await CreatorForm.findById(decryptedFormId);
    console.log(formExists, "-----------------", id);
    if (formExists.creatorId !== id) {
      return NextResponse.json(
        { success: false, message: "Unauthrized Access" },
        { status: 404 }
      );
    }
    if (!formExists) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    // Fetch the paginated results
    const getData = await UserFormResponse.find({ formId: decryptedFormId })
      .skip(start)
      .limit(limit);

    return NextResponse.json({ success: true, data: getData }, { status: 200 });
  } catch (error: any) {
    console.error(error);

    // Check for network-related errors
    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "EAI_AGAIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Network error, please check your connection.",
        },
        { status: 503 }
      );
    }

    // Handle any other errors
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
