function OpenTabs(behvr) {
    const outertabs = document.querySelectorAll('.outertab-content');
    const outertabsminus = document.querySelectorAll('.hideouter-content');
    const innertabs = document.querySelectorAll('.innertab-content');
    const innertabslvl2 = document.querySelectorAll('.innertab-lvl2');
    const innertabslvl2content = document.querySelectorAll('.innertab-lvl2-content');
    const innertabslvl2hide = document.querySelectorAll('.hideinner-lvl2-content');
    const innertabslvl3 = document.querySelectorAll('.innertab-lvl3-content');
    const innertabslvl4 = document.querySelectorAll('.innertab-lvl4-content');
    const innertabslvl4adtv = document.querySelectorAll('.innertab-lvl4-content-adtv');
    outertabs.forEach(tab => {tab.style.display = 'block';});
    outertabsminus.forEach(tab => {tab.style.visibility = 'visible';})
    innertabs.forEach(tab => {tab.style.display = 'block';})
    innertabslvl2.forEach(tab => {tab.style.display = 'flex';})
    innertabslvl2content.forEach(tab => {tab.style.display = 'block';})
    innertabslvl2hide.forEach(tab => {tab.style.visibility = 'visible';})
    innertabslvl3.forEach(tab => {tab.style.display = 'block';})
    innertabslvl4.forEach(tab => {tab.style.display = 'block';})
    innertabslvl4adtv.forEach(tab => {tab.style.display = 'block';})
    const outerbuttons = document.querySelectorAll('.outertab-t');
    const innerbuttons = document.querySelectorAll('.innertab-t');
    const innerbuttonslvl2 = document.querySelectorAll('.innertab-lvl2-t');
    const innerbuttonslvl3 = document.querySelectorAll('.innertab-lvl3-t');
    const innerbuttonslvl4 = document.querySelectorAll('.innertab-lvl4-t');
    const innerbuttonslvl4adtv= document.querySelectorAll('.innertab-lvl4-t-adtv');
    outerbuttons.forEach(btns => {btns.style.display = 'none';});
    innerbuttons.forEach(btns => {btns.style.display = 'none';});
    innerbuttonslvl2.forEach(btns => {btns.style.display = 'none';});
    innerbuttonslvl3.forEach(btns => {btns.style.display = 'none';});
    innerbuttonslvl4.forEach(btns => {btns.style.display = 'none';});
    innerbuttonslvl4adtv.forEach(btns => {btns.style.display = 'none';});
    OpenTestFields();

    if (behvr === "S" || behvr === "D" || behvr === "ES"){
        if (document.getElementById("myForm").reportValidity()) { generateXML(behvr);}
    } else if (behvr === "UD" || behvr === "UE" || behvr === "E"){
        uploadXML(behvr);
    } else{console.log(`Undefined value for behvr: '${behvr}'. Only 'S', 'D', 'UD', 'UE', 'E' and 'ES' are allowed.`)}
}


//Outer Fields Tabs
document.addEventListener('DOMContentLoaded', function() {
    var outertabtions = document.querySelectorAll('.outer-fieldset');

    outertabtions.forEach(function(section) {
        var showText = section.querySelector('.outertab-t');
        var tabContent = section.querySelector('.outertab-content');
        var minus = section.querySelector('.hideouter-content');

        showText.addEventListener('click', function() {
            tabContent.style.display = 'block';
            showText.style.display = 'none';
            minus.style.visibility = 'visible';
        });

    });
});

document.addEventListener("DOMContentLoaded", function() {
    var toggles = document.querySelectorAll('.hideouter-content');

    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var content = this.parentElement.parentElement.querySelector('.outertab-content');
            var tab = this.parentElement.parentElement.querySelector('.outertab-t');

            if (content && tab) {
                if (content.style.display !== 'none') {
                    content.style.display = 'none';
                    tab.style.display = 'block';
                    toggle.style.visibility ='hidden';
                } else {
                    content.style.display = 'block';
                    tab.style.display = 'none';
                    toggle.style.visibility ='visible';
                }
            }
        });
    });
});

