type Theme = "light" | "dark";
type Point = { x: number; y: number; t: number };

declare global {
  interface Window {
    emailjs: {
      send: (
        serviceId: string,
        templateId: string,
        templateParams: Record<string, string>,
      ) => Promise<unknown>;
    };
  }
}

const root = document.documentElement;
const body = document.body;
const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
};

const store = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};
const load = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Headline: split into letters ("Kim." rises as one piece) ---------- */
const h1 = $("h1");
let letterIndex = 0;
Array.from(h1.childNodes).forEach((node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const frag = document.createDocumentFragment();
    (node.textContent ?? "")
      .replace(/\s+/g, " ")
      .trimStart()
      .split("")
      .forEach((char) => {
        const span = document.createElement("span");
        span.className = "l";
        span.setAttribute("aria-hidden", "true");
        span.style.setProperty("--i", String(letterIndex++));
        span.innerHTML = char === " " ? "&nbsp;" : char;
        frag.appendChild(span);
      });
    h1.replaceChild(frag, node);
  } else if (node instanceof HTMLElement) {
    node.classList.add("l");
    node.setAttribute("aria-hidden", "true");
    node.style.setProperty("--i", String(letterIndex++));
  }
});

const portraitFrame = document.querySelector<HTMLElement>(".portrait");
const portraitPhoto =
  document.querySelector<HTMLImageElement>(".portrait-photo");
if (portraitFrame && portraitPhoto) {
  const showPortrait = (): void => portraitFrame.classList.remove("is-loading");
  if (portraitPhoto.complete && portraitPhoto.naturalWidth > 0) showPortrait();
  else portraitPhoto.addEventListener("load", showPortrait, { once: true });
}

/* ---------- Loader: boot log + percentage ---------- */
const boot = $("boot");
const bootLog = $("bootlog");
const barFill = $("bar").firstElementChild as HTMLElement;
const pct = $("pct");
const bootLines: string[] = [
  "Checking work…",
  "[ ✓ ] react, typescript ........ ready",
  "[ ✓ ] tailwind ................... ready",
  "[ ✓ ] teaching experience ........ loaded",
  "[ ✓ ] running shoes .............. laced",
];
const BOOT_DURATION = 2000;
let bootStart = 0;
let linesShown = 0;
let bootEnded = false;

function endBoot(): void {
  if (bootEnded) return;
  bootEnded = true;
  boot.classList.add("done");
  setTimeout(() => body.classList.add("go"), 350);
}

function bootTick(ts: number): void {
  if (bootEnded) return;
  if (!bootStart) bootStart = ts;
  const p = Math.min(1, (ts - bootStart) / BOOT_DURATION);
  const eased = 1 - Math.pow(1 - p, 2);
  pct.textContent = `${Math.round(eased * 100)}%`;
  barFill.style.width = `${eased * 100}%`;
  while (linesShown < bootLines.length && p >= linesShown / bootLines.length) {
    bootLog.innerHTML +=
      (linesShown ? "\n" : "") +
      bootLines[linesShown].replace("✓", '<span class="ok">✓</span>');
    linesShown++;
  }
  if (p < 1) requestAnimationFrame(bootTick);
  else setTimeout(endBoot, 250);
}

$("skip").addEventListener("click", endBoot);
if (reduceMotion) {
  boot.style.display = "none";
  bootEnded = true;
  body.classList.add("go");
} else {
  requestAnimationFrame(bootTick);
}

/* ---------- Skills marquee ---------- */
const skills: string[] = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Redux",
  "Tailwind CSS",
  "HTML5",
  "CSS3",
  "Vite",
  "Node.js",
  "Express",
  "Firebase",
  "PostgreSQL",
  "Figma",
  "VS Code",
];

function buildRow(list: string[], extraClass: string): HTMLDivElement {
  const row = document.createElement("div");
  row.className = `row ${extraClass}`.trim();
  row.innerHTML = [...list, ...list]
    .map((s) => `<span class="chip">${s}</span>`)
    .join("");
  return row;
}
$("m1").appendChild(buildRow(skills, ""));
$("m2").appendChild(buildRow([...skills].reverse(), "r"));

/* ---------- Projects ---------- */
type Project = {
  image: string;
  imageAlt: string;
  title: string;
  technologies: string;
  description: string;
  github: string;
  website: string;
};

