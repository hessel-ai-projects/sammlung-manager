import { deleteZippo } from "@/lib/zippos";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteZippo(Number(id));
  return NextResponse.json({ ok: true });
}
