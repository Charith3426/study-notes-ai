import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server"; // <-- IMPORT NextRequest

// CORRECTED PUT function
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { // <-- USE NextRequest
  const { id } = params;
  const { title, notes, status } = await req.json();

  const updatedTopic = await prisma.topic.update({
    where: { id: id },
    data: { title, notes, status }
  });

  return NextResponse.json(updatedTopic);
}

// CORRECTED DELETE function
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) { // <-- USE NextRequest
  const { id } = params;

  await prisma.topic.delete({
    where: { id: id }
  });

  return NextResponse.json({ message: "Topic deleted successfully" });
}
