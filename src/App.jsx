import { useEffect, useState } from "react";
import { Terminal, Mail, Phone, MapPin, ArrowRight, ExternalLink, ShieldCheck, FileText } from "lucide-react";

const HOPS = [
  { id: "hop-0", label: "origin" },
  { id: "hop-1", label: "about" },
  { id: "hop-2", label: "skills" },
  { id: "hop-3", label: "projects" },
  { id: "hop-4", label: "log" },
  { id: "hop-5", label: "contact" },
];

const TRACE_ROWS = [
  { hop: 1, host: "about.brian.dev", ms: "0.4 ms", target: "hop-1" },
  { hop: 2, host: "skills.brian.dev", ms: "0.9 ms", target: "hop-2" },
  { hop: 3, host: "projects.brian.dev", ms: "1.1 ms", target: "hop-3" },
  { hop: 4, host: "log.brian.dev", ms: "0.7 ms", target: "hop-4" },
  { hop: 5, host: "contact.brian.dev", ms: "0.3 ms", target: "hop-5" },
];

const SKILLS = [
  { dest: "Landing pages & marketing sites", via: "HTML, CSS, JavaScript, responsive / mobile-first layouts", metric: "\u25CF\u25CF\u25CF\u25CF\u25CB" },
  { dest: "Web interfaces & small apps", via: "React, JavaScript, MongoDB", metric: "\u25CF\u25CF\u25CF\u25CB\u25CB" },
  { dest: "Automation & scripting", via: "Python, Bash", metric: "\u25CF\u25CF\u25CF\u25CF\u25CB" },
  { dest: "Multi-language development", via: "Java, C++, C#, Kotlin, SQL", metric: "\u25CF\u25CF\u25CF\u25CB\u25CB" },
  { dest: "Technical & content writing", via: "Documentation, articles, editing", metric: "\u25CF\u25CF\u25CF\u25CF\u25CB" },
  { dest: "Networking & security", via: "TCP/IP, firewalls, IDS/IPS, monitoring", metric: "\u25CF\u25CF\u25CF\u25CF\u25CF" },
];

const SERVICES = [
  {
    title: "Landing pages",
    desc: "Fast, responsive pages for offers, launches, waitlists, and small campaigns.",
    tags: ["Copy-aware layout", "Mobile first", "Clear CTA"],
  },
  {
    title: "Small business sites",
    desc: "Simple multi-page websites for local services that need credibility and easy contact.",
    tags: ["Home / About / Services", "Contact flow", "Deployment help"],
  },
  {
    title: "Technical content",
    desc: "Documentation, articles, and explainers shaped by hands-on network and systems experience.",
    tags: ["Docs", "Articles", "Editing"],
  },
];

const AI_PROJECT = {
  status: "prototype",
  title: "AI Personalized Outreach Workflow",
  desc: "Python prototype for structured prompt inputs, optional LLM-generated drafts, deterministic evaluation checks, and mandatory human review.",
  outcome: "Demonstrates validation, JSON output handling, a testing suite, and an approval gate. Live API use requires configuration.",
  stack: "Python · LLM API · JSON · unittest",
  links: [{ label: "Source & tests", href: "https://github.com/Shayne874/brian-portfolio/tree/feature/ai-workflow-portfolio/ai-outreach", icon: Terminal }],
};

const PROJECTS = [
  AI_PROJECT,
  {
    status: "delivered",
    title: "This portfolio",
    desc: "A React + Vite site themed around traceroute and circuit routing - built to show layout, typography, and responsive design in practice.",
    outcome: "Designed and shipped a distinctive personal brand system around network routing.",
    stack: "React \u00B7 Vite \u00B7 CSS",
    links: [{ label: "Source", href: "https://github.com/Shayne874/brian-portfolio", icon: Terminal }],
  },
  {
    status: "delivered",
    title: "Network automation tool",
    desc: "A Python tool that automates switch configuration backups, cutting manual network administration effort.",
    outcome: "Reduced repetitive admin work and improved backup consistency.",
    stack: "Python",
    links: [{ label: "Source", href: "https://github.com/shayne874", icon: Terminal }],
  },
  {
    status: "delivered",
    title: "Novel website",
    desc: "A deployed website for presenting a novel project with a polished public-facing layout.",
    outcome: "Turned a writing project into a live web presence that visitors can open and explore.",
    stack: "HTML \u00B7 CSS \u00B7 JavaScript",
    links: [{ label: "Live demo", href: "https://novel-kqbl.vercel.app/", icon: ExternalLink }],
  },
  {
    status: "delivered",
    title: "Landing page",
    desc: "A conversion-focused landing or waitlist page with hero, CTA, and email capture. Link added once deployed.",
    outcome: "Focused on message clarity, trust, and one obvious next step.",
    stack: "HTML \u00B7 CSS \u00B7 JavaScript",
    links: [{ label: "Live demo", href: "https://shayne874.github.io/landing-page/", icon: ExternalLink }],
  },
];

const PROOF_ITEMS = [
  { value: "40%", label: "Network throughput improvement through analysis and tuning" },
  { value: "Python + Bash", label: "Automation scripts for logs and configuration backups" },
  { value: "Remote-ready", label: "Available for focused part-time freelance delivery" },
];

