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
function ShowPopMsg(choice) {
    var popupMessage = document.getElementById('GenpopMessage');
    var genpop = document.getElementById('Genpopup');
    genpop.classList.remove('error');
    switch (choice) {
    case 'D':
        popupMessage.innerText = "Record Downloaded.";
        break;
    case 'S':
        popupMessage.innerText = "Record Saved.";
        break;
    case 'Den':
        popupMessage.innerText = "Insufficient Permission.";
        genpop.classList.add('error');
        break;
    default:
        popupMessage.innerText = "";
    }
    genpop.style.display = 'block';
    setTimeout(function() {
        if (genpop.style.display !== 'none') {
            ClosePopMsg();
        }
    }, 5000);
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
    document.getElementById('Confirmationpopup').style.display = 'block';
    document.getElementById('Cancel-ConfirmationMessage').onclick = () => {
        document.getElementById('Confirmationpopup').style.display = 'none';
        return false;
    };
    document.getElementById('Confirm-ConfirmationMessage').onclick = () => {
        document.getElementById('Confirmationpopup').style.display = 'none';
        OpenTabs(behvr);
    };
}
