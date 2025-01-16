// 
function CloseEmptyFields() {
    // Check and close empty level 4 fields
    const lvl4Tabs = document.querySelectorAll('.innertab-lvl4-content');
    const lvl4AdtvTabs = document.querySelectorAll('.innertab-lvl4-content-adtv');
    lvl4Tabs.forEach(lvl4Tab => {
        if (!InputsAreFilled(lvl4Tab)) {
            lvl4Tab.style.display = 'none';
            const lvl4TabButton = lvl4Tab.previousElementSibling;
            if (lvl4TabButton) {lvl4TabButton.style.display = 'block';}
        }
    });
    lvl4AdtvTabs.forEach(lvl4AdtvTab => {
        if (!InputsAreFilled(lvl4AdtvTab)) {
            lvl4AdtvTab.style.display = 'none';
            const lvl4AdtvTabButton = lvl4AdtvTab.previousElementSibling;
            if (lvl4AdtvTabButton) {lvl4AdtvTabButton.style.display = 'block';}
        }
    });

    // Check and close empty level 3 fields
    const lvl3Tabs = document.querySelectorAll('.innertab-lvl3-content');
    lvl3Tabs.forEach(lvl3Tab => {
        if (!InputsAreFilled(lvl3Tab)) {
            lvl3Tab.style.display = 'none';
            const lvl3TabButton = lvl3Tab.previousElementSibling;
            if (lvl3TabButton) {lvl3TabButton.style.display = 'block';}
        }
    });

    // Check and close empty level 2 fields
    const lvl2Tabs = document.querySelectorAll('.innertab-lvl2-content');
    lvl2Tabs.forEach(lvl2Tab => {
        if (!InputsAreFilled(lvl2Tab)) {
            lvl2Tab.style.display = 'none';
            const lvl2TabButton = lvl2Tab.previousElementSibling;
            const minusSign = lvl2Tab.querySelector('.hideinner-lvl2-content');
            const lineTitle = lvl2Tab.previousElementSibling.previousElementSibling;
            if (lineTitle) {lineTitle.style.display = 'none';}
            if (lvl2TabButton) {lvl2TabButton.style.display = 'block';}
            if (minusSign) {minusSign.style.visibility = 'hidden';}
        }
    });

    // Check and close empty inner tabs
    const innerTabs = document.querySelectorAll('.innertab-content');
    innerTabs.forEach(innerTab => {
        if (!InputsAreFilled(innerTab)) {
            innerTab.style.display = 'none';
            const innerTabButton = innerTab.previousElementSibling;
            if (innerTabButton) {innerTabButton.style.display = 'block';}
        }
    });

    // Check and close empty outer tabs
    const outerTabs = document.querySelectorAll('.outer-fieldset');
    outerTabs.forEach(outerTab => {
        if (!InputsAreFilled(outerTab)) {
            const showText = outerTab.querySelector('.outertab-t');
            const tabContent = outerTab.querySelector('.outertab-content');
            const minus = outerTab.querySelector('.hideouter-content');
            if (tabContent) {tabContent.style.display = 'none';}
            if (showText) {showText.style.display = 'block';}
            if (minus) {minus.style.visibility = 'hidden';}
        }
    });
}

function InputsAreFilled(container) {
    const inputs = container.querySelectorAll('input');
    const selects = container.querySelectorAll('select');
    for (const input of inputs) {
        if (input.value.trim() !== '') {return true;}
    }
    for (const select of selects) {
        if (select.value.trim() !== '') {return true;}
    }
    return false;
}

//Specific
// Change Label Selection: choose one of two labels
function ChangeInputFieldLabel(selectId, firstoptId, firstoptvl, secondoptId, secondoptvl, reopenBtnId) {
    const select = document.getElementById(selectId);
    const firstOption = document.getElementById(firstoptId);
    const secondOption = document.getElementById(secondoptId);
    const reopenBtn = document.getElementById(reopenBtnId);
    function handleSelection() {
        const selectedValue = select.value;
        if (selectedValue === firstoptvl) {
            firstOption.style.display = 'inline-block';
            secondOption.style.display = 'none';
            toggleSelectVisibility(false);
        } else if (selectedValue === secondoptvl) {
            secondOption.style.display = 'inline-block';
            firstOption.style.display = 'none';
            toggleSelectVisibility(false);
        }
    }
    handleSelection();
    select.addEventListener('change', handleSelection);
    select.addEventListener('blur', handleSelection);
    reopenBtn.addEventListener('click', function(event) {
        event.preventDefault();
        firstOption.style.display = 'none';
        secondOption.style.display = 'none';
        toggleSelectVisibility(true);
    });
    function toggleSelectVisibility(show) {
        select.style.display = show ? 'inline-block' : 'none';
        reopenBtn.style.display = show ? 'none' : 'inline-block';
        if (show) {
            select.focus();
        }
    }
}
document.addEventListener("DOMContentLoaded", function() {
    ChangeInputFieldLabel('SelectStrainDisplacementStiff1', 'strainStiff1', 'Strain', 'displacementStiff1','Displacement', 'changestraindisplacementStiff1');
    ChangeInputFieldLabel('SelectFrequencyTimeStiff1', 'frequencyStiff1', 'Frequency', 'loadtimeStiff1', 'LoadingTime', 'changefrequencytimeStiff1');
});
