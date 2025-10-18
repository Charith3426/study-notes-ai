import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// PUT method
export async function PUT(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split("/");
  const id = urlParts[urlParts.length - 1];
  if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

  const { title, notes, status } = await req.json();

  try {
    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: { title, notes, status },
    });
    return NextResponse.json(updatedTopic);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE method
export async function DELETE(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split("/");
  const id = urlParts[urlParts.length - 1];
  if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

  try {
    await prisma.topic.delete({ where: { id } });
    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