const portfolioProjects: Project[] = [
  {
    image: new URL(
      "./Pimages/TeacherInterventionDashboard.png",
      import.meta.url,
    ).href,
    imageAlt: "Teacher Intervention Dashboard",
    title: "Intervention Dashboard",
    technologies: "Next.js, TypeScript, Tailwind, Vitest",
    description:
      "A dashboard that flags students needing intervention from their assessment data. Showcasing a testing page with Vitest.",
    github: "https://github.com/kmb1122/Teacher-Intervention-Dashboard",
    website: "https://teacher-intervention-dashboard.vercel.app/",
  },
  {
    image: new URL("./Pimages/Summarist-Internship.png", import.meta.url).href,
    imageAlt: "Summarist Internship Project",
    title: "Summarist Internship",
    technologies: "HTML, CSS, TypeScript, React, Next.js, Firestore",
    description:
      "Showcases Firebase Authentication, Firestore, an audio player, and Stripe payments.",
    github: "https://github.com/kmb1122/Summarist-Internship",
    website: "https://summarist-internship-kohl.vercel.app/",
  },
  {
    image: new URL("./Pimages/Skinstric.png", import.meta.url).href,
    imageAlt: "Skinstric Internship Project",
    title: "Skinstric Internship",
    technologies: "HTML, CSS, TypeScript, React, Next.js, GSAP animations",
    description:
      "Boasts a processing time of less than 2 minutes while showcasing CSS and GSAP animations.",
    github: "https://github.com/kmb1122/Skinstric-Internship",
    website: "https://skinstric-internship-peach.vercel.app/",
  },
  {
    image: new URL("./Pimages/FES-Internship.png", import.meta.url).href,
    imageAlt: "Frontend Simplified Internship Project",
    title: "Internship with FES",
    technologies: "HTML, CSS, JavaScript, React, Node",
    description:
      "A project with carousels, loading states, and dynamic routing.",
    github: "https://github.com/kmb1122/kim-internship",
    website: "https://kim-internship-phi.vercel.app/",
  },
  {
    image: new URL("./Pimages/MovieSearch.png", import.meta.url).href,
    imageAlt: "Movie Search API Project",
    title: "Movie Search API",
    technologies: "HTML, CSS, JavaScript, React",
    description:
      "Fetches movie data from two different APIs, with loading states, CSS animations, and sorting.",
    github: "https://github.com/kmb1122/MovieSearchProject",
    website: "https://kmb1122.github.io/MovieSearchProject/",
  },
  {
    image: new URL("./Pimages/Project-Library.png", import.meta.url).href,
    imageAlt: "Library Project",
    title: "Library React Project",
    technologies: "HTML, CSS, JavaScript, React",
    description:
      "Built with Create React App, featuring dynamic routing, sorting, and cart functionality.",
    github: "https://github.com/kmb1122/Library-React-Project",
    website: "https://library-react-project-xi.vercel.app/",
  },
];

const projectGrid = $("projectList");

function createProjectCard(project: Project, index: number): HTMLElement {
  const card = document.createElement("article");
  card.className = "proj";

  const image = document.createElement("img");
  image.className = "proj-image";
  image.src = project.image;
  image.alt = project.imageAlt;
  image.loading = "lazy";
  image.decoding = "async";

  const number = document.createElement("div");
  number.className = "n";
  number.textContent = String(index + 1);

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const stack = document.createElement("div");
  stack.className = "stack";
  stack.textContent = project.technologies;

  const links = document.createElement("div");
  links.className = "project-links";
  [
    { label: "GitHub", href: project.github },
    { label: "Live demo", href: project.website },
  ].forEach(({ label, href }) => {
    const link = document.createElement("a");
    link.className = "btn";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    links.appendChild(link);
  });

  card.append(image, number, title, description, stack, links);
  return card;
}

portfolioProjects.forEach((project, index) => {
  projectGrid.appendChild(createProjectCard(project, index));
});

/* ---------- Theme toggle ---------- */
const themeBtn = $<HTMLButtonElement>("themeBtn");
const prefersDark = matchMedia("(prefers-color-scheme: dark)");

