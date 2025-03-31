// Save Function
function saveAllRecords() {
    const workspaceId = getSelectedWorkspaceId();
    const workspaceLabel = getSelectedWorkspaceLabel();
    document.getElementById("ButtonS").disabled = true;
    lockWorkspaceDropdown();
    const section = document.getElementById("SaveSection");
    section.style.display = "block";
    section.className = "status-panel";
    section.innerHTML =
        `<div id="SavePending" class="status-summary status-summary--pending">
            <span class="spinner"></span> Saving records, please wait...
        </div>`;
    let savedCount = 0;
    let failedCount = 0;
    const savedIds = [];
    const keys = Object.keys(Records);
    const totalFiles = keys.length;
    const batchSize = 5;

    function saveOne(fileName) {
        const xmlContent = Records[fileName];
        const rootNodeName = getRootNodeName(xmlContent);
        const templateId = Testid(rootNodeName);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
        const measurementCampaignID = xmlDoc.getElementsByTagName("MeasurementCampaignID")[0]?.textContent || "Unknown";
        const organizationName = xmlDoc.getElementsByTagName("OrganizationName")[0]?.textContent || "Unknown";
        const year = xmlDoc.getElementsByTagName("Year")[0]?.textContent || "Unknown";
        let namerecord = `${measurementCampaignID}_${organizationName}_${year}`;
        const formData = {
            xml_data: xmlContent,
            title: namerecord,
            template_id: templateId
        };

        return $.ajax({
            url: '/curate/save-xml-data/',
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            data: formData,
            success: function(response) {
                savedCount++;
                if (response && response.data_id) savedIds.push(response.data_id);
            },
            error: function(xhr) {
                failedCount++;
                let errorMessage = "Failed to save data.";
                if (xhr.status === 403) {
                    errorMessage = "Insufficient permissions";
                }
                appendFailedRow(fileName, errorMessage);
            }
        });
    }

    function saveBatch(startIndex) {
        const batch = keys.slice(startIndex, startIndex + batchSize);
        Promise.all(batch.map((fileName) => saveOne(fileName).catch(() => {}))).then(() => {
            if (startIndex + batchSize < keys.length) {
                saveBatch(startIndex + batchSize);
            } else {
                checkAllSaved();
            }
        });
    }
    saveBatch(0);

    function appendFailedRow(fileName, message) {
        const row = document.createElement("div");
        row.className = "status-row status-row--invalid";
        row.innerHTML = `<span class="status-icon">&#9888;</span><div><b>${fileName}</b><div class="status-detail">${message}</div></div>`;
        section.appendChild(row);
    }

    function checkAllSaved() {
        if (savedCount + failedCount !== totalFiles) return;
        // Records are created private, then moved into the workspace in
        // chunks -- one request per 1700+ records was slow enough to time out.
        if (workspaceId && savedIds.length) {
            const assignBatchSize = 100;
            let totalAssigned = 0;
            let hardError = "";

            function assignBatch(startIndex) {
                const batch = savedIds.slice(startIndex, startIndex + assignBatchSize);
                $.ajax({
                    url: '/bulkupload/assign-workspace/',
                    type: 'POST',
                    headers: { 'X-CSRFToken': csrftoken },
                    traditional: false,
                    data: { workspace_id: workspaceId, 'data_ids[]': batch },
                    success: function(response) {
                        totalAssigned += (response.assigned || 0);
                    },
                    error: function(xhr) {
                        if (!hardError) {
                            hardError = `Records were saved but could not be moved into ${workspaceLabel}.`;
                            try {
                                const parsed = JSON.parse(xhr.responseText);
                                if (parsed.error) hardError = `${hardError} ${parsed.error}`;
                            } catch (e) { /* keep the generic message */ }
                        }
                    },
                    complete: function() {
                        if (startIndex + assignBatchSize < savedIds.length) {
                            assignBatch(startIndex + assignBatchSize);
                        } else if (hardError) {
                            finalize(hardError);
                        } else {
                            const notAssigned = savedIds.length - totalAssigned;
                            finalize(notAssigned ? `${notAssigned} of ${savedIds.length} records could not be moved into ${workspaceLabel}.` : "");
                        }
                    }
                });
            }
            assignBatch(0);
        } else {
            finalize("");
        }
    }

    function finalize(assignmentWarning) {
        document.getElementById("SavePending")?.remove();
        const summary = document.createElement("div");
        summary.className = "status-summary";
        if (failedCount === 0 && !assignmentWarning) {
            const target = workspaceLabel ? `<span class="status-note">Assigned to ${workspaceLabel}</span>` : "";
            section.classList.add("status-panel--success", "status-panel--flat");
            summary.innerHTML = `<span class="status-icon">&#10003;</span><span>All ${totalFiles} records saved successfully.${target}</span>`;
            completeStep("ButtonS");
        } else {
            section.classList.add("status-panel--error");
            const detail = assignmentWarning ? `<span class="status-note">${assignmentWarning}</span>` : "";
            summary.innerHTML = `<span class="status-icon">&#9888;</span><span>${savedCount} saved, ${failedCount} failed.${detail}</span>`;
            // Nothing persisted means a retry is safe; a partial save is not,
            // so the button stays closed to avoid duplicating saved records.
            if (savedCount === 0) {
                unlockWorkspaceDropdown();
                reopenStep("ButtonS");
            } else {
                completeStep("ButtonS");
            }
        }
        section.prepend(summary);
    }
}
