// Validation Function
function Validate() {
    document.getElementById("ButtonV").disabled = true;
    document.getElementById("ButtonV").classList.add("blocked");
    document.getElementById("ValidationSection").style.display = "block";
    document.getElementById("ValidationSection").className = "status-panel";
    document.getElementById("ValidationSection").innerHTML =
        `<div id="ValidationPending" class="status-summary status-summary--pending">
            <span class="spinner"></span> Validating records, please wait...
        </div>`;
    if (Object.keys(Records).length === 0) {
        alert("No Records found. Please upload an Excel file first.");
        document.getElementById("ValidationSection").style.display = "none";
        return;
    }
    const keys = Object.keys(Records);
    const batchSize = 5;
    let validFilesCount = 0;
    let invalidFilesCount = 0;
    function sendBatch(startIndex) {
        const batch = keys.slice(startIndex, startIndex + batchSize);
        let promises = [];
        batch.forEach((fileName, i) => {
            const index = startIndex + i;
            const xmlContent = Records[fileName];
            const rootNodeName = getRootNodeName(xmlContent);
            const templateId = Testid(rootNodeName);
            if (!templateId) {
                invalidFilesCount++;
                appendInvalidRow(fileName, `Test ID not found for root node '${rootNodeName}'`);
                return;
            }
            const formData = new FormData();
            formData.append("xml_dt", xmlContent);
            formData.append("template_id", templateId);
            const promise = $.ajax({
                url: '/curate/validate-record/',
                type: 'POST',
                headers: { 'X-CSRFToken': csrftoken },
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) {
                    if (response.errors) {
                        invalidFilesCount++;
                        appendInvalidRow(fileName, response.errors);
                    } else {
                        validFilesCount++;
                    }
                },
                error: function (xhr) {
                    invalidFilesCount++;
                    let errorMessage = "An error occurred during validation.";
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        if (errorData.errors) errorMessage = errorData.errors.join("<br>");
                    } catch (e) {
                        errorMessage = "Failed to parse error response: " + xhr.responseText;
                    }
                    appendInvalidRow(fileName, errorMessage);
                }
            });
            promises.push(promise);
        });
        Promise.all(promises).then(() => {
            if (startIndex + batchSize < keys.length) {
                sendBatch(startIndex + batchSize);
            } else {
                finalizeValidation(validFilesCount, invalidFilesCount, keys.length);
            }
        });
    }

    function appendInvalidRow(fileName, message) {
        const row = document.createElement("div");
        row.className = "status-row status-row--invalid";
        row.innerHTML = `<span class="status-icon">&#9888;</span><div><b>${fileName}</b><div class="status-detail">${message}</div></div>`;
        document.getElementById("ValidationSection").appendChild(row);
    }

    function finalizeValidation(validCount, invalidCount, total) {
        const section = document.getElementById("ValidationSection");
        document.getElementById("ValidationPending")?.remove();
        const summary = document.createElement("div");
        summary.className = "status-summary";
        if (invalidCount === 0) {
            section.classList.add("status-panel--success");
            summary.innerHTML = `<span class="status-icon">&#10003;</span> All ${total} records are valid.`;
            document.getElementById("ButtonS").style.display = "block";
        } else {
            section.classList.add("status-panel--error");
            summary.innerHTML = `<span class="status-icon">&#9888;</span> ${invalidCount} of ${total} records are invalid. Please review your Excel sheet.`;
        }
        section.appendChild(summary);
    }
    sendBatch(0);
}
