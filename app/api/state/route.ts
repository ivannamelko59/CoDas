import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient> | null = null;

function getClient() {
  if (!uri) return null;
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function GET() {
  try {
    const promise = getClient();
    if (!promise) {
      return NextResponse.json({ state: null });
    }
    const client = await promise;
    const doc = await client
      .db("codas")
      .collection("portal_state")
      .findOne({ _id: "main" as never });

    return NextResponse.json({ state: doc?.data ?? null });
  } catch (error) {
    console.error("MongoDB GET error:", error);
    return NextResponse.json({ state: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const promise = getClient();
    if (!promise) {
      return NextResponse.json({ ok: false, reason: "No MONGODB_URI" });
    }
    const body = await request.json();
    const client = await promise;
    await client
      .db("codas")
      .collection("portal_state")
      .updateOne(
        { _id: "main" as never },
        { $set: { data: body, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MongoDB POST error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