function setTheme(mode: Theme): void {
  root.setAttribute("data-theme", mode);
  themeBtn.setAttribute("aria-pressed", String(mode === "dark"));
  themeBtn.setAttribute(
    "aria-label",
    mode === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
}
const savedTheme = load("kbTheme") as Theme | null;
setTheme(savedTheme ?? (prefersDark.matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => {
  const next: Theme =
    root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
  store("kbTheme", next);
});

/* ---------- Scroll: progress bar, timeline fill, active nav ---------- */
const timeline = $("log");
const timelineItems = timeline.querySelectorAll<HTMLLIElement>("li");
const navLinks = document.querySelectorAll<HTMLAnchorElement>("nav a");
const sectionIds = ["about", "skills", "work", "contact"];

function onScroll(): void {
  const max = root.scrollHeight - innerHeight || 1;
  $("prog").style.transform = `scaleX(${scrollY / max})`;

  const rect = timeline.getBoundingClientRect();
  const progress = Math.max(
    0,
    Math.min(1, (innerHeight * 0.7 - rect.top) / rect.height),
  );
  timeline.style.setProperty("--tl", String(progress));
  timelineItems.forEach((li, i) => {
    li.classList.toggle(
      "lit",
      progress >= i / (timelineItems.length - 0.4) - 0.01,
    );
  });

  let current = "";
  sectionIds.forEach((id) => {
    if ($(id).getBoundingClientRect().top < innerHeight * 0.4) current = id;
  });
  navLinks.forEach((a) =>
    a.classList.toggle("on", a.getAttribute("href") === `#${current}`),
  );
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Glowing dot trail ---------- */
if (!reduceMotion) {
  const canvas = $<HTMLCanvasElement>("trail");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const LIFE = 1100; // ms each dot lasts
    const SPACING = 22; // px between dots
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let points: Point[] = [];
    let last: { x: number; y: number } | null = null;
    let head: Point | null = null;
    let running = false;
    let w = 0;
    let h = 0;

    const resize = (): void => {
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const orb = (
      x: number,
      y: number,
      r: number,
      alpha: number,
      color: string,
    ): void => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(0.35, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (): void => {
      ctx.clearRect(0, 0, w, h);
      const color =
        getComputedStyle(root).getPropertyValue("--ac").trim() || "#12b5ad";
      const now = performance.now();
      points = points.filter((p) => now - p.t < LIFE);
      for (const p of points) {
        const a = 1 - (now - p.t) / LIFE;
        orb(p.x, p.y, 8 + 10 * a, 0.55 * a, color);
      }
      if (head && now - head.t < LIFE) {
        const k = 1 - (now - head.t) / LIFE;
        orb(head.x, head.y, 46 * (0.6 + 0.4 * k), 0.22 * k, color); // soft halo
        orb(head.x, head.y, 10, 0.8 * k, color); // bright core
      }
      ctx.globalAlpha = 1;
      if (points.length || (head && now - head.t < LIFE))
        requestAnimationFrame(frame);
      else running = false;
    };

    addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        const now = performance.now();
        head = { x: e.clientX, y: e.clientY, t: now };
        if (
          !last ||
          Math.hypot(e.clientX - last.x, e.clientY - last.y) >= SPACING
        ) {
          points.push({ x: e.clientX, y: e.clientY, t: now });
          last = { x: e.clientX, y: e.clientY };
        }
        if (!running) {
          running = true;
          requestAnimationFrame(frame);
        }
      },
      { passive: true },
    );
  }
}

/* ---------- Contact form ---------- */
$<HTMLFormElement>("f").addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  const sent = $("sent");
  const data = new FormData(form);
  const name = String(data.get("name") ?? "");
  const email = String(data.get("email") ?? "");
  const msg = String(data.get("msg") ?? "");

  if (submitButton) submitButton.disabled = true;
  sent.textContent = "Sending your message...";

  try {
    await window.emailjs.send("service_mbp1cxn", "template_neqjd78", {
      user_name: name,
      user_email: email,
      message: msg,
    });
    form.reset();
    sent.textContent = "Thank you! I look forward to speaking with you soon.";
  } catch (error) {
    console.error("EmailJS failed to send the contact form:", error);
    sent.textContent =
      "Sorry, your message could not be sent. Please try again later.";
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
