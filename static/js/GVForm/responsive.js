// Small screen size: show performance test selection tab in the form
function moveTestSelectionDiv() {
    const testSelectionDiv = document.getElementById('Test-Selection-div');
    const SmallScreenForm = document.getElementById('SmallScreenForm');
    const originalParent = document.getElementById('RightSidebar');
    if (window.innerWidth <= 1400 && window.innerWidth >= 800) {
        if (!SmallScreenForm.contains(testSelectionDiv)) {
            SmallScreenForm.appendChild(testSelectionDiv);
            SmallScreenForm.style.display = "block";
        }
    } else {
        if (!originalParent.contains(testSelectionDiv)) {
            originalParent.insertBefore(testSelectionDiv, originalParent.firstChild);
            SmallScreenForm.style.display = "none";
        }
    }
}
window.addEventListener('load', function() {
    moveTestSelectionDiv();
    window.addEventListener('resize', moveTestSelectionDiv);
});
