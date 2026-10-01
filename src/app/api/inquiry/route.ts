import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the inquiry (replace with actual email/save logic later)
    console.log("=== NEW INQUIRY ===");
    console.log(JSON.stringify(body, null, 2));
    console.log("===================");

    // Basic validation
    const { fullName, email, phone, service, message } = body;
    if (!fullName || !email || !phone || !service || !message) {
      return NextResponse.json(
        { message: "All required fields must be filled" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Inquiry received successfully. We will be in touch shortly." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { message: "Failed to process inquiry" },
      { status: 500 },
    );
  }
}
