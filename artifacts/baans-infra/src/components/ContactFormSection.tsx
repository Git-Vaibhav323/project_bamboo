import React, { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import LazyImage from "./LazyImage";

const STALK_POSITIONS = [
  { left: "5%", height: 320 },
  { left: "15%", height: 480 },
  { left: "80%", height: 400 },
  { left: "92%", height: 300 },
];

function BambooStalkDecor({
  left,
  height,
}: {
  left: string;
  height: number;
}) {
  const nodes = Math.floor(height / 60);

  return (
    <svg
      className="contact-stalk"
      style={{ left, height: `${height}px` }}
      viewBox={`0 0 4 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="2"
        y1="0"
        x2="2"
        y2={height}
        stroke="rgba(139, 105, 20, 0.08)"
        strokeWidth="2"
      />

      {Array.from({ length: nodes }).map((_, i) => (
        <ellipse
          key={i}
          cx="2"
          cy={30 + i * 60}
          rx="3"
          ry="2"
          fill="none"
          stroke="rgba(139, 105, 20, 0.08)"
          strokeWidth="1"
        />
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
  options,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const active = focused || value.length > 0;

  return (
    <div className={`floating-field ${active ? "is-active" : ""}`}>
      {as === "textarea" ? (
        <textarea
          id={id}
          required={required}
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : as === "select" ? (
        <select
          id={id}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <option value="" disabled />
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
  const [rippling, setRippling] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setRippling(true);

    window.setTimeout(() => {
      setRippling(false);
    }, 600);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="scroll-reveal section-contact"
    >
      <div className="contact-bamboo-stalks" aria-hidden>
        {STALK_POSITIONS.map((s) => (
          <BambooStalkDecor
            key={s.left}
            left={s.left}
            height={s.height}
          />
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
              <span className="contact-subline">
  Let&apos;s shape something
</span>
                <br />
                <span className="text-golden">
                  that breathes.
                </span>
              </h3>

              <p className="body-muted contact-copy-text">
                Whether it&apos;s a riverside retreat,
                a private villa, or a community pavilion
                — tell us about your land and we&apos;ll
                show you what bamboo can become.
              </p>
            </div>

            {/* Floating Form */}
            <div className="contact-form-card">
              <form
                className="bamboo-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <FloatingField
                  id="name"
                  label="Full Name"
                  required
                />

                <FloatingField
                  id="email"
                  label="Email"
                  type="email"
                  required
                />

                <FloatingField
                  id="phone"
                  label="Phone"
                  type="tel"
                />

                <FloatingField
                  id="message"
                  label="Message"
                  as="textarea"
                  required
                />

                <FloatingField
                  id="budget"
                  label="Budget Range (optional)"
                />

                <button
                  type="submit"
                  className={`btn-bamboo-submit ${
                    rippling ? "is-rippling" : ""
                  }`}
                >
                  Send Your Vision
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}