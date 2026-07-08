// Open and close information tabs from the right sidebar
document.addEventListener('DOMContentLoaded', function() {
    var explpop = document.getElementById("explpopup");
    function closeExplPopup() {explpop.style.display = "none";}
    document.getElementsByClassName("Expl-popup-close")[0].onclick = closeExplPopup;
    window.onclick = function(event) {if (event.target == explpop) {closeExplPopup();}}
});
function PopupMoreInfo(message) {
    document.getElementById("main-message").innerHTML  = message;
    document.getElementById("explpopup").style.display = "block";
}
document.addEventListener('DOMContentLoaded', function() {
    var questionMarks = document.querySelectorAll('.moreinfo');
    questionMarks.forEach(function(mark) {
        mark.addEventListener('click', function() {
            var targetId = mark.getAttribute('data-target');
            var targetDiv = document.getElementById(targetId);
            
            if (targetDiv) {
                var htmlContent = targetDiv.innerHTML;
                PopupMoreInfo(htmlContent);
            }
        });
    });
});

// Open and close QuickStart
document.addEventListener('DOMContentLoaded', function () {
    const quickStartBtn = document.getElementById('quick-start-btn');
    const popup = document.getElementById('quickstartpopup');
    const closeBtn = document.querySelector('.quickstart-popup-close');
    const quickStartContent = document.getElementById('quick-start');
    quickStartBtn.addEventListener('click', function() {
        popup.style.display = 'block';
        quickStartContent.style.display = 'block';
    });
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
        quickStartContent.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
            quickStartContent.style.display = 'none';
        }
    });
});

// Reset Page
function Reset() {location.reload();}
