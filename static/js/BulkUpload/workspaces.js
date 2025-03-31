// Workspace picker for the Save step. A custom dropdown rather than a native
// <select> — the browser's own option list can't be restyled to match the
// rest of the page (it renders with the OS's default highlight and arrow).
let WorkspacesLoaded = false;
const WorkspaceState = { id: "", label: "Keep private (no workspace)" };

function buildWorkspaceOption(value, label, isSelected) {
    const li = document.createElement("li");
    li.className = "ws-dropdown-option" + (isSelected ? " selected" : "");
    li.textContent = label;
    li.dataset.value = value;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", isSelected ? "true" : "false");
    li.addEventListener("click", () => selectWorkspace(value, label));
    return li;
}

function selectWorkspace(value, label) {
    WorkspaceState.id = value;
    WorkspaceState.label = label;
    document.querySelector("#workspaceToggle .ws-dropdown-value").textContent = label;
    document.querySelectorAll("#workspaceOptions .ws-dropdown-option").forEach(opt => {
        const isSelected = opt.dataset.value === value;
        opt.classList.toggle("selected", isSelected);
        opt.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    closeWorkspaceDropdown();
}

function loadWorkspaces() {
    if (WorkspacesLoaded) return;
    WorkspacesLoaded = true;
    const list = document.getElementById("workspaceOptions");
    list.innerHTML = "";
    list.appendChild(buildWorkspaceOption("", "Keep private (no workspace)", true));
    fetch('/bulkupload/workspaces/', { credentials: 'same-origin' })
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(data => {
            (data.workspaces || []).forEach(ws => {
                const label = ws.is_public ? `${ws.title} (public)` : ws.title;
                list.appendChild(buildWorkspaceOption(ws.id, label, false));
            });
        })
        .catch(() => { WorkspacesLoaded = false; });
}

function openWorkspaceDropdown() {
    const toggle = document.getElementById("workspaceToggle");
    if (toggle.disabled) return;
    document.getElementById("workspaceDropdown").classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
}

function closeWorkspaceDropdown() {
    document.getElementById("workspaceDropdown").classList.remove("open");
    document.getElementById("workspaceToggle").setAttribute("aria-expanded", "false");
}

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById("workspaceToggle");
    if (!toggle) return;
    toggle.addEventListener("click", function() {
        document.getElementById("workspaceDropdown").classList.contains("open")
            ? closeWorkspaceDropdown() : openWorkspaceDropdown();
    });
    document.addEventListener("click", function(e) {
        if (!document.getElementById("workspaceDropdown").contains(e.target)) closeWorkspaceDropdown();
    });
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeWorkspaceDropdown();
    });
});

function getSelectedWorkspaceId() {
    return WorkspaceState.id;
}

function getSelectedWorkspaceLabel() {
    return WorkspaceState.id ? WorkspaceState.label : "";
}

function lockWorkspaceDropdown() {
    document.getElementById("workspaceToggle").disabled = true;
    document.getElementById("WorkspaceSection").classList.add("locked");
    closeWorkspaceDropdown();
}

function unlockWorkspaceDropdown() {
    document.getElementById("workspaceToggle").disabled = false;
    document.getElementById("WorkspaceSection").classList.remove("locked");
}

function resetWorkspaceSection() {
    const section = document.getElementById("WorkspaceSection");
    section.style.display = "none";
    section.classList.remove("locked");
    document.getElementById("workspaceToggle").disabled = false;
    document.getElementById("workspaceOptions").innerHTML = "";
    WorkspacesLoaded = false;
    selectWorkspace("", "Keep private (no workspace)");
}
