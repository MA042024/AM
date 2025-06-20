// Core
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tab) {
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(sec => sec.classList.remove('active'));

        document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            showTab(tab);
        });
    });
    showTab('general');
});

document.addEventListener('DOMContentLoaded', function() {
function setupSubbar() {
    const subbarBtns = document.querySelectorAll('.subbar-btn');
    const subbarContents = document.querySelectorAll('.subbar-content');

    function showSubtab(subtab) {
    subbarBtns.forEach(btn => btn.classList.remove('active'));
    subbarContents.forEach(sec => sec.classList.remove('active'));

    document.querySelector(`.subbar-btn[data-subtab="${subtab}"]`).classList.add('active');
    document.getElementById(`subtab-${subtab}`).classList.add('active');
    }

    subbarBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const subtab = this.getAttribute('data-subtab');
        showSubtab(subtab);
    });
    });
    showSubtab('DA1');
}
if (document.querySelector('.subbar')) {
    setupSubbar();
}
});
