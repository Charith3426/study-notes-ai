import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// CORRECTED PUT function
export async function PUT(req: NextRequest, context: { params: { id: string } }) { 
  const { id } = context.params; 
  const { title, notes, status } = await req.json();

  const updatedTopic = await prisma.topic.update({
    where: { id: id },
    data: { title, notes, status }
  });

  return NextResponse.json(updatedTopic);
}

// CORRECTED DELETE function
export async function DELETE(req: NextRequest, context: { params: { id: string } }) { 
  const { id } = context.params; 

  await prisma.topic.delete({
    where: { id: id }
  });

  return NextResponse.json({ message: "Topic deleted successfully" });
}
