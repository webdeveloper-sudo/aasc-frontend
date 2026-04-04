import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import ugprogramsdatadetails from "@/data/academics/ugprogramsdatadetails.js";
import pgprogramsdatadetails from "@/data/academics/pgprogrammsdetails.js";
import {
  CheckCircle2,
  Phone,
  Mail,
  User,
  User2,
  MessageCircle,
  Loader2,
  GraduationCap,
} from "lucide-react";

// ⭐ Google Sheets Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwD5Yno522kTok2SnDibHATHTrL8d4lPownZJFuMLm0YSZ1HUnpbK4vAukqRiVsR_D9/exec";

const ForAdmissionForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    email: "",
    mobile: "",
    course: "",
    message: "",
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  // ❗ Allow ONLY alphabets for names
  const handleNameInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setFormData({ ...formData, [field]: value });
  };

  // ❗ Allow ONLY digits for mobile number
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 10) setFormData({ ...formData, mobile: digits });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setShowSuccess(true);
      setFormData({
        studentName: "",
        fatherName: "",
        email: "",
        mobile: "",
        course: "",
        message: "",
      });
      formRef.current?.reset();
    } catch (error) {
      console.error("Form Submission Error:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef} className="h-full space-y-3">
        {/* Student Name */}
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <Input
            className="pl-10"
            placeholder="Student Name *"
            required
            value={formData.studentName}
            onChange={(e) => handleNameInput(e, "studentName")}
          />
        </div>

        {/* Father Name */}
        <div className="relative group">
          <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <Input
            className="pl-10"
            placeholder="Father / Guardian Name *"
            required
            value={formData.fatherName}
            onChange={(e) => handleNameInput(e, "fatherName")}
          />
        </div>

        {/* Email */}
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <Input
            type="email"
            className="pl-10"
            placeholder="Email *"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Mobile */}
        <div className="relative group">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <Input
            type="tel"
            className="pl-10"
            placeholder="Mobile Number * (10 digits)"
            required
            maxLength={10}
            value={formData.mobile}
            onChange={handleMobileInput}
          />
        </div>

        {/* Course Selection */}
        <div className="relative group border-b border-gray-400">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <select
            required
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
            className="pl-10 w-full h-10 rounded-md   border-input bg-background text-sm
             "
          >
            {/* Placeholder */}
            <option value="" disabled className="border-b">
              Course Interested *
            </option>

            {/* UG */}
            <optgroup label="UG Programmes">
              {ugprogramsdatadetails.map((program) => (
                <option
                  key={program.id}
                  value={`${program.degree} ${program.stream}`}
                >
                  {program.degree} - {program.stream}
                </option>
              ))}
            </optgroup>

            {/* PG */}
            <optgroup label="PG Programmes">
              {pgprogramsdatadetails.map((program) => (
                <option
                  key={program.id}
                  value={`${program.degree} ${program.stream}`}
                >
                  {program.degree} - {program.stream}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Message */}
        <div className="relative group">
          {/* <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" /> */}
          <Textarea
            className="pt-0"
            placeholder="Your Message *"
            required
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="red-btn w-full mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>

      {/* ⭐ Enhanced Large Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 w-[420px] max-w-full h-[280px] rounded-3xl shadow-2xl border border-green-200/50 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-bounceIn relative overflow-hidden">
            {/* Decorative gradient ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl animate-pulse" />

            {/* Success Icon */}
            <div className="relative z-10 w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm mb-6 group">
              <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-lg animate-bounce" />
            </div>

            {/* Success Message */}
            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Application Submitted!
              </h2>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                🎉 Our admission team will contact you within 24 hours
              </p>
              <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2 animate-pulse">
                <Phone className="w-4 h-4" />
                Check your phone for updates
              </p>
            </div>

            {/* Subtle shine effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-xl -translate-y-8 translate-x-8 animate-shimmer" />
          </div>
        </div>
      )}

      {/* Enhanced Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3) rotate(-12deg); opacity: 0 }
          50% { transform: scale(1.05) rotate(2deg) }
          70% { transform: scale(0.98) rotate(-1deg) }
          100% { transform: scale(1) rotate(0deg); opacity: 1 }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(0) skewX(-20deg) }
          100% { transform: translateX(300%) translateY(0) skewX(-20deg) }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default ForAdmissionForm;
