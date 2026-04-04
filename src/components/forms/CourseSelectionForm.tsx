import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ugprogramsdatadetails from "@/data/academics/ugprogramsdatadetails.js";
import pgprogramsdatadetails from "@/data/academics/pgprogrammsdetails.js";
import {
  CheckCircle2,
  Phone,
  Mail,
  User,
  User2,
  Loader2,
  GraduationCap,
  X,
} from "lucide-react";
import HeadingUnderline from "../reusable/HeadingUnderline";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwywXDxRMeySa1-nOu1ZqTYW0oMzcKjkEDGrcdgX2_Tl3P1w2FJJ_p94jgWc5ysQZQ/exec";

interface CourseSelectionFormProps {
  course?: string;
  isOpen: boolean;
  onClose: () => void;
}

const CourseSelectionForm: React.FC<CourseSelectionFormProps> = ({
  course: defaultCourse,
  isOpen,
  onClose,
}) => {
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

  // Auto-select default course when prop changes
  useEffect(() => {
    if (defaultCourse && defaultCourse !== formData.course) {
      setFormData(prev => ({ ...prev, course: defaultCourse }));
    }
  }, [defaultCourse]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        studentName: "",
        fatherName: "",
        email: "",
        mobile: "",
        course: "",
        message: "",
      });
      setShowSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleNameInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setFormData({ ...formData, [field]: value });
  };

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
      formRef.current?.reset();
      
      // 🚀 AUTO CLOSE MODAL AFTER SUCCESS (3 seconds)
      setTimeout(() => {
        onClose(); // Close the entire modal
      }, 3000);
    } catch (error) {
      console.error("Form Submission Error:", error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full backdrop-blur-xl shadow-2xl flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Form Container */}
      <div className="w-[420px] max-w-full bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-bounceIn max-h-[90vh] overflow-y-auto">
        <h3 className="text-center font-semibold text-xl">Apply for {defaultCourse || formData.course}</h3>
        <HeadingUnderline width={100}/>

        <p className="mb-4 text-center">
          Submit Your Admission Enquiry Form Now !
        </p>
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
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, course: value })
              }
              defaultValue={defaultCourse || undefined}
              value={formData.course}
            >
              <SelectTrigger className="pl-10 h-10 w-full rounded-md border-input bg-background text-sm data-[state=open]:border-purple-500">
                <SelectValue placeholder="Course Interested *" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {ugprogramsdatadetails.map((program) => (
                  <SelectItem
                    key={program.id}
                    value={`${program.degree} ${program.stream}`}
                  >
                    {program.degree} - {program.stream}
                  </SelectItem>
                ))}
                {pgprogramsdatadetails.map((program) => (
                  <SelectItem
                    key={program.id}
                    value={`${program.degree} ${program.stream}`}
                  >
                    {program.degree} - {program.stream}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="relative group">
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
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 w-[420px] max-w-full h-[280px] rounded-3xl shadow-2xl border border-green-200/50 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-bounceIn relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl animate-pulse" />
            <div className="relative z-10 w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm mb-6 group">
              <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-lg animate-bounce" />
            </div>
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-xl -translate-y-8 translate-x-8 animate-shimmer" />
          </div>
        </div>
      )}

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
    </div>
  );
};

export default CourseSelectionForm;
