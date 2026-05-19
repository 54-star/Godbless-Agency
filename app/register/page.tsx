"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import SignatureCanvasPkg from "react-signature-canvas";
const SignatureCanvas: any = dynamic(
  () => import("react-signature-canvas").then((mod) => mod.default),
  { ssr: false }
);

export default function RegisterPage() {
  const sigRef = useRef<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLOUDINARY_CLOUD = "dpfs5ekor";
  const CLOUDINARY_PRESET = "Godbless-agency";

  async function uploadToCloudinary(file: File) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: data }
    );
    if (!res.ok) throw new Error("Failed to upload file.");
    const uploaded = await res.json();
    return uploaded.secure_url;
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!photoFile) return setError("Please upload your photo.");
    if (sigRef.current?.isEmpty()) return setError("Please provide your signature.");

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const dob = (form.elements.namedItem("dob") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLTextAreaElement).value;
    const jobDescription = (form.elements.namedItem("experience") as HTMLTextAreaElement).value;
    const referee = (form.elements.namedItem("referee") as HTMLInputElement).value;

    setSubmitting(true);

    try {
      const photoUrl = await uploadToCloudinary(photoFile);

      const clientSigDataUrl = sigRef.current!.toDataURL("image/png");
      const clientSigBlob = await (await fetch(clientSigDataUrl)).blob();
      const clientSigFile = new File([clientSigBlob], "client-signature.png", { type: "image/png" });
      const clientSignatureUrl = await uploadToCloudinary(clientSigFile);

      const { data, error: dbError } = await supabase
        .from("registrations")
        .insert({
          full_name: fullName,
          email,
          phone,
          dob,
          address,
          job_description: jobDescription,
          referee,
          photo_url: photoUrl,
          client_signature_url: clientSignatureUrl,
          status: "pending",
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);

      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id, fullName }),
      });

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Registration Complete!</h2>
          <p className="text-zinc-400 max-w-sm mx-auto">
            Thank you for registering with GodblessAgency. The agent will countersign shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-zinc-800 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-black font-black text-lg">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GodblessAgency</h1>
            <p className="text-zinc-500 text-sm">Worker Registration Form</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Register with us</h2>
          <p className="text-zinc-500 text-sm">Fill in your details below. All fields are required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Personal Information</h3>

            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Full Name</label>
              <input name="fullName" type="text" required placeholder="John Adeyemi"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Email Address</label>
                <input name="email" type="email" required placeholder="john@email.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Phone Number</label>
                <input name="phone" type="tel" required placeholder="+234 800 000 0000"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Date of Birth</label>
              <input name="dob" type="date" required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Home Address</label>
              <textarea name="address" required rows={2} placeholder="House number, street, city, state"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Work Details</h3>

            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Job Description</label>
              <textarea name="experience" required rows={4} placeholder="Describe your previous work experience..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none" />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Referee</label>
              <input name="referee" type="text" required placeholder="e.g. brother, sister..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Photo</h3>
            <div className="flex items-start gap-5">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-zinc-700 flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm text-zinc-300 mb-1.5">Upload Your Photo</label>
                <label className="cursor-pointer block">
                  <div className="w-full bg-zinc-900 border border-dashed border-zinc-600 rounded-xl px-4 py-3 text-center text-zinc-500 text-sm hover:border-amber-400 hover:text-amber-400 transition-colors">
                    {photoFile ? photoFile.name : "Click to choose a photo"}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
                <p className="text-xs text-zinc-600 mt-1">JPG, PNG or WEBP. Clear face photo.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Signature</h3>
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Client Signature</label>
              <div className="rounded-xl overflow-hidden border border-zinc-700 bg-white">
                <SignatureCanvas ref={sigRef} penColor="#000"
                  canvasProps={{ style: { width: "100%", height: 150 } }} />
              </div>
              <button type="button" onClick={() => sigRef.current?.clear()}
                className="mt-2 text-xs text-zinc-500 hover:text-amber-400 transition-colors">
                Clear
              </button>
            </div>
          </section>

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-4 rounded-xl transition-colors text-sm tracking-wide">
            {submitting ? "Submitting..." : "Complete Registration"}
          </button>

          <p className="text-center text-xs text-zinc-600">
            By submitting, you confirm that all information provided is accurate.
          </p>
        </form>
      </div>
    </div>
  );
}