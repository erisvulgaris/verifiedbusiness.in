"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { CATEGORIES } from "@/lib/directory-data";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  Phone,
  MapPin,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";

const STEPS = [
  { id: 1, label: "Business info", icon: Building2 },
  { id: 2, label: "Contact & address", icon: Phone },
  { id: 3, label: "Verification", icon: MapPin },
  { id: 4, label: "Review & submit", icon: Sparkles },
];

export function ListBusinessView({
  onNavigateHome,
}: {
  onNavigateHome?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  useDocumentTitle("List your business — Free | VerifiedBusiness.in");

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    locality: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    gst: "",
    hours: "9:00 AM – 9:00 PM",
    paymentMethods: [] as string[],
  });

  const update = (k: string, v: string | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const togglePayment = (m: string) =>
    setForm((f) => ({
      ...f,
      paymentMethods: f.paymentMethods.includes(m)
        ? f.paymentMethods.filter((p) => p !== m)
        : [...f.paymentMethods, m],
    }));

  const canProceed = () => {
    switch (step) {
      case 1:
        return form.name.length > 2 && form.category.length > 0;
      case 2:
        return (
          form.phone.length >= 10 &&
          form.address.length > 5 &&
          form.city.length > 1 &&
          /^\d{6}$/.test(form.pincode)
        );
      case 3:
        return form.gst.length >= 10;
      default:
        return true;
    }
  };

  if (submitted) {
    return (
      <div className="directory-container py-16 sm:py-24">
        <div className="max-w-xl mx-auto text-center">
          <div
            className="mx-auto inline-flex items-center justify-center mb-6"
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              backgroundColor: "var(--color-success-light)",
            }}
          >
            <Check size={32} strokeWidth={3} style={{ color: "var(--color-success)" }} />
          </div>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: "var(--text-3xl)",
              letterSpacing: "-0.3px",
              color: "var(--color-text-primary)",
            }}
          >
            Listing submitted!
          </h1>
          <p
            className="mt-3"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-lg)",
              lineHeight: "28px",
            }}
          >
            Thank you for listing <strong>{form.name}</strong>. Our team will
            verify your business within 3–5 working days. You'll receive an
            email at <strong>{form.email || "your registered email"}</strong>{" "}
            once your listing is live.
          </p>
          <div
            className="mt-8 border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-5 text-left"
          >
            <h3
              className="font-display font-semibold mb-3"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-primary)",
              }}
            >
              What happens next
            </h3>
            <ol className="space-y-3">
              {[
                "We'll call your business phone to confirm operating hours.",
                "Our team will cross-check your address with India Post pincode data.",
                "Your GST details will be validated against the GSTN portal.",
                "Once verified, you'll receive a Verified badge and a dashboard login.",
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center justify-center shrink-0 font-display font-bold"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      backgroundColor: "var(--color-accent-light)",
                      color: "var(--color-accent)",
                      fontSize: 12,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      lineHeight: "20px",
                    }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
            }}
          >
            Back to home
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: "List your business" },
        ]}
      />

      <header className="mt-4 max-w-2xl">
        <h1
          className="font-display font-bold"
          style={{
            fontSize: "clamp(var(--text-2xl), 5vw, var(--text-3xl))",
            lineHeight: "44px",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          List your business — free
        </h1>
        <p
          className="mt-3"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-lg)",
            lineHeight: "28px",
          }}
        >
          Reach over 50 million monthly searchers across India. Submit your GST
          or shop establishment number and get verified within 3–5 working
          days.
        </p>
      </header>

      {/* Stepper */}
      <ol className="mt-8 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const isComplete = step > s.id;
          const isActive = step === s.id;
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => s.id < step && setStep(s.id)}
                disabled={s.id > step}
                className="flex items-center gap-2 text-left disabled:cursor-default"
              >
                <span
                  className="inline-flex items-center justify-center transition-all duration-200"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: isComplete
                      ? "var(--color-success)"
                      : isActive
                        ? "var(--color-accent)"
                        : "var(--color-surface-2)",
                    color: isComplete || isActive ? "#FFFFFF" : "var(--color-text-tertiary)",
                    border: isActive
                      ? "2px solid var(--color-accent)"
                      : "2px solid var(--color-border)",
                  }}
                >
                  {isComplete ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <Icon size={16} strokeWidth={2.2} />
                  )}
                </span>
                <span
                  className="hidden sm:block"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                    fontWeight: isActive || isComplete ? 600 : 500,
                    color: isActive || isComplete ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                  }}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 24,
                    height: 2,
                    backgroundColor: isComplete ? "var(--color-success)" : "var(--color-border)",
                    borderRadius: 1,
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Form card */}
      <div className="mt-8 max-w-2xl">
        <div
          className="border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-6 sm:p-8"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <StepHeader
                title="Tell us about your business"
                description="This information appears on your public listing card."
              />
              <Field label="Business name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Sankalp South Indian Restaurant"
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                  }}
                />
              </Field>
              <Field label="Category" required>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                  }}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Short description" hint="Max 300 characters — appears on your listing card">
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value.slice(0, 300))}
                  rows={3}
                  placeholder="e.g. Authentic South Indian vegetarian restaurant since 1981, famous for filter coffee and masala dosa."
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none transition-colors resize-none"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                  }}
                />
                <p
                  className="mt-1 text-right"
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {form.description.length}/300
                </p>
              </Field>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <StepHeader
                title="How can customers reach you?"
                description="These details appear on your business detail page."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone number" required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-base)",
                    }}
                  />
                </Field>
                <Field label="Email (optional)">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="care@yourbusiness.com"
                    className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-base)",
                    }}
                  />
                </Field>
              </div>
              <Field label="Website (optional)">
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="yourbusiness.com"
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                  }}
                />
              </Field>
              <Field label="Full address" required>
                <textarea
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  rows={2}
                  placeholder="Shop number, street, landmark"
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none resize-none"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                  }}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Locality">
                  <input
                    type="text"
                    value={form.locality}
                    onChange={(e) => update("locality", e.target.value)}
                    placeholder="e.g. Whitefield"
                    className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-base)",
                    }}
                  />
                </Field>
                <Field label="City" required>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-base)",
                    }}
                  />
                </Field>
                <Field label="Pincode" required hint="6 digits">
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="560048"
                    className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-base)",
                    }}
                  />
                </Field>
              </div>
              <Field label="Operating hours">
                <input
                  type="text"
                  value={form.hours}
                  onChange={(e) => update("hours", e.target.value)}
                  placeholder="9:00 AM – 9:00 PM"
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                  }}
                />
              </Field>
              <Field label="Payment methods accepted">
                <div className="flex flex-wrap gap-2">
                  {["UPI", "Cards", "Cash", "Wallets", "Cheque"].map((m) => {
                    const active = form.paymentMethods.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => togglePayment(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-150"
                        style={{
                          backgroundColor: active ? "var(--color-accent-light)" : "var(--color-surface-2)",
                          color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
                          border: active ? "1px solid var(--color-accent-border)" : "1px solid var(--color-border)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-sm)",
                          fontWeight: 500,
                        }}
                      >
                        {active && <Check size={12} strokeWidth={3} />}
                        {m}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <StepHeader
                title="Verify your business"
                description="Verified businesses get a green Verified badge and appear higher in search."
              />
              <Field label="GST number" required hint="15-character GSTIN">
                <input
                  type="text"
                  value={form.gst}
                  onChange={(e) => update("gst", e.target.value.toUpperCase().slice(0, 15))}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-3 py-3 border border-[var(--color-border-strong)] rounded-[8px] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:outline-none font-mono"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "var(--text-base)",
                    letterSpacing: "0.5px",
                  }}
                />
              </Field>
              <div
                className="border rounded-[10px] p-4 flex items-start gap-3"
                style={{
                  backgroundColor: "var(--color-accent-light)",
                  borderColor: "var(--color-accent-border)",
                }}
              >
                <Sparkles size={18} strokeWidth={2} style={{ color: "var(--color-accent)", marginTop: 2 }} />
                <div>
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    Why we ask for GST
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      lineHeight: "20px",
                    }}
                  >
                    GST validation is the strongest signal that your business is
                    legitimate. We never display your GST number publicly — it's
                    used only for verification.
                  </p>
                </div>
              </div>
              <Field label="Upload shop establishment proof (optional)">
                <label
                  className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border-strong)] rounded-[10px] p-6 cursor-pointer transition-colors hover:border-[var(--color-accent)]"
                >
                  <Upload size={24} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
                  <p
                    className="mt-2 font-medium"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    Click to upload
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    PDF, JPG, or PNG — up to 5 MB
                  </p>
                  <input type="file" className="hidden" />
                </label>
              </Field>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5">
              <StepHeader
                title="Review your listing"
                description="Make sure everything looks right before you submit."
              />
              <div className="space-y-3">
                <ReviewRow label="Business name" value={form.name} />
                <ReviewRow label="Category" value={CATEGORIES.find((c) => c.slug === form.category)?.name ?? form.category} />
                <ReviewRow label="Phone" value={form.phone} />
                <ReviewRow label="Email" value={form.email || "—"} />
                <ReviewRow label="Website" value={form.website || "—"} />
                <ReviewRow label="Address" value={`${form.address}, ${form.locality}, ${form.city}, ${form.state} — ${form.pincode}`} />
                <ReviewRow label="Hours" value={form.hours} />
                <ReviewRow label="GST" value={form.gst || "—"} />
                <ReviewRow label="Payments" value={form.paymentMethods.join(", ") || "—"} />
              </div>
              <label
                className="flex items-start gap-2.5 cursor-pointer p-4 border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface-2)]"
              >
                <input type="checkbox" defaultChecked className="mt-1" />
                <span
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                    lineHeight: "20px",
                  }}
                >
                  I confirm that the information provided is accurate and I am
                  authorised to list this business. I agree to the platform's{" "}
                  <a href="#" style={{ color: "var(--color-accent)" }}>Terms of Service</a> and{" "}
                  <a href="#" style={{ color: "var(--color-accent)" }}>Listing Policy</a>.
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (step === 1 ? onNavigateHome?.() : setStep(step - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
              {step === 1 ? "Cancel" : "Back"}
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => canProceed() && setStep(step + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[8px] transition-all duration-150 hover:shadow-[var(--shadow-md)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-text-inverse)",
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                }}
              >
                Continue
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[8px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
                style={{
                  backgroundColor: "var(--color-success)",
                  color: "var(--color-text-inverse)",
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                }}
              >
                <Check size={14} strokeWidth={2.5} />
                Submit for verification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2
        className="font-display font-bold"
        style={{
          fontSize: "var(--text-xl)",
          letterSpacing: "-0.2px",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h2>
      <p
        className="mt-1"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "20px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block mb-1.5 font-medium"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
        }}
      >
        {label}
        {required && <span style={{ color: "var(--color-warning)" }}> *</span>}
      </label>
      {children}
      {hint && (
        <p
          className="mt-1"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2 border-b border-[var(--color-border)] last:border-b-0">
      <dt
        className="sm:w-40 shrink-0"
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
        }}
      >
        {label}
      </dt>
      <dd
        className="flex-1 min-w-0 break-words"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
        }}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
