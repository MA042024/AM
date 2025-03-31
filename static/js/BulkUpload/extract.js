// Extraction Function
function ExtractXML() {
    document.getElementById("ButtonE").disabled = true;
    document.getElementById("ButtonE").classList.add("blocked");
    document.querySelectorAll('input[name="Sheet"]').forEach(function(radio) {radio.disabled = true;});
    const section = document.getElementById("ExtractionSection");
    section.style.display = "block";
    section.className = "status-panel";
    section.innerHTML =
    `<div id="ExtractPending" class="status-summary status-summary--pending">
        <span class="spinner"></span> Extracting records, please wait...
    </div>`;
    const fileInput = document.getElementById('excelInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select an Excel file first.");
        return;
    }
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
                section.classList.add("status-panel--success");
                section.innerHTML += `<div class="status-summary"><span class="status-icon">&#10003;</span> Extraction successful — <b>${RecordsCount}</b> record${RecordsCount > 1 ? 's' : ''} extracted.</div>`;
                document.getElementById("ButtonV").style.display = "block";
            } else {
                section.classList.add("status-panel--error");
                section.innerHTML += `<div class="status-summary"><span class="status-icon">&#9888;</span> No records to extract.</div>`;
                document.getElementById("ButtonV").style.display = "none";
            }
        },
        error: function(xhr) {
            document.getElementById("ExtractPending")?.remove();
            section.classList.add("status-panel--error");
            section.innerHTML += `<div class="status-summary"><span class="status-icon">&#9888;</span> ${xhr.responseText}</div>`;
            document.getElementById("ButtonV").style.display = "none";
        }
    });
    document.getElementById("FileExtName").textContent = `Upload AsphaltMine Excel File`;
    document.getElementById('excelInput').value = '';
}
