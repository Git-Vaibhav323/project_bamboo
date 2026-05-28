import React from "react";
import { Link } from "wouter";
import { projects } from "../data/data";
import { useScrollReveal } from "../hooks/useScrollReveal";
import LazyImage from "./LazyImage";

const SAMPLE_IMAGES = [
  "/samples/1.jpg",
  "/samples/2.jpg",
  "/samples/3.jpg",
];

export default function OurWorkSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const displayProjects = projects.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="scroll-reveal section-our-work"
    >
      <div className="section-inner our-work-inner">
        <header className="our-work-header">
          <span className="section-label section-label--work">OUR WORK</span>
          <h2 className="heading-editorial our-work-heading">
            <span className="our-work-heading-line">Structures that</span>
            <span className="our-work-heading-stroke text-hollow">breathe.</span>
          </h2>
        </header>

        <div className="ow-showcase-grid">
          {displayProjects.map((project, idx) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`ow-showcase-card ow-showcase-card--${idx % 2 === 0 ? "from-left" : "from-right"}`}
            >
              <article className="ow-showcase-panel">
                <div className="card-image-shell ow-showcase-media">
                  <LazyImage
                    src={SAMPLE_IMAGES[idx]}
                    alt={project.name}
                    className="ow-showcase-img"
                  />
                </div>
                <div className="card-image-gradient" />
                <div className="ow-showcase-rule" aria-hidden />
                <div className="card-image-overlay ow-showcase-overlay">
                  <span className="ow-showcase-count">{String(idx + 1).padStart(2, "0")}</span>
                  <h3 className="card-overlay-title ow-showcase-title">{project.name}</h3>
                  <p className="card-overlay-location ow-showcase-location">{project.location}</p>
                  <span className="ow-showcase-tag">{project.type}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
