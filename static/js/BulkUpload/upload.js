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

function UploadExcel() {
    const fileInput = document.getElementById("xmlFileExt");
    document.getElementById("FileExtName").textContent = `Excel File Uploaded`;
    document.getElementById("ButtonE").disabled = false;
    document.getElementById("ButtonE").classList.remove("blocked");
    document.querySelectorAll('input[name="Sheet"]').forEach(function(radio) {radio.disabled = false;});
    document.getElementById("ExtractionSection").innerHTML = "";
    document.getElementById("ExtractionSection").style.display = "none";
    document.getElementById("ButtonV").style.display = "none";
    document.getElementById("ButtonV").disabled = false;
    document.getElementById("ButtonV").classList.remove("blocked");
    document.getElementById("ValidationSection").innerHTML = "";
    document.getElementById("ValidationSection").style.display = "none";
    document.getElementById("ButtonS").style.display = "none";
    document.getElementById("ButtonS").disabled = false;
    document.getElementById("ButtonS").classList.remove("blocked");
    document.getElementById("SaveSection").innerHTML = "";
    document.getElementById("SaveSection").style.display = "none";
}
