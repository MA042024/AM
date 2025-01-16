document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("modal");
    var span = document.getElementsByClassName("close")[0];

    function closeModal() {modal.style.display = "none";}

    span.onclick = closeModal;
    window.onclick = function(event) {if (event.target == modal) {closeModal();}}
});

function EntryError(message, elementId) {
    var errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    modal.style.display = "block";
    var errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function() {errorElement.focus();}, 1000);
    }
}

//Functionality of Pop Up messages
// detail: optional second line, e.g. the workspace a save landed in.
function ShowPopMsg(choice, detail) {
    var popupMessage = document.getElementById('GenpopMessage');
    var genpop = document.getElementById('Genpopup');
    genpop.classList.remove('error', 'warning');
    var text = "";
    var isAlert = false;
    switch (choice) {
    case 'D':
        text = "Record Downloaded.";
        break;
    case 'S':
        text = "Record Saved.";
        break;
    case 'SaveWarning':
        text = "Record Saved.";
        genpop.classList.add('warning');
        isAlert = true;
        break;
    case 'SaveError':
        text = "Failed to save record.";
        genpop.classList.add('error');
        isAlert = true;
        break;
    case 'Den':
        text = "Insufficient Permission.";
        genpop.classList.add('error');
        isAlert = true;
        break;
    default:
        text = "";
    }
    if (!text) {
        popupMessage.innerHTML = "";
    } else {
        var icon = isAlert ? "&#9888;" : "&#10003;";
        var note = detail ? `<span class="gen-popup-note">${detail}</span>` : "";
        popupMessage.innerHTML = `<span class="gen-popup-icon">${icon}</span><span class="gen-popup-text">${text}${note}</span>`;
    }
    genpop.style.display = 'flex';
    setTimeout(function() {
        if (genpop.style.display !== 'none') {
            ClosePopMsg();
        }
    }, detail ? 8000 : 5000);
}

function ClosePopMsg() {document.getElementById('Genpopup').style.display = 'none';}

// Confirmation Message Functionality
function Confirmation(behvr) {
    if(behvr==="D"){
        message="This action will download the record to your device in XML format. Confirm download?";
    } else if(behvr==="S"){
        message="This action will save the record to the database. Confirm save?";
    } else if(behvr==="ES"){
        message="This action will update the record in the database. The action is irreversible. Confirm update?";
    }
    document.getElementById('ConfirmationMessage').textContent = message;
    // Workspace assignment only makes sense when creating a brand new record.
    const workspaceBlock = document.getElementById('ConfirmationWorkspaceBlock');
    if (behvr === "S") {
        workspaceBlock.style.display = 'flex';
        loadGVWorkspaces();
    } else {
        workspaceBlock.style.display = 'none';
    }
    document.getElementById('Confirmationpopup').style.display = 'block';
    document.getElementById('Cancel-ConfirmationMessage').onclick = () => {
        document.getElementById('Confirmationpopup').style.display = 'none';
        return false;
    };
    document.getElementById('Confirm-ConfirmationMessage').onclick = () => {
        document.getElementById('Confirmationpopup').style.display = 'none';
        OpenTabs(behvr, behvr === "S" ? getGVWorkspaceId() : null, behvr === "S" ? getGVWorkspaceLabel() : null);
    };
}
