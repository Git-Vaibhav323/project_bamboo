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

        <div className="projects-grid">
          {displayProjects.map((project, idx) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-card image-card-pop"
            >
              <div className="project-img-wrap">
                <div className="card-image-shell">
                  <LazyImage
                    src={SAMPLE_IMAGES[idx]}
                    alt={project.name}
                    className="project-img"
                  />
                </div>
                <div className="card-image-gradient" />
                <div className="card-image-overlay project-overlay">
                  <h3 className="card-overlay-title project-title">{project.name}</h3>
                  <p className="card-overlay-location project-location">{project.location}</p>
                  <span className="project-tag">{project.type}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
