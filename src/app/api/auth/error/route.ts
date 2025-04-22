import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
      CredentialsSignin: "Нууц үг эсвэл дугаар буруу байна.",
      SessionRequired: "Энэ хуудсанд нэвтрэх шаардлагатай.",
      AccessDenied: "Танд энэ хуудсанд нэвтрэх эрх байхгүй байна.",
      Configuration: "Authentication provider тохиргоонд алдаа гарлаа.",
      default: "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };

    return NextResponse.json(
      { error: errorMessages[error || "default"] },
      { status: 200 } // Changed from 400 to 200 since this is expected behavior
    );
  } catch (error) {
    console.error("Error handling authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}