//Inner Fields Tabs
document.addEventListener("DOMContentLoaded", function() {
    var tabs = document.querySelectorAll('.innertab-t');
    var contents = document.querySelectorAll('.innertab-content');

    tabs.forEach(function(tab, index) {
        var content = contents[index];

        tab.addEventListener('click', function() {
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';
            tab.style.display = (content.style.display === 'block') ? 'none' : 'block';
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var toggles = document.querySelectorAll('.hideinner-content');

    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var content = this.closest('.innertab-content');
            var tab = content.previousElementSibling;
            
            if (content && tab) {
                if (content.style.display !== 'none') {
                    content.style.display = 'none';
                    tab.style.display = 'block';
                } else {
                    content.style.display = 'block';
                    tab.style.display = 'none';
                }
            }
        });
    });
});

//Inner Fields level 2 Tabs
document.addEventListener("DOMContentLoaded", function() {
    var linetitles = document.querySelectorAll('.innertab-lvl2');
    var tabs = document.querySelectorAll('.innertab-lvl2-t');
    var contents = document.querySelectorAll('.innertab-lvl2-content');
    var minusSigns = document.querySelectorAll('.hideinner-lvl2-content');

    tabs.forEach(function(tab, index) {
        var content = contents[index];
        var minusSign = minusSigns[index];
        var linetitle = linetitles[index];

        tab.addEventListener('click', function() {
            var isContentVisible = content.style.display === 'block';
            linetitle.style.display = isContentVisible ? 'none' : 'flex';
            content.style.display = isContentVisible ? 'none' : 'block';
            tab.style.display = isContentVisible ? 'block' : 'none';
            minusSign.style.visibility = isContentVisible ? 'hidden' : 'visible';
        });

        minusSign.addEventListener('click', function() {
            linetitle.style.display = 'none';
            content.style.display = 'none';
            tab.style.display = 'block';
            minusSign.style.visibility = 'hidden';
        });
    });
});

//Inner Fields level 3 Tabs
document.addEventListener("DOMContentLoaded", function() {
    var tabs = document.querySelectorAll('.innertab-lvl3-t');
    var contents = document.querySelectorAll('.innertab-lvl3-content');

    tabs.forEach(function(tab, index) {
        var content = contents[index];

        tab.addEventListener('click', function() {
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';
            tab.style.display = (content.style.display === 'block') ? 'none' : 'block';
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var toggles = document.querySelectorAll('.hideinner-lvl3-content');

    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var content = this.closest('.innertab-lvl3-content');
            var tab = content.previousElementSibling;

            if (content && tab) {
                if (content.style.display !== 'none') {
                    content.style.display = 'none';
                    tab.style.display = 'block';
                } else {
                    content.style.display = 'block';
                    tab.style.display = 'none';
                }
            }
        });
    });
});

//Inner Fields level 4 Tabs
document.addEventListener("DOMContentLoaded", function() {
    var tabs = document.querySelectorAll('.innertab-lvl4-t');
    var contents = document.querySelectorAll('.innertab-lvl4-content');

    tabs.forEach(function(tab, index) {
        var content = contents[index];

        tab.addEventListener('click', function() {
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';
            tab.style.display = (content.style.display === 'block') ? 'none' : 'block';
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var toggles = document.querySelectorAll('.hideinner-lvl4-content');

    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var content = this.closest('.innertab-lvl4-content');
            var tab = content.previousElementSibling;

            if (content && tab) {
                if (content.style.display !== 'none') {
                    content.style.display = 'none';
                    tab.style.display = 'block';
                } else {
                    content.style.display = 'block';
                    tab.style.display = 'none';
                }
            }
        });
    });
});

//Inner Fields level 4 Addtives Tabs
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('innertab-lvl4-t-adtv')) {
            var content = event.target.nextElementSibling;

            if (content) {
                content.style.display = (content.style.display === 'block') ? 'none' : 'block';
                event.target.style.display = (content.style.display === 'block') ? 'none' : 'block';
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('hideinner-lvl4-content-adtv')) {
            var content = event.target.closest('.innertab-lvl4-content-adtv');
            var tab = content.previousElementSibling;

            if (content && tab) {
                if (content.style.display !== 'none') {
                    content.style.display = 'none';
                    tab.style.display = 'block';
                } else {
                    content.style.display = 'block';
                    tab.style.display = 'none';
                }
            }
        }
    });
});

// Link to the additive section
function LinkToAdtv() {
    document.getElementById('mixturelink').click();
    setTimeout(() => {
        document.getElementById('componentpropertieslink').click();
        setTimeout(() => {
            document.getElementById('additiveslink').click();
        }, 25);
    }, 25);
}
