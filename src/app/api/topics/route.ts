import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

// GET /api/topics - Fetches all topics
export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(topics);
}

// POST /api/topics - Creates a new topic
export async function POST(req: Request) {
  const { title, notes, status } = await req.json();
  const topic = await prisma.topic.create({
    data: { title, notes, status }
  });
  return NextResponse.json(topic);
}