// Extraction Function
// The file input is cleared after each run so re-picking the same file still
// fires onchange; SelectedFile keeps the file around so a failed extraction
// can be retried without asking the user to browse again.
let SelectedFile = null;

function failExtraction() {
    document.querySelectorAll('input[name="Sheet"]').forEach(function(radio) {radio.disabled = false;});
    document.getElementById("FileExtName").textContent = "Excel File Uploaded";
    document.getElementById("ButtonV").style.display = "none";
    reopenStep("ButtonE");
}

function ExtractXML() {
    document.getElementById("ButtonE").disabled = true;
    document.querySelectorAll('input[name="Sheet"]').forEach(function(radio) {radio.disabled = true;});
    const section = document.getElementById("ExtractionSection");
    section.style.display = "block";
    section.className = "status-panel";
    section.innerHTML =
    `<div id="ExtractPending" class="status-summary status-summary--pending">
        <span class="spinner"></span> Extracting records, please wait...
    </div>`;
    const fileInput = document.getElementById('excelInput');
    const file = fileInput.files[0] || SelectedFile;
    if (!file) {
        alert("Please select an Excel file first.");
        section.style.display = "none";
        document.querySelectorAll('input[name="Sheet"]').forEach(function(radio) {radio.disabled = false;});
        reopenStep("ButtonE");
        return;
    }
    SelectedFile = file;
    const sheet = document.querySelector('input[name="Sheet"]:checked').value;
    const formData = new FormData();
    formData.append('excelFile', file);
    formData.append('sheet', sheet);
    $.ajax({
        url: '/curate/extractxml/',
        type: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(response) {
            Records = response;
            const RecordsCount = Object.keys(Records).length;
            document.getElementById("ExtractPending")?.remove();
            if (RecordsCount > 0) {
                section.classList.add("status-panel--success", "status-panel--flat");
                section.innerHTML += `<div class="status-summary"><span class="status-icon">&#10003;</span> Extraction successful — <b>${RecordsCount}</b> record${RecordsCount > 1 ? 's' : ''} extracted.</div>`;
                completeStep("ButtonE");
                document.getElementById("ButtonV").style.display = "block";
            } else {
                section.classList.add("status-panel--error", "status-panel--flat");
                section.innerHTML += `<div class="status-summary"><span class="status-icon">&#9888;</span> No records to extract.</div>`;
                failExtraction();
            }
        },
        error: function(xhr) {
            document.getElementById("ExtractPending")?.remove();
            section.classList.add("status-panel--error", "status-panel--flat");
            section.innerHTML += `<div class="status-summary"><span class="status-icon">&#9888;</span> ${xhr.responseText}</div>`;
            failExtraction();
        }
    });
    document.getElementById("FileExtName").textContent = `Upload AsphaltMine Excel File`;
    document.getElementById('excelInput').value = '';
}
