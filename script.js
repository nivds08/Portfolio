const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
const roles = ["Developer", "Designer", "Creator"];
const typingEl = document.getElementById("typing");
let ri = 0, ci = 0, del = false;

function tickType() {
  if (!motion) { typingEl.textContent = roles[0]; return; }
  const w = roles[ri];
  typingEl.textContent = del ? w.slice(0, ci--) : w.slice(0, ++ci);
  if (!del && ci === w.length) setTimeout(() => (del = true, tickType()), 1200);
  else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(tickType, 400); }
  else setTimeout(tickType, del ? 50 : 90);
}
tickType();

document.querySelectorAll(".reveal").forEach((el) => {
  new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add("is-visible"), { threshold: 0.15 }).observe(el);
});
if (!motion) document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));

const sections = [...document.querySelectorAll(".section")];
const links = [...document.querySelectorAll(".nav-link")];
window.addEventListener("scroll", () => {
  const y = scrollY + 120;
  const cur = sections.findLast((s) => s.offsetTop <= y) || sections[0];
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${cur.id}`));
}, { passive: true });

document.querySelector(".skills-list").addEventListener("click", (e) => {
  const chip = e.target.closest(".skill-chip");
  if (!chip) return;
  document.querySelectorAll(".skill-chip").forEach((c) => c.classList.toggle("is-active", c === chip));
  const f = chip.dataset.filter;
  document.querySelectorAll(".project-card").forEach((card) => {
    const tags = card.dataset.tags.split(" ");
    card.classList.toggle("is-hidden", f !== "all" && !tags.includes(f));
  });
});
