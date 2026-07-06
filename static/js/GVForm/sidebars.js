// Function to activate sidebar dropdown
document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.sidebar a.dropdown');
    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            const hasSubmenu = link.nextElementSibling && link.nextElementSibling.tagName === 'UL';
            const parentMenu = link.parentElement;
            const siblingLinks = parentMenu.parentElement.querySelectorAll('a.dropdown');
            siblingLinks.forEach(function (otherLink) {
                if (otherLink !== link) {
                    otherLink.classList.remove('active');
                    const otherNestedList = otherLink.nextElementSibling;
                    if (otherNestedList) {
                        otherNestedList.style.display = 'none';
                    }
                }
            });
            link.classList.toggle('active');
            if (hasSubmenu) {
                const nestedList = link.nextElementSibling;
                if (nestedList.style.display === 'block') {
                    nestedList.style.display = 'none';
                } else {
                    nestedList.style.display = 'block';
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const linkText = this.textContent;
                    event.preventDefault();
                    if (targetId.startsWith('Outerfield')) {
                        const outerTabContent = targetElement.querySelector('.outertab-content');
                        const outerTabt = targetElement.querySelector('.outertab-t');
                        const outerTabminus = targetElement.querySelector('.hideouter-content');
                        if (outerTabContent) {
                            outerTabContent.style.display = 'block';
                            outerTabt.style.display = 'none';
                            outerTabminus.style.visibility ='visible'; 
                        }
                    } else if (targetId.startsWith('field')) {
                        const innerTabContent = targetElement.closest('.innertab-content');
                        let TempContent = innerTabContent.parentElement; 
                        let Temp = TempContent.parentElement.closest('.outer-fieldset');
                        let TempTab = Temp.querySelector('.outertab-t');
                        let TempHide = Temp.querySelector('.hideouter-content');
                        TempContent.style.display = 'block';
                        TempTab.style.display = 'none';
                        TempHide.style.visibility ='visible'; 
                        if (innerTabContent) {
                            innerTabContent.style.display = 'block';
                            innerTabContent.previousElementSibling.style.display = 'none';
                        }
                    } else if (targetId.startsWith('fld')) {
                        const innerTabContent = targetElement.closest('.innertab-lvl3-content');
                        let TempContent = innerTabContent.parentElement; 
                        let Temp = TempContent.previousElementSibling.previousElementSibling;
                        let TempTab = TempContent.previousElementSibling;
                        let TempHide = Temp.firstElementChild;
                        let HTempContent = Temp.parentElement;
                        let HTemp = HTempContent.parentElement.closest('.outer-fieldset');
                        let HTempTab = HTemp.querySelector('.outertab-t');
                        let HTempHide = HTemp.querySelector('.hideouter-content');
                        HTempContent.style.display = 'block';
                        HTempTab.style.display = 'none';
                        HTempHide.style.visibility ='visible'; 
                        Temp.style.display = 'flex';
                        TempContent.style.display = 'block';
                        TempTab.style.display = 'none';
                        TempHide.style.visibility ='visible';
                        if (innerTabContent) {
                            innerTabContent.style.display = 'block';
                            innerTabContent.previousElementSibling.style.display = 'none'; 
                        }
                    }  else if (targetId.startsWith('Empty')) {
                        const innerTablvl2Empty = targetElement.closest('.innertab-lvl2');
                        const innerTablvl2T = targetElement.nextElementSibling;
                        const innerTablvl2Content = innerTablvl2T.nextElementSibling;
                        const innerTablvl2minus = targetElement.querySelector('.hideinner-lvl2-content');
                        let HTempContent = innerTablvl2Empty.parentElement;
                        let HTemp = HTempContent.parentElement.closest('.outer-fieldset');
                        let HTempTab = HTemp.querySelector('.outertab-t');
                        let HTempHide = HTemp.querySelector('.hideouter-content');
                        HTempContent.style.display = 'block';
                        HTempTab.style.display = 'none';
                        HTempHide.style.visibility ='visible'; 
                        if (innerTablvl2Empty) {
                            targetElement.style.display = 'flex';
                            innerTablvl2Content.style.display = 'block';
                            innerTablvl2T.style.display = 'none';
                            innerTablvl2minus.style.visibility ='visible';     
                        }
                    }
                    setTimeout(function() {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                }
            }
        );
    });
});

// Arrows Functionality
document.addEventListener('DOMContentLoaded', function() { 
    document.getElementById('arrow-up').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.getElementById('arrow-down').addEventListener('click', function() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
});

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
