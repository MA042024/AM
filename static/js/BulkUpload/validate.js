// Validation Function
function Validate() {
    document.getElementById("ButtonV").disabled = true;
    document.getElementById("ValidationSection").style.display = "block";
    document.getElementById("ValidationSection").className = "status-panel";
    document.getElementById("ValidationSection").innerHTML =
        `<div id="ValidationPending" class="status-summary status-summary--pending">
            <span class="spinner"></span> Validating records, please wait...
        </div>`;
    if (Object.keys(Records).length === 0) {
        alert("No Records found. Please upload an Excel file first.");
        document.getElementById("ValidationSection").style.display = "none";
        reopenStep("ButtonV");
        return;
    }
    const keys = Object.keys(Records);
    const batchSize = 100;
    let validFilesCount = 0;
    let invalidFilesCount = 0;
    function sendBatch(startIndex) {
        const batch = keys.slice(startIndex, startIndex + batchSize);
        const records = [];
        batch.forEach((fileName) => {
            const xmlContent = Records[fileName];
            const rootNodeName = getRootNodeName(xmlContent);
            const templateId = Testid(rootNodeName);
            if (!templateId) {
                invalidFilesCount++;
                appendInvalidRow(fileName, `Test ID not found for root node '${rootNodeName}'`);
                return;
            }
            records.push({ file_name: fileName, xml_dt: xmlContent, template_id: templateId });
        });

        function proceed() {
            if (startIndex + batchSize < keys.length) {
                sendBatch(startIndex + batchSize);
            } else {
                finalizeValidation(validFilesCount, invalidFilesCount, keys.length);
            }
        }

        if (records.length === 0) {
            proceed();
            return;
        }

        $.ajax({
            url: '/curate/validate-record/',
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            contentType: 'application/json',
            data: JSON.stringify({ records: records }),
            dataType: 'json',
            success: function (response) {
                (response.results || []).forEach((result) => {
                    if (result.errors) {
                        invalidFilesCount++;
                        appendInvalidRow(result.file_name, result.errors);
                    } else {
                        validFilesCount++;
                    }
                });
                proceed();
            },
            error: function (xhr) {
                let errorMessage = "An error occurred during validation.";
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    if (errorData.errors) errorMessage = errorData.errors.join("<br>");
                } catch (e) {
                    errorMessage = "Failed to parse error response: " + xhr.responseText;
                }
                records.forEach((record) => {
                    invalidFilesCount++;
                    appendInvalidRow(record.file_name, errorMessage);
                });
                proceed();
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
            section.classList.add("status-panel--success", "status-panel--flat");
            summary.innerHTML = `<span class="status-icon">&#10003;</span> All ${total} records are valid.`;
            completeStep("ButtonV");
            document.getElementById("WorkspaceSection").style.display = "flex";
            document.getElementById("ButtonS").style.display = "block";
            loadWorkspaces();
        } else {
            section.classList.add("status-panel--error");
            summary.innerHTML = `<span class="status-icon">&#9888;</span> ${invalidCount} of ${total} records are invalid. Please review your Excel sheet.`;
            reopenStep("ButtonV");
        }
        section.prepend(summary);
    }
    sendBatch(0);
}
