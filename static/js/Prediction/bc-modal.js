const MODEL_INFO = {};
document.addEventListener("DOMContentLoaded", function () {
    const modal   = document.getElementById("bc-modal");
    const titleEl = document.getElementById("bc-title");
    const bodyEl  = document.getElementById("bc-body");
    if (!modal || !titleEl || !bodyEl) {
    console.warn("bc-modal / bc-title / bc-body not found in DOM.");
    return;
    }
    function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
    function renderBC(key) {
    const cfg = MODEL_INFO[key];
    if (!cfg) return;
    titleEl.textContent = cfg.title || "Model info";
    const sectionsHTML = (cfg.sections || []).map(sec => {
        const heading = sec.heading ? `<h3 class="bc-h3">${escapeHtml(sec.heading)}</h3>` : "";
        const introHTML = (sec.intro || [])
        .map(line => `<p class="bc-p">${escapeHtml(line)}</p>`)
        .join("");
        const bulletsHTML = (sec.bulletsHtml && sec.bulletsHtml.length)
        ? `<ul class="bc-list">${sec.bulletsHtml.map(h => `<li>${h}</li>`).join("")}</ul>`
        : (sec.bullets && sec.bullets.length)
            ? `<ul class="bc-list">${sec.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
            : "";
        return `<div class="bc-section">${heading}${introHTML}${bulletsHTML}</div>`;
    }).join("");
    bodyEl.innerHTML = sectionsHTML;
    }
    document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bc-open]");
    if (!btn) return;
    const key = btn.getAttribute("data-bc-open");
    renderBC(key);
    if (typeof modal.showModal === "function") {
        modal.showModal();
    } else {
        modal.setAttribute("open", "open");
    }
    });
    document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-bc-close]")) return;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
    });
    modal.addEventListener("click", (e) => {
    if (e.target !== modal) return;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
    });
});
