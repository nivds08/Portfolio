document.documentElement.classList.add("js");

const M = !matchMedia("(prefers-reduced-motion: reduce)").matches;

const t = document.getElementById("typing"),
R = [
  "Neural Networks",
  "Inference",
  "Vision Language Model",
  "Embeddings",
  "Dense Retrieval",
  "Imitation Learning",
  "Transformers",
  "Artificial Intelligence"
];

let ri = 0, ci = 0, del = 0;

(function tick() {
  if (!M) return void (t.textContent = R[0]);

  const w = R[ri];
  const text = del ? w.slice(0, ci--) : w.slice(0, ++ci);

  t.innerHTML = `<strong>${text.charAt(0)}</strong>${text.slice(1)}`;

  if (!del && ci === w.length)
    setTimeout(() => (del = 1, tick()), 1200);

  else if (del && !ci) {
    del = 0;
    ri = (ri + 1) % R.length;
    setTimeout(tick, 400);
  }

  else
    setTimeout(tick, del ? 50 : 90);
})();

const shapes = [...document.querySelectorAll(".shape[data-speed]")],
S = [...document.querySelectorAll(".section")],
L = [...document.querySelectorAll(".nav-link")];

const io = new IntersectionObserver(
  (es) => es.forEach(
    (e) => e.isIntersecting && e.target.classList.add("is-visible")
  ),
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

if (M) (function loop() {
  const y = scrollY;

  shapes.forEach((s) => {
    s.closest(".shape-scene").style.transform =
      `translateY(${y * +s.dataset.speed}px)`;
  });

  const c = S.findLast((sec) => sec.offsetTop <= y + 120) || S[0];

  L.forEach((a) =>
    a.classList.toggle("active", a.hash === "#" + c.id)
  );

  requestAnimationFrame(loop);
})();

else
  document.querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("is-visible"));

document.querySelector(".skills-list").onclick = (e) => {
  const c = e.target.closest(".skill-chip");
  if (!c) return;

  document.querySelectorAll(".skill-chip")
    .forEach((x) => x.classList.toggle("is-active", x === c));

  document.querySelectorAll(".project-card")
    .forEach((card) =>
      card.classList.toggle(
        "is-hidden",
        c.dataset.filter !== "all" &&
        !card.dataset.tags.split(" ").includes(c.dataset.filter)
      )
    );
};