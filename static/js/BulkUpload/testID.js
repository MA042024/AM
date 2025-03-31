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
