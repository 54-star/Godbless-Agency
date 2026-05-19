"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import type SignatureCanvasType from "react-signature-canvas";
const SignatureCanvas: any = dynamic(
  () => import("react-signature-canvas").then((mod) => mod.default),
  { ssr: false }
);

export default function CountersignPage() {
  const { id } = useParams();
  const sigRef = useRef<SignatureCanvasType>(null);

  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLOUDINARY_CLOUD = "dpfs5ekor";
  const CLOUDINARY_PRESET = "Godbless-agency";

  useEffect(() => {
    async function fetchRegistration() {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) setError("Registration not found.");
      else setRegistration(data);
      setLoading(false);
    }
    fetchRegistration();
  }, [id]);

  async function uploadToCloudinary(file: File) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: data }
    );
    if (!res.ok) throw new Error("Failed to upload signature.");
    const uploaded = await res.json();
    return uploaded.secure_url;
  }

  async function handleSign() {
    setError(null);
    if (sigRef.current?.isEmpty()) return setError("Please provide your signature.");

    setSubmitting(true);

    try {
      const agentSigDataUrl = sigRef.current!.toDataURL("image/png");
      const agentSigBlob = await (await fetch(agentSigDataUrl)).blob();
      const agentSigFile = new File([agentSigBlob], "agent-signature.png", { type: "image/png" });
      const agentSignatureUrl = await uploadToCloudinary(agentSigFile);

      const { error: updateError } = await supabase
        .from("registrations")
        .update({ agent_signature_url: agentSignatureUrl, status: "signed" })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);

      // Send final email to agent with all details
      await fetch("https://formspree.io/f/mdajkydz", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Message": "Registration fully signed by both parties.",
          "Worker Name": registration.full_name,
          "Email": registration.email,
          "Phone": registration.phone,
          "Date of Birth": registration.dob,
          "Address": registration.address,
          "Job Description": registration.job_description,
          "Referee": registration.referee,
          "Photo": registration.photo_url,
          "Client Signature": registration.client_signature_url,
          "Agent Signature": agentSignatureUrl,
        }),
      });

      // Send confirmation email to client
      await fetch("https://formspree.io/f/xojbqzqp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "_replyto": registration.email,
          "Message": `Dear ${registration.full_name}, your registration with GodblessAgency has been fully signed and completed. Welcome aboard!`,
          "Worker Name": registration.full_name,
        }),
      });

      setSigned(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error && !registration) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (signed || registration?.status === "signed") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">All Signed!</h2>
          <p className="text-zinc-400 max-w-sm mx-auto">
            This registration has been fully signed and completed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-zinc-800 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
            <span className="text-black font-black text-lg">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GodblessAgency</h1>
            <p className="text-zinc-500 text-sm">Agent Countersign</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Review & Sign</h2>
          <p className="text-zinc-500 text-sm">Review the registration details below and add your signature.</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 space-y-4 border border-zinc-800">
          <div className="flex items-center gap-4">
            {registration.photo_url && (
              <img src={registration.photo_url} alt="Worker" className="w-16 h-16 rounded-xl object-cover border border-zinc-700" />
            )}
            <div>
              <h3 className="font-bold text-lg">{registration.full_name}</h3>
              <p className="text-zinc-500 text-sm">{registration.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">Phone</p>
              <p className="text-white">{registration.phone}</p>
            </div>
            <div>
              <p className="text-zinc-500">Date of Birth</p>
              <p className="text-white">{registration.dob}</p>
            </div>
            <div className="col-span-2">
              <p className="text-zinc-500">Address</p>
              <p className="text-white">{registration.address}</p>
            </div>
            <div className="col-span-2">
              <p className="text-zinc-500">Job Description</p>
              <p className="text-white">{registration.job_description}</p>
            </div>
            <div>
              <p className="text-zinc-500">Referee</p>
              <p className="text-white">{registration.referee}</p>
            </div>
          </div>

          {registration.client_signature_url && (
            <div>
              <p className="text-zinc-500 text-sm mb-2">Client Signature</p>
              <img src={registration.client_signature_url} alt="Client Signature" className="h-16 bg-white rounded-lg p-2" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Your Signature</h3>
          <div className="rounded-xl overflow-hidden border border-zinc-700 bg-white">
            <SignatureCanvas ref={sigRef} penColor="#000"
              canvasProps={{ style: { width: "100%", height: 150 } }} />
          </div>
          <button type="button" onClick={() => sigRef.current?.clear()}
            className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
            Clear
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        <button onClick={handleSign} disabled={submitting}
          className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-4 rounded-xl transition-colors text-sm tracking-wide">
          {submitting ? "Signing..." : "Confirm & Sign"}
        </button>
      </div>
    </div>
  );
}