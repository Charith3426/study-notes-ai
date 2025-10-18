import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

interface Params {
  params: { id: string };
}

// GET example (optional)
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;

  const topic = await prisma.topic.findUnique({
    where: { id },
  });

  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  return NextResponse.json(topic);
}

// ✅ Correct PUT
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = params;
  const { title, notes, status } = await req.json();

  const updatedTopic = await prisma.topic.update({
    where: { id },
    data: { title, notes, status },
  });

  return NextResponse.json(updatedTopic);
}

// ✅ Correct DELETE
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = params;

  await prisma.topic.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Topic deleted successfully" });
}
