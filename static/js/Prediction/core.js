// Tooltips opening and closing
document.addEventListener("DOMContentLoaded", function() {
    var tooltips = document.querySelectorAll('.tooltip');
    var skipNextDocumentClick = false;
    var closeTimeout;

    function closeVisibleTooltip() {
        var visibleTooltip = document.querySelector('.tooltiptext.visible');
        if (visibleTooltip) {
            visibleTooltip.classList.remove('visible');
        }
    }

    tooltips.forEach(function(tooltip) {
        var title = tooltip.parentElement.getAttribute('titletip');
        var tooltipText = tooltip.querySelector('.tooltiptext');
        var icon = tooltip.querySelector('.fa-info-circle');
        if (tooltipText && icon) {
            icon.addEventListener('click', function(event) {
                closeVisibleTooltip();
                if (!tooltipText.classList.contains('visible')) {
                    tooltipText.textContent = title;
                    tooltipText.classList.add('visible');
                    skipNextDocumentClick = true;
                    clearTimeout(closeTimeout);
                    closeTimeout = setTimeout(closeVisibleTooltip, 5000);
                }
                event.stopPropagation();
            });
        }
    });

    document.addEventListener('click', function(event) {
        if (skipNextDocumentClick) {
            skipNextDocumentClick = false;
            return;
        }
        var visibleTooltip = document.querySelector('.tooltiptext.visible');
        var infoCircle = document.querySelector('.fa-info-circle');
        if (visibleTooltip && !visibleTooltip.contains(event.target) && 
            (!infoCircle || !infoCircle.contains(event.target))) {
            closeVisibleTooltip();
        }
    });
});

window.showLoading = function(msg) {
    var overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
    if (msg) overlay.querySelector('div > div:last-child').textContent = msg;
};
window.hideLoading = function() {
    document.getElementById('loading-overlay').style.display = 'none';
};

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
    btn.addEventListener('click', function () {
        const tab = this.getAttribute('data-tab');
        showTab(tab);
        if (tab === 'prediction' && (!location.hash || location.hash.length <= 1)) {
        location.hash = 'Marshall';
        }
        if (tab === 'general') {
        history.replaceState(null, '', window.location.pathname);
        }
    });
    });
    if (location.hash && location.hash.length > 1) {
        showTab('prediction');
    } else {
        showTab('general');
    }
});

document.addEventListener('DOMContentLoaded', function () {
function setupSubbar() {
    const subbarBtns = document.querySelectorAll('.subbar-btn');
    const subbarContents = document.querySelectorAll('.subbar-content');

    function showSubtab(subtab) {
    const btn = document.querySelector(`.subbar-btn[data-subtab="${subtab}"]`);
    const panel = document.getElementById(`subtab-${subtab}`);
    if (!btn || !panel) subtab = 'Marshall';

    subbarBtns.forEach(b => b.classList.remove('active'));
    subbarContents.forEach(sec => sec.classList.remove('active'));

    document.querySelector(`.subbar-btn[data-subtab="${subtab}"]`).classList.add('active');
    document.getElementById(`subtab-${subtab}`).classList.add('active');
    }
    subbarBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const subtab = this.getAttribute('data-subtab');
        showSubtab(subtab);
        location.hash = subtab;
    });
    });
    const initial = (location.hash && location.hash.length > 1)
    ? location.hash.substring(1)
    : 'Marshall';
    showSubtab(initial);
    window.addEventListener('hashchange', () => {
    const subtab = (location.hash && location.hash.length > 1)
        ? location.hash.substring(1)
        : 'Marshall';
    showSubtab(subtab);
    });
}
if (document.querySelector('.subbar')) setupSubbar();
});
