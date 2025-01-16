// Test Selection Functionality
function ShowTestSelectionPopup() { document.getElementById('Testpopup').style.display = 'block';}
function CloseTestSelectionPopup() {document.getElementById('Testpopup').style.display = 'none';}
function ApplyTestSelection() {
    caseSelect = RetrieveTestsList();
    ChangeTestSelectionText(caseSelect);
    ShowHideTests(caseSelect);
    CloseTestSelectionPopup();
    CheckingTestTabs(caseSelect);
}

//
function RetrieveTestsList(){
    let selectedTests = [];
    let checkboxes = document.querySelectorAll('#Test-selection input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {selectedTests.push(checkbox.id.split('-').pop());}
    });
    return (selectedTests.join('-'));
}

//
function ChangeTestSelectionText(testcasevalue){
    let selectedTextList = TestsNames(SplitTests(testcasevalue));
    let selectedText = selectedTextList.join(' + ');
    if (selectedTextList.length === 1) {
        selectedText += ' Test';
    } else if (selectedTextList.length > 1) {
        selectedText += ' Tests';
    }
    const selectedTestCase = document.getElementById('selected-test-case');
    selectedTestCase.innerHTML = `${selectedText}`;
}

//
function ShowHideTests(testcasevalue){
    for (let TestName of UnSelectedTests(SplitTests(testcasevalue))){
         document.querySelectorAll(`.${TestName}cls`).forEach(element => {element.classList.add('hidden');});
         ReqForSelectedTest("False",TestName);
    }
    for (let TestName of SplitTests(testcasevalue)){
        document.querySelectorAll(`.${TestName}cls`).forEach(element => {element.classList.remove('hidden');});
        ReqForSelectedTest("True",TestName);
    }
}

