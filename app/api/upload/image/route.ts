import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const formData = new FormData();
  formData.append("file", new Blob([buffer]));
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

  const url = `${process.env.CLOUDINARY_HOST}/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const res = await fetch(url, { method: "POST", body: formData });

  const cloudinaryData = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: cloudinaryData.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: cloudinaryData.secure_url });
}
