// ============== //
// CONFIGURATIONS //
// ============== //
const TEST_CONFIGURATIONS = {};

// ========= //
// FUNCTIONS //
// ========= //
function randomInRange(min, max, decimals = 1) {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
}

function toggleResults(show) {
    const results = document.getElementById('results');
    if (show) {
        results.classList.add('show');
    } else {
        results.classList.remove('show');
    }
}

// ==================== //
// RANDOM FILL FUNCTION //
// ==================== //
function RandomFill(testType) {
    const config = TEST_CONFIGURATIONS[testType];
    if (!config) {
        console.error(`No configuration found for test type: ${testType}`);
        return;
    }
    Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
        const element = document.getElementById(fieldConfig.id);
        if (element && fieldConfig.randomRange) {
            let value = randomInRange(
                fieldConfig.randomRange.min,
                fieldConfig.randomRange.max,
                fieldConfig.randomRange.decimals
            );
            if (fieldConfig.specialLogic === 'lessThanMaxDensity') {
                const maxDensityValue = parseFloat(
                    document.getElementById(config.fields.MaximumDensity.id).value
                );
                if (maxDensityValue) {
                    value = Math.min(value, maxDensityValue - 0.08);
                }
            }  
            element.value = value.toFixed(fieldConfig.randomRange.decimals);
        }
    });
    if (config.sieves) {
        let previousValue = 0;
        config.sieves.forEach((sieve) => {
            const element = document.getElementById(sieve.id);
            if (element) {
                const minAllowed = Math.max(sieve.min, previousValue);
                const value = randomInRange(minAllowed, sieve.max, 1);
                element.value = value.toFixed(1);
                previousValue = value;
            }
        });
    }
}

// ============ //
// CLEAR FIELDS //
// ============ //
function ClearFields(testType) {
    const config = TEST_CONFIGURATIONS[testType];
    if (!config) {
        console.error(`No configuration found for test type: ${testType}`);
        return;
    }
    Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
        const element = document.getElementById(fieldConfig.id);
        if (element) {
            element.value = '';
        }
    });
    if (config.sieves) {
        config.sieves.forEach((sieve) => {
            const element = document.getElementById(sieve.id);
            if (element) {
                element.value = '';
            }
        });
    }

    toggleResults(false);
    const content = document.getElementById('resultsContent');
    if (content) {
        content.innerHTML = '';
        content.classList.remove('show');
    }
}

// ==================== //
// VALIDATION FUNCTION  //
// ==================== //
function validateInputs(testType) {
    const config = TEST_CONFIGURATIONS[testType];
    const errors = [];
    if (config.fields.BulkDensity && config.fields.MaximumDensity) {
        const maxDensity = parseFloat(document.getElementById(config.fields.MaximumDensity.id).value);
        const bulkDensity = parseFloat(document.getElementById(config.fields.BulkDensity.id).value);
        if (bulkDensity >= maxDensity) {errors.push('❌ Bulk Density must be less than Maximum Density.');}
    }
    if (config.sieves) {
        let previousValue = -1;
        let previousSize = '';
        config.sieves.forEach((sieve) => {
            const currentValue = parseFloat(document.getElementById(sieve.id).value);
            if (currentValue < previousValue) {
                errors.push(
                    `❌ Percentage passing Sieve ${sieve.size} (${currentValue}%) ` +
                    `must be greater than percentage passing ${previousSize} (${previousValue}%)`
                );
            }
            previousValue = currentValue;
            previousSize = sieve.size;
        });
    }
    return errors;
}

// =============== //
// DATA COLLECTION //
// =============== //
function collectFormData(testType) {
    const config = TEST_CONFIGURATIONS[testType];
    const formData = {};
    Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
        const element = document.getElementById(fieldConfig.id);
        if (element) {
            const fieldKey = fieldConfig.id.replace(config.suffix, '');
            formData[fieldKey] = element.value;
        }
    });
    if (config.sieves) {
        config.sieves.forEach((sieve) => {
            const element = document.getElementById(sieve.id);
            if (element) {
                const sieveName = sieve.id.replace(config.suffix, '');
                formData[sieveName] = element.value;
            }
        });
    }
    return formData;
}

// ======= //
// DISPLAY //
// ======= //
function displayErrors(errors) {
    const content = document.getElementById('resultsContent');
    const errorHTML = errors.map(err => 
        `<p style="color: #dc3545; margin: 8px 0;">${err}</p>`
    ).join('');
    content.innerHTML = `
        <h2 style="color: #dc3545;">⚠️ Validation Errors</h2>
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0;">
            ${errorHTML}
        </div>
        <p style="margin-top: 15px;"><strong>Please correct the input and try again!</strong></p>
    `; 
    toggleResults(true);
    setTimeout(() => content.classList.add('show'), 100);
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayProcessing() {
    const content = document.getElementById('resultsContent');
    content.innerHTML = '<h2>Processing...</h2><p>Please wait ...</p>';
    toggleResults(true);
    setTimeout(() => content.classList.add('show'), 100);
}

function displayResults(data, testType) {
    const config = TEST_CONFIGURATIONS[testType];
    const content = document.getElementById('resultsContent');

    content.innerHTML = config.renderResults(data);

    toggleResults(true);
    setTimeout(() => content.classList.add('show'), 100);
}    

// ================== //
// SUBMISSION HANDLER //
// ================== //
function setupFormSubmission(testType) {
    const config = TEST_CONFIGURATIONS[testType];
    const form = document.getElementById(config.formId);
    if (!form) {
        console.warn(`Form ${config.formId} not found. Skipping setup.`);
        return;
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const validationErrors = validateInputs(testType);
        if (validationErrors.length > 0) {
            displayErrors(validationErrors);
            return;
        }
        toggleResults(false);
        /*displayProcessing();*/
        showLoading();
        const formData = collectFormData(testType);
        const sessionId = window.sessionId || (window.sessionId = uuidv4());
        formData.session_id = sessionId;
        fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || 'Unknown error');
            }
            hideLoading();
            displayResults(data, testType);
        })
        .catch(error => {
            console.error('Prediction error:', error);
            //hideLoading();
            displayErrors([error.message || 'An error occurred during prediction. Please try again.']);
        });
    });
}

// ============== //
// INITIALIZATION //
// ============== //
document.addEventListener('DOMContentLoaded', function() {
    Object.keys(TEST_CONFIGURATIONS).forEach(testType => {
        setupFormSubmission(testType);
    }); 
    //console.log('✅ Prediction forms initialized:', Object.keys(TEST_CONFIGURATIONS));
});
