import { createZippo } from "@/lib/zippos";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const zippo = await createZippo(body);
    return NextResponse.json(zippo, { status: 201 });
  } catch (error: any) {
    console.error('Create zippo error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
