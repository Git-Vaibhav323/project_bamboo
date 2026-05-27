import React, { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import LazyImage from "./LazyImage";
import { supabase } from "../lib/supabase";

const STALK_POSITIONS = [
  { left: "5%", height: 320 },
  { left: "15%", height: 480 },
  { left: "80%", height: 400 },
  { left: "92%", height: 300 },
];

function BambooStalkDecor({ left, height }: { left: string; height: number }) {
  const nodes = Math.floor(height / 60);
  return (
    <svg
      className="contact-stalk"
      style={{ left, height: `${height}px` }}
      viewBox={`0 0 4 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line x1="2" y1="0" x2="2" y2={height} stroke="rgba(139,105,20,0.08)" strokeWidth="2" />
      {Array.from({ length: nodes }).map((_, i) => (
        <ellipse key={i} cx="2" cy={30 + i * 60} rx="3" ry="2" fill="none" stroke="rgba(139,105,20,0.08)" strokeWidth="1" />
      ))}
    </svg>
  );
}

function FloatingField({
  id,
  label,
  type = "text",
  required = false,
  as = "input",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  value: string;
  onChange: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className={`floating-field ${active ? "is-active" : ""}`}>
      {as === "textarea" ? (
        <textarea
          id={id}
          required={required}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default function ContactFormSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    budget: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [rippling, setRippling] = useState(false);

  const set = (field: keyof typeof formData) => (val: string) =>
    setFormData((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setRippling(true);
    setTimeout(() => setRippling(false), 600);

    try {
      if (supabase) {
        const { error: submitError } = await supabase
          .from("contact_submissions")
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            budget: formData.budget || null,
            source: "home_page",
            status: "new",
          }]);

        if (submitError) throw submitError;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError("Failed to send. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="scroll-reveal section-contact">
      <div className="contact-bamboo-stalks" aria-hidden>
        {STALK_POSITIONS.map((s) => (
          <BambooStalkDecor key={s.left} left={s.left} height={s.height} />
        ))}
      </div>

      <div className="contact-inner-wrap">
        <header className="our-work-header">
          <span className="section-label section-label--work">OUR WORK</span>
          <h2 className="heading-editorial our-work-heading">
            <span className="our-work-heading-line">Start Your</span>
            <span className="our-work-heading-stroke text-hollow">Journey.</span>
          </h2>
        </header>

        <div className="contact-layout">
          {/* Background Image */}
          <div className="contact-image-wrap">
            <LazyImage
              src="/samples/1.jpg"
              alt="Bamboo craft studio or site visit"
              className="contact-bg-image"
            />
          </div>

          {/* Overlay Content */}
          <div className="contact-overlay-content">
            {/* Left Text */}
            <div className="contact-copy">
              <h3 className="heading-editorial contact-copy-heading">
                <span className="contact-subline">Let&apos;s shape something</span>
                <br />
                <span className="text-golden">that breathes.</span>
              </h3>
              <p className="body-muted contact-copy-text">
                Whether it&apos;s a riverside retreat, a private villa, or a community pavilion
                — tell us about your land and we&apos;ll show you what bamboo can become.
              </p>
            </div>

            {/* Form Card */}
            <div className="contact-form-card">
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "50%",
                    backgroundColor: "var(--color-leaf)", margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "24px", color: "var(--color-accent)", marginBottom: "8px" }}>
                    Vision Received!
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                    We'll get back to you within 48 hours.
                  </p>
                </div>
              ) : (
                <form className="bamboo-form" onSubmit={handleSubmit} noValidate>
                  {error && (
                    <p style={{ color: "#ff6b6b", fontSize: "13px", marginBottom: "12px" }}>
                      {error}
                    </p>
                  )}

                  <FloatingField id="name"    label="Full Name"             required value={formData.name}    onChange={set("name")} />
                  <FloatingField id="email"   label="Email"    type="email" required value={formData.email}   onChange={set("email")} />
                  <FloatingField id="phone"   label="Phone"    type="tel"            value={formData.phone}   onChange={set("phone")} />
                  <FloatingField id="message" label="Message"  as="textarea" required value={formData.message} onChange={set("message")} />
                  <FloatingField id="budget"  label="Budget Range (optional)"        value={formData.budget}  onChange={set("budget")} />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`btn-bamboo-submit ${rippling ? "is-rippling" : ""}`}
                  >
                    {submitting ? "Sending…" : "Send Your Vision"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