// Add/Remove "required" for input fields based on the test selected
function ReqForSelectedTest(req, TestName){
    var selectedValue = document.getElementById("ResultsSelection").value;
        var Lgroup = [
        document.getElementById("MeanThicknessL"),
        document.getElementById("CyclesNumberL"),
        document.getElementById("MeanProportionalRutDepthL"),
        document.getElementById("BulkDensityMethodL")
        ];  
    var SAgroup = [
        document.getElementById("MeanThicknessSA"),
        document.getElementById("MeanRutDepthSA"),
        document.getElementById("CyclesNumberSA"),
        document.getElementById("MeanWheelTrackingRateSA"),
        document.getElementById("BulkDensityMethodSA")
        ];
    var SBAgroup = [
        document.getElementById("MeanThicknessSBA"),
        document.getElementById("MeanWheelTrackingSlopeSBA"),
        document.getElementById("CyclesNumberSBA"),
        document.getElementById("MeanProportionalRutDepthSBA"),
        document.getElementById("MeanRutDepthSBA"),
        document.getElementById("BulkDensityMethodSBA")
        ];
    var SBWgroup = [
        document.getElementById("MeanThicknessSBW"),
        document.getElementById("MeanWheelTrackingSlopeSBW"),
        document.getElementById("CyclesNumberSBW"),
        document.getElementById("MeanProportionalRutDepthSBW"),
        document.getElementById("MeanRutDepthSBW"),
        document.getElementById("BulkDensityMethodSBW")
        ];
    if(req === "True"){
        if (TestName === "rut"){
            document.getElementById("TestTemperature").setAttribute("required", "");
            document.getElementById("ResultsSelection").setAttribute("required", "");
            if (selectedValue === "LargeOrExtraLargeDevices") {
                Lgroup.forEach(function(element) {element.setAttribute("required", "");});
                SAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBWgroup.forEach(function(element) {element.removeAttribute("required");});
            } else if (selectedValue === "SmallSizeDeviceMethod_A_Air") {
                SAgroup.forEach(function(element) {element.setAttribute("required", "");});
                Lgroup.forEach(function(element) {element.removeAttribute("required");});
                SBAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBWgroup.forEach(function(element) {element.removeAttribute("required");});
            } else if (selectedValue === "SmallSizeDeviceMethod_B_Air") {
                SBAgroup.forEach(function(element) {element.setAttribute("required", "");});
                Lgroup.forEach(function(element) {element.removeAttribute("required");});
                SAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBWgroup.forEach(function(element) {element.removeAttribute("required");});
            } else if (selectedValue === "SmallSizeDeviceMethod_B_Water") {
                SBWgroup.forEach(function(element) {element.setAttribute("required", "");});
                Lgroup.forEach(function(element) {element.removeAttribute("required");});
                SAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBAgroup.forEach(function(element) {element.removeAttribute("required");});
            }
        }
        if (TestName === "mar"){
            document.getElementById("StabilityMar").setAttribute("required", "");
            document.getElementById("FlowMar").setAttribute("required", "");
            document.getElementById("BulkDensityMethodMar").setAttribute("required", "");
        }
        if (TestName === "its"){
            document.getElementById("TestTemperatureITS").setAttribute("required", "");
            document.getElementById("IndirectTensileStrengthITSDry").setAttribute("required", "");
            document.getElementById("BulkDensityMethodITSDry").setAttribute("required", "");
        }
        if (TestName === "tsr"){
            document.getElementById("StartTemperatureTSRST").setAttribute("required", "");
            document.getElementById("TemperatureRateTSRST").setAttribute("required", "");
            document.getElementById("FailureStressTSRST").setAttribute("required", "");
            document.getElementById("FailureTemperatureTSRST").setAttribute("required", "");
            document.getElementById("BulkDensityMethodTSRST").setAttribute("required", "");
        }
        if (TestName === "uts"){
            document.getElementById("TestTemperatureUTST").setAttribute("required", "");
            document.getElementById("AppliedDeformationRateUTST").setAttribute("required", "");
            document.getElementById("TensileStrengthUTST").setAttribute("required", "");
            document.getElementById("FailureStrainUTST").setAttribute("required", "");
        }
        if (TestName === "stf"){
            document.getElementById("TestTypeStiff").setAttribute("required", "");
            document.getElementById("TestTemperatureStiff1").setAttribute("required", "");
            document.getElementById("StiffnessModulusStiff1_1").setAttribute("required", "");
        }
    } else if (req === "False"){
        if (TestName === "rut"){
            document.getElementById("TestTemperature").removeAttribute("required");
            document.getElementById("ResultsSelection").removeAttribute("required");
            Lgroup.forEach(function(element) {element.removeAttribute("required");});
            SAgroup.forEach(function(element) {element.removeAttribute("required");});
            SBAgroup.forEach(function(element) {element.removeAttribute("required");});
            SBWgroup.forEach(function(element) {element.removeAttribute("required");});
        }
        if (TestName === "mar"){
            document.getElementById("StabilityMar").removeAttribute("required");
            document.getElementById("FlowMar").removeAttribute("required");
            document.getElementById("BulkDensityMethodMar").removeAttribute("required");
        }
        if (TestName === "its"){
            document.getElementById("TestTemperatureITS").removeAttribute("required");
            document.getElementById("IndirectTensileStrengthITSDry").removeAttribute("required");
            document.getElementById("BulkDensityMethodITSDry").removeAttribute("required");
        }
        if (TestName === "tsr"){
            document.getElementById("StartTemperatureTSRST").removeAttribute("required");
            document.getElementById("TemperatureRateTSRST").removeAttribute("required");
            document.getElementById("FailureStressTSRST").removeAttribute("required");
            document.getElementById("FailureTemperatureTSRST").removeAttribute("required");
            document.getElementById("BulkDensityMethodTSRST").removeAttribute("required");
        }
        if (TestName === "uts"){
            document.getElementById("TestTemperatureUTST").removeAttribute("required");
            document.getElementById("AppliedDeformationRateUTST").removeAttribute("required");
            document.getElementById("TensileStrengthUTST").removeAttribute("required");
            document.getElementById("FailureStrainUTST").removeAttribute("required");
        }
        if (TestName === "stf"){
            document.getElementById("TestTypeStiff").removeAttribute("required");
            document.getElementById("TestTemperatureStiff1").removeAttribute("required");
            document.getElementById("StiffnessModulusStiff1_1").removeAttribute("required");
        }
    }
}

// Performance Test Selection Tab: Supporting Functions

// Checking if the selected test match the tree branch requirement
function CheckSelectedTest(testcase, testgroup) {
    const allcases = testcombinations(["rut", "mar", "its", "tsr","uts","stf"]);
    const testgroups = {
        allcases: allcases,
        grpRutMarIts: testcombinations(["rut", "mar", "its", "tsr","uts","stf"]),
        ruttingcases: specifictestcomb(allcases, "rut"),
        marshallcases: specifictestcomb(allcases, "mar"),
        itscases: specifictestcomb(allcases, "its"),
        tsrstcases: specifictestcomb(allcases, "tsr"),
        utstcases: specifictestcomb(allcases, "uts"),
        stiffnesscases: specifictestcomb(allcases, "stf"),
    };
    return (testgroup in testgroups) ? testgroups[testgroup].includes(testcase) : false;
}
function testcombinations(arr) {
    const result = [];
    const f = (prefix, arr) => {
        for (let i = 0; i < arr.length; i++) {
            result.push(prefix + (prefix ? '-' : '') + arr[i]);
            f(prefix + (prefix ? '-' : '') + arr[i], arr.slice(i + 1));
        }
    };
    f('', arr);
    return result;
}
function specifictestcomb(allCases, keyword) {return allCases.filter(caseStr => caseStr.includes(keyword));}

