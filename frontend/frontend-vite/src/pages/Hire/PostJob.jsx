// src/pages/Hire/PostJob.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaImage, FaCheckCircle } from "react-icons/fa";
import { createJob } from "../../services/jobService";
import { uploadFile } from "../../services/uploadService";
import { SafeImage } from "../../components/ui/SafeMedia";
import AIJobDescriptionWriter from "./AIJobDescriptionWriter";
import AIPricingSuggestion from "./AIPricingSuggestion";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop";

export default function PostJob({ user }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = "";
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        finalImageUrl = uploaded.url || "";
      }
      await createJob({
        title,
        description,
        category,
        budget: price ? Number(price) : undefined,
        price: price ? Number(price) : undefined,
        image: finalImageUrl || "",
      });
      alert("Job posted successfully!");
      navigate("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Web Development",
    "Graphic Design",
    "Marketing & SEO",
    "Content Writing",
    "Mobile Apps",
    "Other Skills",
  ];

  const handleAIApply = (suggestion) => {
    setTitle(suggestion.title);
    setDescription(suggestion.description);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Post a New Job</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details below and let AI help you write a compelling job description.
          </p>
        </div>

        {/* Success Message */}
        {title && description && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex gap-3">
            <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-200">Good to go!</p>
              <p className="text-sm text-emerald-800 dark:text-emerald-300">Your job description is ready to post.</p>
            </div>
          </div>
        )}

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Step 1: Basic Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Details</h2>
            </div>

            {/* Job Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Senior React Developer, Logo Design, Content Writer"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Be specific and clear about what you need.</p>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter budget amount"
                className={inputClass}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={0}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This helps attract freelancers in your budget range.</p>
            </div>

            {/* AI Pricing Suggestion */}
            {category && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <AIPricingSuggestion
                  category={category}
                  jobTitle={title}
                  scope="medium"
                  level="intermediate"
                  onPriceSelected={(priceData) => {
                    setPrice(priceData.price.toString());
                  }}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Step 2: AI Description Writer */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Write Description (AI Help Available)</h2>
            </div>

            {/* AI Writer Component */}
            <div className="mb-6">
              <AIJobDescriptionWriter
                onApply={handleAIApply}
                category={category}
              />
            </div>

            {/* Manual Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe your job in detail. Include responsibilities, requirements, and what you expect from freelancers..."
                className={`${inputClass} min-h-[150px] resize-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length} characters. Be detailed for better matches.
              </p>
            </div>
          </div>

          {/* Step 3: Job Image (Optional) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center font-bold text-sm">3</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Image (Optional)</h2>
            </div>

            <div className="flex gap-6">
              {/* Preview */}
              <div className="w-full sm:w-48 h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                <SafeImage
                  src={imageUrl || PLACEHOLDER_IMAGE}
                  alt="Job preview"
                  className="w-full h-full object-cover"
                  fallback="/public/default.png"
                />
              </div>

              {/* Upload Area */}
              <div className="flex-1 flex flex-col justify-center">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition">
                    <FaImage className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {imageFile ? "Change image" : "Click to upload"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imageFile && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1">
                    <FaCheckCircle /> Image selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? "Posting Job..." : "Post Job Now"}
            </button>
            <Link
              to="/dashboard/jobs"
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
