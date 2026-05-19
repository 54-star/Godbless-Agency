"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

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
    const [dark, setDark] = useState(true);

    const CLOUDINARY_CLOUD = "dpfs5ekor";
    const CLOUDINARY_PRESET = "Godbless-agency";

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setDark(savedTheme !== "light");
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    const theme = {
        bg: dark ? "bg-[#0a0a0a]" : "bg-[#fafaf8]",
        text: dark ? "text-white" : "text-zinc-900",
        subtext: dark ? "text-zinc-500" : "text-zinc-500",
        border: dark ? "border-zinc-800" : "border-zinc-200",
        nav: dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200",
        card: dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200",
        input: dark
            ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600 focus:border-amber-400"
            : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-amber-400",
        toggle: dark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600",
        label: dark ? "text-zinc-300" : "text-zinc-700",
        error: dark ? "bg-red-950 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600",
    };

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
            <div className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center px-4 transition-colors duration-300`}>
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold">Registration Complete!</h2>
                    <p className={`${theme.subtext} max-w-sm mx-auto`}>
                        Thank you for registering with GodblessAgency. The agent will countersign shortly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>

            {/* NAVBAR */}
            <div className={`border-b ${theme.nav} ${theme.border} sticky top-0 z-50 transition-colors duration-300`}>
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 animate-pulse">
                            <img src="/logo godbless.jpeg" alt="logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold tracking-tight">GodblessAgency</h1>
                            <p className={`text-xs ${theme.subtext}`}>Worker Registration Form</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setDark(!dark)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${theme.toggle} transition-all duration-300 hover:scale-105`}
                    >
                        {dark ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                                </svg>
                                Light
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                </svg>
                                Dark
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* FORM */}
            <div className="max-w-2xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-1">Register with us</h2>
                    <p className={`${theme.subtext} text-sm`}>Fill in your details below. All fields are required.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Personal Information</h3>

                        <div>
                            <label className={`block text-sm ${theme.label} mb-1.5`}>Full Name</label>
                            <input name="fullName" type="text" required placeholder="John Adeyemi"
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${theme.input}`} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm ${theme.label} mb-1.5`}>Email Address</label>
                                <input name="email" type="email" required placeholder="john@email.com"
                                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${theme.input}`} />
                            </div>
                            <div>
                                <label className={`block text-sm ${theme.label} mb-1.5`}>Phone Number</label>
                                <input name="phone" type="tel" required placeholder="+234 800 000 0000"
                                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${theme.input}`} />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm ${theme.label} mb-1.5`}>Date of Birth</label>
                            <input name="dob" type="date" required
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${theme.input}`} />
                        </div>

                        <div>
                            <label className={`block text-sm ${theme.label} mb-1.5`}>Home Address</label>
                            <textarea name="address" required rows={2} placeholder="House number, street, city, state"
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none ${theme.input}`} />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Work Details</h3>

                        <div>
                            <label className={`block text-sm ${theme.label} mb-1.5`}>Job Description</label>
                            <textarea name="experience" required rows={4} placeholder="Describe your previous work experience..."
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none ${theme.input}`} />
                        </div>

                        <div>
                            <label className={`block text-sm ${theme.label} mb-1.5`}>Referee</label>
                            <input name="referee" type="text" required placeholder="e.g. brother, sister..."
                                className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${theme.input}`} />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Photo</h3>
                        <div className="flex items-start gap-5">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-zinc-700 flex-shrink-0" />
                            ) : (
                                <div className={`w-20 h-20 rounded-xl border flex items-center justify-center flex-shrink-0 ${theme.card}`}>
                                    <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex-1">
                                <label className={`block text-sm ${theme.label} mb-1.5`}>Upload Your Photo</label>
                                <label className="cursor-pointer block">
                                    <div className={`w-full border border-dashed rounded-xl px-4 py-3 text-center text-sm hover:border-amber-400 hover:text-amber-400 transition-colors ${dark ? "border-zinc-600 text-zinc-500" : "border-zinc-300 text-zinc-400"}`}>
                                        {photoFile ? photoFile.name : "Click to choose a photo"}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                </label>
                                <p className={`text-xs ${theme.subtext} mt-1`}>JPG, PNG or WEBP. Clear face photo.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Signature</h3>
                        <div>
                            <label className={`block text-sm ${theme.label} mb-1.5`}>Client Signature</label>
                            <div className="rounded-xl overflow-hidden border border-zinc-700 bg-white">
                                <SignatureCanvas ref={sigRef} penColor="#000"
                                    canvasProps={{ style: { width: "100%", height: 150 } }} />
                            </div>
                            <button type="button" onClick={() => sigRef.current?.clear()}
                                className={`mt-2 text-xs ${theme.subtext} hover:text-amber-400 transition-colors`}>
                                Clear
                            </button>
                        </div>
                    </section>

                    {error && (
                        <div className={`border rounded-xl px-4 py-3 text-sm ${theme.error}`}>{error}</div>
                    )}

                    <button type="submit" disabled={submitting}
                        className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-4 rounded-xl transition-colors text-sm tracking-wide">
                        {submitting ? "Submitting..." : "Complete Registration"}
                    </button>

                    <p className={`text-center text-xs ${theme.subtext}`}>
                        By submitting, you confirm that all information provided is accurate.
                    </p>
                </form>
            </div>
        </div>
    );
}