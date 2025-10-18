import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// PUT /api/topics/[id] - Updates a specific topic
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const { title, notes, status } = await req.json();

  const updatedTopic = await prisma.topic.update({
    where: { id: id },
    data: { title, notes, status }
  });

  return NextResponse.json(updatedTopic);
}

// DELETE /api/topics/[id] - Deletes a specific topic
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  await prisma.topic.delete({
    where: { id: id }
  });

  return NextResponse.json({ message: "Topic deleted successfully" });
}