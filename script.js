const PAGES = ["home", "resume", "projects", "tech", "contact"];
const links = [...document.querySelectorAll(".nav-link")];

function show(id) {
  const page = PAGES.includes(id) ? id : "home";
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("is-active", p.id === page));
  links.forEach((a) => a.classList.toggle("active", a.hash === "#" + page));
}

function go(id) {
  const page = PAGES.includes(id) ? id : "home";
  if (location.hash !== "#" + page) history.pushState({ page }, "", "#" + page);
  show(page);
}

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.hash.slice(1);
  if (!PAGES.includes(id)) return;
  e.preventDefault();
  go(id);
});

window.addEventListener("popstate", () => show(location.hash.slice(1)));
show(location.hash.slice(1) || "home");

document.querySelector(".skills-list").onclick = (e) => {
  const c = e.target.closest(".skill-chip");
  if (!c) return;
  document.querySelectorAll(".skill-chip").forEach((x) => x.classList.toggle("is-active", x === c));
  const f = c.dataset.filter;
  document.querySelectorAll(".project-card").forEach((card) =>
    card.classList.toggle("is-hidden", f !== "all" && !card.dataset.tags.split(" ").includes(f))
  );
};
