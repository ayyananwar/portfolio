// Personal information below was explicitly approved in the conversation.
// Ask Ayyan before adding employers, dates, grades, awards, photos, or resume files.
export const profile = {
  name: "Ayyan Anwar",
  introduction:
    "I build web applications, backend systems, and workflow automations.",
  about:
    "I’m a final-year Computer Science and Engineering student at Sahyadri College of Engineering and Management in Mangaluru. My work spans full-stack development, backend systems, automation, and applied AI. I enjoy turning practical problems into working software.",
  email: "contact@ayyan.tech",
  phone: "+91 6207904901",
  phoneHref: "tel:+916207904901",
  github: "https://github.com/ayyananwar",
  linkedin: "https://www.linkedin.com/in/ayyan-anwar",
};
export const projects = [
  {
    id: "promise",
    number: "01",
    name: "PROMISE",
    category: "Mobile application / Backend",
    headline: "Giving everyday commitments a clear finish.",
    description:
      "A commitment-tracking app built with Flutter, Serverpod, and PostgreSQL.",
    problem:
      "Agreements made in conversation can leave deadlines, progress, and completion unclear.",
    approach:
      "Turn each agreement into a scheduled commitment with a shared timeline and confirmation from both participants.",
    features: [
      "Friend requests",
      "Scheduled commitments",
      "Progress timelines",
      "Change requests",
      "In-app notifications",
      "Two-party completion",
    ],
    stack: ["Flutter", "Dart", "Serverpod", "PostgreSQL"],
    repository: "https://github.com/nabilkhan-01/Promise",
  },
  {
    id: "mdr-sim",
    number: "02",
    name: "MDR-SIM",
    category: "Simulation / Research",
    headline: "Finding sustained contact in noisy signals.",
    description:
      "A simulation study exploring sustained-contact detection from noisy wireless measurements.",
    problem:
      "Noisy wireless observations make sustained interpersonal contact difficult to reconstruct.",
    approach:
      "Generate controlled observations, reconstruct contact sessions, and compare sensing configurations with held-out evaluation.",
    features: [
      "Synthetic observations",
      "Localization and tracking",
      "Model training",
      "Probability calibration",
      "Temporal decoding",
      "Held-out evaluation",
    ],
    stack: ["Simulation", "Machine learning", "Wireless sensing"],
    repository: "https://github.com/ayyananwar/MDR-SIM",
  },
] as const;
export const services = [
  {
    name: "Web applications",
    description: "React interfaces connected to backend services.",
    icon: "web",
  },
  {
    name: "Backend development",
    description: "APIs, databases, and third-party integrations.",
    icon: "backend",
  },
  {
    name: "Workflow automation",
    description: "Connecting tools and reducing repetitive tasks.",
    icon: "workflow",
  },
  {
    name: "AI features",
    description: "Integrating LLM-powered features into applications.",
    icon: "ai",
  },
] as const;
