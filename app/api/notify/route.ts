import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, fullName } = await req.json();

  const countersignUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/countersign/${id}`;

  const res = await fetch(`https://formspree.io/f/mdajkydz`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      "Message": `A new worker has registered and needs your signature.`,
      "Worker Name": fullName,
      "Countersign Link": countersignUrl,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Failed to notify agent" }, { status: 500 });
  return NextResponse.json({ success: true });
}