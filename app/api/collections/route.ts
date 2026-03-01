import { createCollection } from "@/lib/collections";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await createCollection(body);
    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    console.error('Create collection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
