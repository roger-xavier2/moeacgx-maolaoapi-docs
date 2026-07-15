const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
const navLinks = [...document.querySelectorAll(".sidebar nav a")];

function preferredTheme() {
  const stored = localStorage.getItem("maolaoapi-docs-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("maolaoapi-docs-theme", theme);
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "切换到浅色模式" : "切换到深色模式",
  );
}

setTheme(preferredTheme());

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

sidebarBackdrop?.addEventListener("click", closeMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll("pre").forEach((pre) => {
  const wrapper = document.createElement("div");
  wrapper.className = "code-block";
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-button";
  button.textContent = "复制";
  button.setAttribute("aria-label", "复制代码");
  wrapper.appendChild(button);

  button.addEventListener("click", async () => {
    const code = pre.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "已复制";
      button.classList.add("copied");
      window.setTimeout(() => {
        button.textContent = "复制";
        button.classList.remove("copied");
      }, 1400);
    } catch {
      button.textContent = "复制失败";
    }
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length === 0) return;
    const activeId = `#${visible[0].target.id}`;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === activeId);
    });
  },
  { rootMargin: "-20% 0px -68% 0px", threshold: 0 },
);

sections.forEach((section) => observer.observe(section));
