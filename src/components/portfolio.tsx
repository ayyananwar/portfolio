"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MotionConfig } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  CircuitBoard,
  Workflow,
  PanelsTopLeft,
  Menu,
  X,
  Code2,
  Link,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  FlaskConical,
} from "lucide-react";
import { profile, services } from "@/lib/content";
import { Reveal } from "@/components/motion";
import { PromiseVisual, SimulationVisual } from "@/components/project-visuals";
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
        <a href="#contact" className="header-contact">
          Let&apos;s talk <ArrowUpRight size={16} aria-hidden="true" />
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label mono">
      {children}
      <span />
    </div>
  );
}

const work = [
  {
    id: "restaurant",
    name: "Restaurant operations, even offline.",
    category: "Full-stack",
    description:
      "An in-development Windows staff app for tables, orders, and kitchen updates, with a separate hosted guest menu. Pilot validation is still pending.",
    stack: ["TypeScript", "SQLite", "PostgreSQL"],
    url: "https://github.com/ayyananwar/restaurant-portal",
  },
  {
    id: "promise",
    name: "Commitments with a clear finish.",
    category: "Team project",
    description:
      "PROMISE brings shared commitments, timelines, and change requests together. Completion needs confirmation from both participants.",
    stack: ["Serverpod", "PostgreSQL", "Mobile app"],
    url: "https://github.com/nabilkhan-01/Promise",
  },
  {
    id: "signal",
    name: "Sustained contacts from noisy signals.",
    category: "Simulation research",
    description:
      "MDR-SIM compares wireless sensing configurations and calibrated classifiers using held-out evaluation. Findings are limited to simulation.",
    stack: ["Python", "Machine learning", "Evaluation"],
    url: "https://github.com/ayyananwar/MDR-SIM",
  },
];
function RestaurantVisual() {
  return (
    <div className="restaurant-preview">
      <div className="restaurant-bar">
        <span>RESTAURANT PORTAL</span>
        <span className="preview-status">Local service</span>
      </div>
      <strong>Service, in sync.</strong>
      <div className="restaurant-tabs">
        <span>Tables</span>
        <span>Kitchen</span>
        <span>Menu</span>
      </div>
      <div className="restaurant-tables">
        {["Table 01", "Table 02", "Table 03"].map((t, i) => (
          <div key={t}>
            <PanelsTopLeft size={21} />
            <b>{t}</b>
            <span>{["Order taken", "Preparing", "Ready to serve"][i]}</span>
          </div>
        ))}
      </div>
      <small>Workflow illustration · development build</small>
    </div>
  );
}
function SocialLinks() {
  return (
    <div className="about-links">
      <a
        className="button-outline"
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Code2 size={17} /> GitHub <ArrowUpRight size={15} />
      </a>
      <a
        className="button-outline"
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Link size={17} /> LinkedIn <ArrowUpRight size={15} />
      </a>
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
        <section className="hero section-shell" aria-labelledby="hero-heading">
          <Reveal className="hero-copy">
            <SectionLabel>DEVELOPER · BUILDER</SectionLabel>
            <h1 id="hero-heading">
              I build web applications, backend systems, and{" "}
              <span>workflow automations.</span>
            </h1>
            <p>
              Practical software, connected services, and AI features that turn
              ideas into working applications.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#work">
                View projects <ArrowRight size={18} />
              </a>
              <a className="button-outline" href="#contact">
                Discuss a project <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="skill-chips">
              <span>
                <Code2 size={15} /> Development
              </span>
              <span>
                <Braces size={15} /> Backend
              </span>
              <span>
                <CircuitBoard size={15} /> Applied AI
              </span>
              <span>
                <Workflow size={15} /> Automation
              </span>
            </div>
          </Reveal>
          <Reveal className="hero-portrait" delay={0.1}>
            <div className="portrait-orbit" aria-hidden="true" />
            <div className="portrait-frame">
              <Image
                src="/images/ayyan.webp"
                alt="Ayyan Anwar"
                width={960}
                height={1280}
                priority
                sizes="(min-width: 960px) 500px, 85vw"
              />
            </div>
            <div className="hero-code" aria-hidden="true">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>&lt;/&gt;</span>
              <code>
                Build()
                <br />
                Automate()
                <br />
                Evaluate()
              </code>
            </div>
            <a className="portrait-note" href="#work">
              Web. Backend.
              <br />
              Automation.
              <ArrowUpRight size={20} />
            </a>
          </Reveal>
        </section>
        <section
          id="services"
          className="section-shell section-block"
          aria-labelledby="services-heading"
        >
          <Reveal className="section-heading">
            <div>
              <SectionLabel>SERVICES</SectionLabel>
              <h2 id="services-heading">What I do</h2>
            </div>
            <p>
              From the interface people use to the services and workflows behind
              it.
            </p>
          </Reveal>
          <div className="service-grid">
            {services.map((s, i) => {
              const Icon = serviceIcons[s.icon];
              return (
                <Reveal className="service-card" key={s.name} delay={i * 0.05}>
                  <span className="icon-tile">
                    <Icon size={27} strokeWidth={1.6} />
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                </Reveal>
              );
            })}
          </div>
        </section>
        <section
          id="work"
          className="section-shell section-block"
          aria-labelledby="work-heading"
        >
          <Reveal className="section-heading">
            <div>
              <SectionLabel>FEATURED WORK</SectionLabel>
              <h2 id="work-heading">Selected projects</h2>
            </div>
            <p>
              Applications and experiments across full-stack development,
              backend systems, and applied research.
            </p>
          </Reveal>
          <div className="project-grid">
            {work.map((p, i) => (
              <Reveal className="project-card" key={p.id} delay={i * 0.06}>
                <div className="project-preview" inert>
                  <span className="project-badge">{p.category}</span>
                  {i === 0 ? (
                    <RestaurantVisual />
                  ) : i === 1 ? (
                    <PromiseVisual />
                  ) : (
                    <SimulationVisual />
                  )}
                </div>
                <div className="project-content">
                  <h3>
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      {p.name}
                      <ArrowUpRight size={20} />
                    </a>
                  </h3>
                  <p>{p.description}</p>
                  <div className="stack-tags">
                    {p.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          id="about"
          className="section-shell about-section"
          aria-labelledby="about-heading"
        >
          <Reveal className="about-photo">
            <Image
              src="/images/ayyan.webp"
              alt="Ayyan outdoors in a blue striped shirt"
              width={960}
              height={1280}
              sizes="(min-width: 960px) 260px, 65vw"
            />
          </Reveal>
          <Reveal className="about-copy">
            <SectionLabel>ABOUT ME</SectionLabel>
            <h2 id="about-heading">
              Ayyan Anwar<span>.</span>
            </h2>
            <p>{profile.about}</p>
            <SocialLinks />
          </Reveal>
          <Reveal className="about-facts">
            <div>
              <GraduationCap />
              <p>
                <strong>Computer Science &amp; Engineering</strong>
                <span>Final-year student at Sahyadri.</span>
              </p>
            </div>
            <div>
              <FlaskConical />
              <p>
                <strong>Development &amp; research</strong>
                <span>Applications, automation, and simulation.</span>
              </p>
            </div>
            <div>
              <MapPin />
              <p>
                <strong>Mangaluru, India</strong>
                <span>Studying and building software.</span>
              </p>
            </div>
          </Reveal>
        </section>
        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-heading"
        >
          <div className="section-shell contact-grid">
            <Reveal className="contact-copy">
              <SectionLabel>GET IN TOUCH</SectionLabel>
              <h2 id="contact-heading">
                What are you <span>building?</span>
              </h2>
              <p>
                A project, an opportunity, or a problem to solve. Tell me what
                you have in mind.
              </p>
              <div className="direct-contact">
                <a href={"mailto:" + profile.email}>
                  <Mail size={21} />
                  {profile.email}
                </a>
                <a href={profile.phoneHref}>
                  <Phone size={21} />
                  {profile.phone}
                </a>
              </div>
            </Reveal>
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="footer section-shell">
        <a href="#top" className="wordmark" aria-label="Back to top">
          ayyan<span>.</span>
        </a>
        <nav aria-label="Footer navigation">
          {nav.map((n) => (
            <a key={n.id} href={"#" + n.id}>
              {n.name}
            </a>
          ))}
        </nav>
        <p>© 2026 Ayyan Anwar.</p>
      </footer>
    </MotionConfig>
  );
}
