import { NextResponse } from "next/server";

export async function POST() {
  // This is an empty handler for when no model is selected
  // It simply returns an empty response
  return NextResponse.json({ message: "No model selected" }, { status: 200 });
}

export const dynamic = "force-dynamic";
