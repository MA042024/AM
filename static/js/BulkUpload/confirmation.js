// Confirmation Message Functionality
function Confirmation(behvr) {
    let message = "";
    let actionFunction = null;
    if (behvr === "E") {
        message = "This action will extract records from the uploaded Excel sheet, which may take some time. Confirm extraction?";
        actionFunction = ExtractXML;
    } else if (behvr === "V") {
        message = "This action will check the validity of all records. Confirm?";
        actionFunction = Validate;
    } else if (behvr === "S") {
        const workspaceLabel = getSelectedWorkspaceLabel();
        message = workspaceLabel
            ? `This action will save all records to the database and assign them to the workspace "${workspaceLabel}". Confirm save?`
            : "This action will save all records to the database, visible only to you. Confirm save?";
        actionFunction = saveAllRecords;
    }
    document.getElementById("ConfirmationMessage").textContent = message;
    document.getElementById("Confirmationpopup").style.display = "block";
    document.getElementById("Cancel-ConfirmationMessage").onclick = () => {
        document.getElementById("Confirmationpopup").style.display = "none";
    };
    document.getElementById("Confirm-ConfirmationMessage").onclick = () => {
        document.getElementById("Confirmationpopup").style.display = "none";
        if (actionFunction) actionFunction();
    };
}