const LOG_ENTRIES = [
  {
    when: "2024",
    role: "Network Engineer",
    org: "Biometrics Technology Limited",
    bullets: [
      "Wrote Python and Bash scripts to automate log analysis and configuration backups.",
      "Analysed traffic and performance data to diagnose issues and tune systems.",
      "Improved network throughput by 40% through targeted analysis and tuning.",
      "Produced clear technical documentation for configurations and troubleshooting.",
    ],
  },
  {
    when: "2023",
    role: "Shipping Associate",
    org: "American Embassy",
    bullets: [
      "Maintained accurate shipment records and documentation.",
      "Coordinated tasks independently and as part of a team in a structured environment.",
    ],
  },
  {
    when: "2019\u201320",
    role: "Operations & Technical Support",
    org: "MEBS Global Reach LTD",
    bullets: [
      "Provided technical support and resolved process issues.",
      "Collaborated with teams to maintain consistent service delivery.",
    ],
  },
];

const CERTS = [
  "CCNA",
  "Cisco Cybersecurity Certification",
  "Git & GitHub",
  "CrowdStrike Certified",
  "AWS Certified",
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/.:-";

function ScrambleText({ as: Tag = "span", children, className = "" }) {
  const label = String(children);
  const [display, setDisplay] = useState(() => scramble(label, 0));
  const [run, setRun] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 24;
    const timer = window.setInterval(() => {
      frame += 1;
      setDisplay(scramble(label, frame / totalFrames));

      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(label);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [label, run]);

  return (
    <Tag
      className={`scramble-text ${className}`.trim()}
      aria-label={label}
      onMouseEnter={() => setRun((value) => value + 1)}
    >
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}

function scramble(text, progress) {
  const revealTo = Math.floor(text.length * progress);

  return text
    .split("")
    .map((char, index) => {
      if (char === " " || index < revealTo) return char;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    })
    .join("");
}

export default function App() {
  const [active, setActive] = useState("hop-0");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    HOPS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">
      <nav className="hop-rail" aria-label="Section navigation">
        {HOPS.map((hop, i) => (
          <div key={hop.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 && <span className="rail-line" aria-hidden="true" />}
            <button
              className={`hop-dot${active === hop.id ? " active" : ""}`}
              data-label={`${i} \u00B7 ${hop.label}`}
              aria-label={`Go to ${hop.label} section`}
              aria-current={active === hop.id}
              onClick={scrollTo(hop.id)}
            />
          </div>
        ))}
      </nav>

      <header id="hop-0" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Origin &mdash; Nairobi, Kenya</p>
            <h1 className="name">
              <ScrambleText>Brian Shayne</ScrambleText>
            </h1>
            <p className="tagline">
              Software and network engineer with Python automation experience, now building tested AI workflow prototypes.
            </p>
            <p className="sub">
              I design and build landing pages, small business websites, and clear technical content &mdash;
              backed by years of troubleshooting real networks and automating the boring parts with Python and Bash.
            </p>
            <div className="cta-row">
              <a className="btn" href="#hop-3" onClick={scrollTo("hop-3")}>
                View work <ArrowRight size={14} />
              </a>
              <a className="btn ghost" href="mailto:brianshayne350@gmail.com">
                <Mail size={14} /> Email me
              </a>
              <a
                className="btn ghost"
                href="/cv/Brian_Shayne_CV.pdf"
                target="_blank"
                rel="noreferrer"
                title="CV"
              >
                <FileText size={14} /> CV
              </a>
            </div>

            <div className="signal-strip" aria-label="Portfolio proof points">
              {PROOF_ITEMS.map((item) => (
                <div className="signal" key={item.value}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="trace">
              <div className="trace-head">
                <span>$</span> traceroute --to=brian.dev
              </div>
              {TRACE_ROWS.map((row) => (
                <a
                  key={row.hop}
                  href={`#${row.target}`}
                  className="trace-row"
                  onClick={scrollTo(row.target)}
                >
                  <span className="hop-num">{row.hop}</span>
                  <span className="hop-host">{row.host}</span>
                  <span className="hop-ms">{row.ms}</span>
                </a>
              ))}
            </div>
          </div>

          <aside className="hero-portrait" aria-label="Portrait of Brian Shayne">
            <img src="/images/photo.jpeg" alt="Brian Shayne" />
            <div className="portrait-caption">
              <span>live node</span>
              <strong>brian.shayne</strong>
            </div>
          </aside>
        </div>
      </header>

      <section id="hop-1" className="section">
        <div className="container">
          <p className="eyebrow">Hop 01 / About</p>
          <ScrambleText as="h2" className="section-title">From routing packets to shipping pages</ScrambleText>
          <div className="about-grid">
            <div>
              <p>
                I&rsquo;m a software engineering graduate who spent the last few years deep in enterprise
                networks &mdash; configuring routers and switches, monitoring traffic, and writing Python
                and Bash scripts to automate the repetitive parts of the job.
              </p>
              <p>
                That background turned out to be great training for web development: both fields reward
                people who can read a system carefully, find where it breaks, and fix it without breaking
                something else. I now bring that same approach to building landing pages, small business
                sites, and writing the documentation and content that goes with them.
              </p>
              <p>
                I&rsquo;m currently available for remote, part-time freelance work &mdash; landing pages,
                small multi-page sites, content writing, and general coding tasks.
              </p>
            </div>
            <dl className="fact-list">
              <div className="fact-row">
                <dt>Based in</dt>
                <dd>Nairobi, Kenya</dd>
              </div>
              <div className="fact-row">
                <dt>Background</dt>
                <dd>Software & network engineering</dd>
              </div>
              <div className="fact-row">
                <dt>Now building</dt>
                <dd>Landing pages & small sites</dd>
              </div>
              <div className="fact-row">
                <dt>Also offering</dt>
                <dd>Technical &amp; content writing</dd>
              </div>
              <div className="fact-row">
                <dt>Availability</dt>
                <dd>Remote, part-time, freelance</dd>
              </div>
              <div className="fact-row">
                <dt>Languages</dt>
                <dd>English, Swahili</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="hop-2" className="section alt">
        <div className="container">
          <p className="eyebrow">Hop 02 / Skills</p>
          <ScrambleText as="h2">Routes I can ship</ScrambleText>
          <p className="lede">
            Practical services backed by a technical foundation, not just a list of tools.
          </p>
          <div className="service-grid">
            {SERVICES.map((service) => (
              <article className="service-card" key={service.title}>
                <ScrambleText as="h3">{service.title}</ScrambleText>
                <p>{service.desc}</p>
                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="route-table">
            <div className="route-head">
              <span>Destination</span>
              <span>Via</span>
              <span>Metric</span>
            </div>
            {SKILLS.map((row) => (
              <div className="route-row" key={row.dest}>
                <span className="dest">{row.dest}</span>
                <span className="via">{row.via}</span>
                <span className="metric" aria-label="proficiency">{row.metric}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="hop-3" className="section">
        <div className="container">
          <p className="eyebrow">Hop 03 / Projects</p>
          <ScrambleText as="h2">Proof of work</ScrambleText>
          <p className="lede">
            Shipped routes first, then the builds currently moving through the pipeline.
          </p>
          <div className="project-grid">
            {PROJECTS.map((project) => (
              <article className="project-card" key={project.title}>
                <span className={`status ${project.status}`}>
                  {project.status === "delivered" ? "Delivered" : project.status === "prototype" ? "Prototype" : "In transit"}
                </span>
                <ScrambleText as="h3">{project.title}</ScrambleText>
                <p>{project.desc}</p>
                <div className="outcome">
                  <span>Outcome</span>
                  <strong>{project.outcome}</strong>
                </div>
                <span className="stack">{project.stack}</span>
                {project.links.length > 0 && (
                  <div className="links">
                    {project.links.map((link) => (
                      <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                        <link.icon size={13} /> {link.label}
                      </a>
                    ))}
                    <a href="#hop-5" onClick={scrollTo("hop-5")}>
                      <ExternalLink size={13} /> Request similar
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="hop-4" className="section alt">
        <div className="container">
          <p className="eyebrow">Hop 04 / Experience</p>
          <ScrambleText as="h2">Connection log</ScrambleText>
          <div className="log">
            {LOG_ENTRIES.map((entry) => (
              <div className="log-entry" key={entry.role + entry.when}>
                <span className="when">{entry.when}</span>
                <div>
                  <ScrambleText as="h3">{entry.role}</ScrambleText>
                  <p className="org">{entry.org}</p>
                  <ul>
                    {entry.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="cert-list">
            <p className="label">Certifications</p>
            <div className="cert-tags">
              {CERTS.map((c) => (
                <span key={c}><ShieldCheck size={12} />{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="hop-5" className="section">
        <div className="container">
          <p className="eyebrow">Hop 05 / Contact &mdash; destination reached</p>
          <ScrambleText as="h2" className="section-title">Open a connection</ScrambleText>
          <div className="contact-grid">
            <a className="contact-card" href="mailto:brianshayne350@gmail.com">
              <span className="label"><Mail size={12} style={{ verticalAlign: "-1px", marginRight: "6px" }} />Email</span>
              <span className="value">brianshayne350@gmail.com</span>
            </a>
            <a className="contact-card" href="tel:+254768488971">
              <span className="label"><Phone size={12} style={{ verticalAlign: "-1px", marginRight: "6px" }} />Phone</span>
              <span className="value">+254 768 488 971</span>
            </a>
            <a className="contact-card" href="https://github.com/shayne874" target="_blank" rel="noreferrer">
              <span className="label"><Terminal size={12} style={{ verticalAlign: "-1px", marginRight: "6px" }} />GitHub</span>
              <span className="value">github.com/shayne874</span>
            </a>
            <div className="contact-card" style={{ cursor: "default" }}>
              <span className="label"><MapPin size={12} style={{ verticalAlign: "-1px", marginRight: "6px" }} />Location</span>
              <span className="value">Nairobi, Kenya (remote)</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          Brian Shayne &middot; built with React &amp; Vite &middot; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
