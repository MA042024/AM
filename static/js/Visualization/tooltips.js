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