// Each test's root node name as defined in its corresponding XSD file and its three-character abbreviation in the GV Form Code
function RootNodes(testcase) {
    const ExpNames = {
        rut: "RuttingExp",
        mar: "MarshallExp",
        its: "ITSExp",
        tsr: "TSRSTExp",
        uts: "UTSTExp",
        stf: "StiffnessExp",
    };
    const testcasesdivided = testcase.split("-");
    const nodesnames = testcasesdivided.map(testcases => ExpNames[testcases]);
    return nodesnames;
}

// Each test's full name and its three-character abbreviation in the GV Form Code
function TestsNames(testcases) {
    const TNames = {
        rut: "Rutting",
        mar: "Marshall",
        its: "Indirect Tensile Strength",
        tsr: "Thermal Stress Restrained Specimen",
        uts: "Uniaxial Tension Stress",
        stf: "Stiffness",
    };
    const testsnames = testcases.map(testcase => TNames[testcase]);
    return testsnames;
}

// Splitting the groups of tests
function SplitTests(testcase) {
    const testcasesdivided = testcase.split("-");
    return testcasesdivided;
}

// Unselected tests
function UnSelectedTests(list) {
    let fulllist = ["rut", "mar", "its", "tsr","uts","stf"];
    let unselected = fulllist.filter(item => !list.includes(item));
    return unselected;
}

// Identify Test ID in AsphaltMine from Root nodes
function Testid(testname) {
    const ExpNames = {
        "RuttingExp": 21,
        "MarshallExp": 22,
        "ITSExp": 23,
        "TSRSTExp": 24,
        "UTSTExp": 25,
        "StiffnessExp": 26,
    };
    const testnumber = ExpNames[testname];
    return testnumber !== undefined ? testnumber : `Test name '${testname}' is not found.`;
}

// Identify the selected tests from Test IDs in AsphaltMine 
function TestSelectionFromId(testid){
    const ExpNames = {
        21: "select-rut",
        22: "select-mar",
        23: "select-its",
        24: "select-tsr",
        25: "select-uts",
        26: "select-stf",
    };
    const selectedCheckboxId = ExpNames[testid];
    if (selectedCheckboxId) {
        document.querySelectorAll('#Test-selection input[type="checkbox"]').forEach(input => input.checked = false);
        document.getElementById(selectedCheckboxId).checked = true;
        document.getElementById('apply-selection-button').click();
    }
}
        
//
function CheckingTestTabs(caseSelect){
    if(CheckSelectedTest(caseSelect, "grpRutMarIts")){
        let testcasesdivided = SplitTests(caseSelect);
        if (testcasesdivided.length>1){
            for (let testcase of testcasesdivided){   
                document.querySelectorAll(`.${testcase}cls`).forEach(element => {
                    if (!element.classList.contains(`${testcase}note`)) {element.classList.add('hidden');}
                });
                [`#${testcase}smplproptab`, `#${testcase}resultstab`].forEach(id => {document.querySelector(id).classList.remove('hidden');});
            }
        } else if (testcasesdivided.length === 1){
            [`#${caseSelect}smplproptab`, `#${caseSelect}resultstab`].forEach(id => {document.querySelector(id).classList.add('hidden');});
        }
        for (let testcase of UnSelectedTests(SplitTests(caseSelect))){
            [`#${testcase}smplproptab`, `#${testcase}resultstab`].forEach(id => {document.querySelector(id).classList.add('hidden');});
        }
    }
};

// Show/hide Test Tabs
document.addEventListener("DOMContentLoaded", function() {
    var tabs = document.querySelectorAll('.innertab-test');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll(`.${tab.id.slice(0, -3)}grp`).forEach(element => {element.classList.remove('hidden');});
            if (document.getElementById(`${tab.id}hide`)) {document.getElementById(`${tab.id}hide`).style.display = 'block';}
            tab.classList.add('hidden');
            });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    var toggles = document.querySelectorAll('.hidetesttabs');
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var tab = document.getElementById(`${toggle.id.slice(0, -4)}`);
            tab.classList.remove('hidden');
            document.querySelectorAll(`.${tab.id.slice(0, -3)}grp`).forEach(element => {element.classList.add('hidden');});
        });
    });
});

// Function to Open all test fields activated for full input validation
function OpenTestFields(){
    let caseSelect = RetrieveTestsList();
    if(CheckSelectedTest(caseSelect, "grpRutMarIts")){
        let testcasesdivided = SplitTests(caseSelect);
        if (testcasesdivided.length>1){
            ShowHideTests(caseSelect);
            for (let testcase of testcasesdivided){
                [`#${testcase}smplproptab`, `#${testcase}resultstab`].forEach(id => {document.querySelector(id).classList.add('hidden');});
                [`#${testcase}smplproptabhide`, `#${testcase}resultstabhide`].forEach(id => {document.querySelector(id).style.display = 'block';});
            }
        }
    }
}
