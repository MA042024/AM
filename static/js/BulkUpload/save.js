// Save Function
function saveAllRecords() {
    document.getElementById("ButtonS").disabled = true;
    document.getElementById("ButtonS").classList.add("blocked");
    const section = document.getElementById("SaveSection");
    section.style.display = "block";
    section.className = "status-panel";
      section.innerHTML =
        `<div id="SavePending" class="status-summary status-summary--pending">
        <span class="spinner"></span> Saving records, please wait...
        </div>`;
    let savedCount = 0;
    let failedCount = 0;
    const totalFiles = Object.keys(Records).length;
    Object.keys(Records).forEach((fileName, index) => {
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

        $.ajax({
            url: '/curate/save-xml-data/',
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            data: formData,
            success: function(response) {
                savedCount++;
                checkAllSaved(savedCount, failedCount, totalFiles);
            },
            error: function(xhr, status, error) {
                failedCount++;
                let errorMessage = "Failed to save data.";
                if (xhr.status === 403) {
                    errorMessage = "Insufficient permissions";
                }
                appendFailedRow(fileName, errorMessage);
                checkAllSaved(savedCount, failedCount, totalFiles);
            }
        });
    });
    function appendFailedRow(fileName, message) {
        const row = document.createElement("div");
        row.className = "status-row status-row--invalid";
        row.innerHTML = `<span class="status-icon">&#9888;</span><div><b>${fileName}</b><div class="status-detail">${message}</div></div>`;
        section.appendChild(row);
    }
}
function checkAllSaved(savedCount, failedCount, totalFiles) {
    const section = document.getElementById("SaveSection");
    if (savedCount + failedCount === totalFiles) {
        document.getElementById("SavePending")?.remove();
        const summary = document.createElement("div");
        summary.className = "status-summary";
        if (failedCount === 0) {
            section.classList.add("status-panel--success");
            summary.innerHTML = `<span class="status-icon">&#10003;</span> All ${totalFiles} records saved successfully.`;
        } else {
            section.classList.add("status-panel--error");
            summary.innerHTML = `<span class="status-icon">&#9888;</span> ${savedCount} saved, ${failedCount} failed.`;
        }
        section.appendChild(summary);
    }
}
