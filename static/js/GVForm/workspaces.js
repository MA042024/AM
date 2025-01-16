// Workspace picker inside the Save confirmation popup. A custom dropdown
// rather than a native <select> — the browser's own option list can't be
// restyled to match the rest of the page (it renders with the OS's default
// highlight and arrow).
let GVWorkspacesLoaded = false;
const GVWorkspaceState = { id: "", label: "Keep private (no workspace)" };

function buildGVWorkspaceOption(value, label, isSelected) {
    const li = document.createElement("li");
    li.className = "ws-dropdown-option" + (isSelected ? " selected" : "");
    li.textContent = label;
    li.dataset.value = value;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", isSelected ? "true" : "false");
    li.addEventListener("click", () => selectGVWorkspace(value, label));
    return li;
}

function selectGVWorkspace(value, label) {
    GVWorkspaceState.id = value;
    GVWorkspaceState.label = label;
    document.querySelector("#confirmationWorkspaceToggle .ws-dropdown-value").textContent = label;
    document.querySelectorAll("#confirmationWorkspaceOptions .ws-dropdown-option").forEach(opt => {
        const isSelected = opt.dataset.value === value;
        opt.classList.toggle("selected", isSelected);
        opt.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    closeGVWorkspaceDropdown();
}

function loadGVWorkspaces() {
    if (GVWorkspacesLoaded) return;
    GVWorkspacesLoaded = true;
    const list = document.getElementById("confirmationWorkspaceOptions");
    list.innerHTML = "";
    list.appendChild(buildGVWorkspaceOption("", "Keep private (no workspace)", true));
    fetch('/bulkupload/workspaces/', { credentials: 'same-origin' })
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(data => {
            (data.workspaces || []).forEach(ws => {
                const label = ws.is_public ? `${ws.title} (public)` : ws.title;
                list.appendChild(buildGVWorkspaceOption(ws.id, label, false));
            });
        })
        .catch(() => { GVWorkspacesLoaded = false; });
}

function openGVWorkspaceDropdown() {
    document.getElementById("confirmationWorkspaceDropdown").classList.add("open");
    document.getElementById("confirmationWorkspaceToggle").setAttribute("aria-expanded", "true");
}

function closeGVWorkspaceDropdown() {
    document.getElementById("confirmationWorkspaceDropdown").classList.remove("open");
    document.getElementById("confirmationWorkspaceToggle").setAttribute("aria-expanded", "false");
}

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById("confirmationWorkspaceToggle");
    if (!toggle) return;
    toggle.addEventListener("click", function() {
        document.getElementById("confirmationWorkspaceDropdown").classList.contains("open")
            ? closeGVWorkspaceDropdown() : openGVWorkspaceDropdown();
    });
    document.addEventListener("click", function(e) {
        if (!document.getElementById("confirmationWorkspaceDropdown").contains(e.target)) closeGVWorkspaceDropdown();
    });
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeGVWorkspaceDropdown();
    });
});

function getGVWorkspaceId() {
    return GVWorkspaceState.id;
}

function getGVWorkspaceLabel() {
    return GVWorkspaceState.id ? GVWorkspaceState.label : "";
}
