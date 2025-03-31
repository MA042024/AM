function LabelSelectionColor() {
    const radios = document.querySelectorAll('input[name="Sheet"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            radios.forEach(r => {
                const label = r.parentNode;
                label.classList.remove('selected');
            });
            const selectedLabel = this.parentNode;
            selectedLabel.classList.add('selected');
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    LabelSelectionColor();
});

function getRootNodeName(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
    const rootNode = xmlDoc.documentElement;
    return rootNode ? rootNode.nodeName : null;
}

// A finished step drops its button: the status panel below it is the record of
// what happened, so leaving a dead grey button behind only adds noise.
function completeStep(buttonId) {
    const button = document.getElementById(buttonId);
    button.disabled = true;
    button.style.display = "none";
}

// A failed step keeps its button so the action can be retried without a reload.
function reopenStep(buttonId) {
    const button = document.getElementById(buttonId);
    button.disabled = false;
    button.style.display = "block";
}

function resetSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.innerHTML = "";
    section.className = "";
    section.style.display = "none";
}

function UploadExcel() {
    document.getElementById("FileExtName").textContent = `Excel File Uploaded`;
    document.getElementById("ButtonE").disabled = false;
    document.getElementById("ButtonE").style.display = "block";
    document.querySelectorAll('input[name="Sheet"]').forEach(function(radio) {radio.disabled = false;});
    resetSection("ExtractionSection");
    document.getElementById("ButtonV").style.display = "none";
    document.getElementById("ButtonV").disabled = false;
    resetSection("ValidationSection");
    document.getElementById("ButtonS").style.display = "none";
    document.getElementById("ButtonS").disabled = false;
    resetSection("SaveSection");
    resetWorkspaceSection();
}
