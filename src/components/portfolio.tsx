"use client";
import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  CircuitBoard,
  Workflow,
  PanelsTopLeft,
  Menu,
  X,
  Code2,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, projects, services } from "@/lib/content";
import { Reveal, Parallax } from "@/components/motion";
import {
  BuildVisual,
  PromiseVisual,
  SimulationVisual,
} from "@/components/project-visuals";
import { ContactForm } from "@/components/contact-form";

const nav = [
  { name: "Work", id: "work" },
  { name: "Services", id: "services" },
  { name: "About", id: "about" },
  { name: "Contact", id: "contact" },
];
const serviceIcons = {
  web: PanelsTopLeft,
  backend: Braces,
  workflow: Workflow,
  ai: CircuitBoard,
};

function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    for (const { id } of nav) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="wordmark"
          href="#top"
          aria-label="Ayyan Anwar, back to top"
        >
          ayyan<span>.</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {nav.map(({ name, id }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
        <a href={`mailto:${profile.email}`} className="header-contact">
          Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button
          id="menu-toggle"
          className="mobile-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="mobile-nav"
          hidden={!open}
          aria-label="Mobile navigation"
          className="mobile-nav"
        >
          {nav.map(({ name, id }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {name}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label mono">
      <span>{number}</span>
      {children}
    </div>
  );
}

export function Portfolio() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div id="top" />
      <Navigation />
      <main id="main">
        {/* Hero structure adapted from Tailark Mist Hero One; custom typography and diagram. */}
        <section className="hero section-shell" aria-labelledby="hero-heading">
          <div className="hero-main">
            <Reveal className="hero-copy">
              <div className="eyebrow mono">
                <span className="small-line" />
                AYYAN ANWAR / SOFTWARE DEVELOPMENT
              </div>
            <h1 id="hero-heading" aria-label={profile.introduction}>
                I build web
                <br />
                applications,
                <br />
                backend systems,
                <br />
                and{" "}
                <span className="accent-word">
                  workflow
                  <br className="desktop-break" /> automations
                  <span className="end-dot">.</span>
                </span>
              </h1>
              <div className="hero-actions">
                <Button asChild className="button-primary">
                  <a href="#work">
                    View projects
                    <ArrowDown size={17} />
                  </a>
                </Button>
                <a href="#contact" className="text-link">
                  Discuss a project
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </Reveal>
            <Parallax className="hero-art">
              <BuildVisual />
            </Parallax>
          </div>
          <div className="hero-foot">
            <span className="mono">WEB / BACKEND / AUTOMATION</span>
            <a href="#work" className="scroll-prompt">
              A closer look at the work
              <ArrowDown size={15} />
            </a>
          </div>
        </section>

        <section
          id="work"
          className="work-section section-shell"
          aria-labelledby="work-heading"
        >
          <Reveal className="section-heading">
            <SectionLabel number="01">SELECTED WORK</SectionLabel>
            <div>
              <h2 id="work-heading">
                Two problems.
                <br />
                <span className="muted-heading">Two different builds.</span>
              </h2>
              <p>
                A mobile app for shared commitments.
                <br />A research system for noisy wireless observations.
              </p>
            </div>
          </Reveal>
          {projects.map((project, index) => (
            <article
              className={`project project-${project.id}`}
              key={project.id}
              aria-labelledby={`${project.id}-heading`}
            >
              <Reveal className="project-visual-wrap">
                {index === 0 ? <PromiseVisual /> : <SimulationVisual />}
              </Reveal>
              <Reveal className="project-copy" delay={0.08}>
                <div className="project-meta mono">
                  <span>
                    {project.number} / {project.name}
                  </span>
                  <span>{project.category}</span>
                </div>
                <h3 id={`${project.id}-heading`}>{project.headline}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-story">
                  <div>
                    <span className="mono">THE PROBLEM</span>
                    <p>{project.problem}</p>
                  </div>
                  <div>
                    <span className="mono">THE APPROACH</span>
                    <p>{project.approach}</p>
                  </div>
                </div>
                <details className="feature-details">
                  <summary>
                    Explore the features <span aria-hidden="true">+</span>
                  </summary>
                  <ul>
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </details>
                {index === 1 && (
                  <p className="research-note">
                    Results concern the simulated environment. Real-world
                    hospital performance and clinical effectiveness are not
                    established.
                  </p>
                )}
                <div className="stack-tags">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <a
                  className="project-repo text-link"
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore on GitHub
                  <ArrowUpRight size={18} />
                </a>
              </Reveal>
            </article>
          ))}
        </section>

        <section
          id="services"
          className="services-section"
          aria-labelledby="services-heading"
        >
          <div className="section-shell">
            <Reveal className="section-heading">
              <SectionLabel number="02">HOW I CAN HELP</SectionLabel>
              <div>
                <h2 id="services-heading">
                  From an interface
                  <br />
                  to the systems behind it.
                </h2>
                <p>
                  Work that connects what people see
                  <br />
                  with what a business needs to do.
                </p>
              </div>
            </Reveal>
            <div className="service-list">
              {services.map((service, index) => {
                const Icon = serviceIcons[service.icon];
                return (
                  <Reveal key={service.name} className="service-row">
                    <span className="service-number mono">0{index + 1}</span>
                    <div className="service-icon">
                      <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <a
                      href="#contact"
                      aria-label={`Discuss ${service.name.toLowerCase()}`}
                      className="service-link"
                    >
                      <ArrowUpRight size={23} />
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="about-section section-shell"
          aria-labelledby="about-heading"
        >
          <Reveal>
            <SectionLabel number="03">A LITTLE BACKGROUND</SectionLabel>
          </Reveal>
          <div className="about-grid">
            <Reveal>
              <h2 id="about-heading">
                Ayyan
                <br />
                Anwar<span className="end-dot">.</span>
              </h2>
              <div className="about-location mono">
                <span className="location-dot" />
                MANGALURU, INDIA
              </div>
            </Reveal>
            <Reveal className="about-copy">
              <p>{profile.about}</p>
              <div className="about-links">
                <a
                  href={profile.github}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 size={18} />
                  GitHub
                  <ArrowUpRight size={15} />
                </a>
                <a
                  href={profile.linkedin}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link size={18} />
                  LinkedIn
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Two-column contact section adapted from Tailark Mist Contact One (MIT). */}
        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-heading"
        >
          <div className="section-shell">
            <Reveal>
              <SectionLabel number="04">LET’S TALK</SectionLabel>
            </Reveal>
            <div className="contact-grid">
              <Reveal className="contact-copy">
                <h2 id="contact-heading">
                  What are
                  <br />
                  you building<span className="end-dot">?</span>
                </h2>
                <p>
                  A client project, a job opportunity, or an idea worth
                  discussing. Tell me a little about it.
                </p>
                <div className="direct-contact">
                  <a href={`mailto:${profile.email}`}>
                    {profile.email}
                    <ArrowUpRight size={18} />
                  </a>
                  <a href={profile.phoneHref}>
                    {profile.phone}
                    <ArrowUpRight size={18} />
                  </a>
                </div>
                <div className="contact-socials">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                    <ArrowUpRight size={14} />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </Reveal>
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer section-shell">
        <a href="#top" className="wordmark" aria-label="Back to top">
          ayyan<span>.</span>
        </a>
        <span className="mono">WEB. BACKEND. AUTOMATION.</span>
        <a href="#top" className="text-link">
          Back to top
          <ArrowUpRight size={15} />
        </a>
      </footer>
    </MotionConfig>
  );
}
