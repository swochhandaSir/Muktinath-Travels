import { CheckCircle2, Sparkles } from "lucide-react";

export default function SubmissionSuccessPanel({ title, message }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%)]" />
      <div className="absolute left-4 top-4 text-emerald-300/70">
        <Sparkles className="h-5 w-5 animate-pulse" aria-hidden="true" />
      </div>
      <div className="absolute right-4 top-4 text-emerald-300/70">
        <Sparkles
          className="h-5 w-5 animate-pulse [animation-delay:200ms]"
          aria-hidden="true"
        />
      </div>
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner shadow-emerald-200">
        <CheckCircle2 className="h-10 w-10 animate-bounce" aria-hidden="true" />
      </div>
      <h3 className="relative mt-4 text-lg font-semibold text-emerald-950">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-6 text-emerald-800">
        {message}
      </p>
      <p className="relative mt-3 text-xs font-medium uppercase tracking-[0.24em] text-emerald-700">
        We are preparing your request
      </p>
    </div>
  );
}
