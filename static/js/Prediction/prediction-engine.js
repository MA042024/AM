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

function toggleResults(show, testType) {
    const results = document.getElementById(`results-${testType}`);
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

    toggleResults(false, testType);
    const content = document.getElementById(`resultsContent-${testType}`);
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
        if (bulkDensity >= maxDensity) {errors.push('Bulk Density must be less than Maximum Density.');}
    }
    if (config.sieves) {
        let previousValue = -1;
        let previousSize = '';
        config.sieves.forEach((sieve) => {
            const currentValue = parseFloat(document.getElementById(sieve.id).value);
            if (currentValue < previousValue) {
                errors.push(
                    `Percentage passing Sieve ${sieve.size} (${currentValue}%) ` +
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
function displayErrors(errors, testType) {
    const content = document.getElementById(`resultsContent-${testType}`);
    const errorHTML = errors.map(err =>
        `<p class="validation-line"><i class="fa fa-times-circle"></i> ${err}</p>`
    ).join('');
    content.innerHTML = `
        <h2 class="validation-title"><i class="fa fa-exclamation-triangle"></i> Validation Errors</h2>
        <div class="validation-box">
            ${errorHTML}
        </div>
        <p style="margin-top: 15px;"><strong>Please correct the input and try again!</strong></p>
    `;
    toggleResults(true, testType);
    setTimeout(() => content.classList.add('show'), 100);
    document.getElementById(`results-${testType}`).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayProcessing(testType) {
    const content = document.getElementById(`resultsContent-${testType}`);
    content.innerHTML = '<h2>Processing...</h2><p>Please wait ...</p>';
    toggleResults(true, testType);
    setTimeout(() => content.classList.add('show'), 100);
}

function displayResults(data, testType) {
    const config = TEST_CONFIGURATIONS[testType];
    const content = document.getElementById(`resultsContent-${testType}`);

    window.__lastResults = window.__lastResults || {};
    window.__lastResults[testType] = data;

    content.innerHTML = config.renderResults(data);
    if (config.getReportSections) {
        content.insertAdjacentHTML('beforeend', `
            <div class="report-download">
                <button type="button" class="random-btn" onclick="downloadReportPDF('${testType}')">
                    <i class="fa fa-file-pdf-o"></i> Download PDF Report
                </button>
            </div>
        `);
    }
    toggleResults(true, testType);
    setTimeout(() => content.classList.add('show'), 100);
}

// ======================= //
// PDF REPORT DOWNLOAD     //
// ======================= //
function urlToDataURL(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }));
}

// jsPDF stores a PNG's alpha channel as a separate uncompressed SMask,
// which can blow a couple of chart images up to tens of MB. Flattening
// onto a white background and re-encoding as JPEG avoids that entirely.
function urlToJpegDataURL(url, quality) {
    return urlToDataURL(url).then(pngDataUrl => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', quality || 0.88));
        };
        img.onerror = reject;
        img.src = pngDataUrl;
    }));
}

let __logoDataUrlCache = null;
function getLogoDataUrl() {
    if (__logoDataUrlCache) return Promise.resolve(__logoDataUrlCache);
    if (!window.STATIC_URLS || !window.STATIC_URLS.Logo) return Promise.resolve(null);
    return urlToDataURL(window.STATIC_URLS.Logo)
        .then(dataUrl => { __logoDataUrlCache = dataUrl; return dataUrl; })
        .catch(() => null);
}

async function drawReportHeader(doc, pageWidth, marginX, title) {
    let y = 38;
    const logoDataUrl = await getLogoDataUrl();
    if (logoDataUrl) {
        const logoSize = 26;
        try {
            doc.addImage(logoDataUrl, 'PNG', marginX, y - 19, logoSize, logoSize);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(60, 172, 168);
            doc.text('AsphaltMine', marginX + logoSize + 8, y - 3);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'normal');
        } catch (err) {
            console.error('Failed to embed logo in report:', err);
        }
    }
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(title, marginX, y);
    doc.setFont('helvetica', 'normal');
    y += 15;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(new Date().toLocaleString(), marginX, y);
    doc.setTextColor(30, 30, 30);
    y += 10;
    doc.setDrawColor(210, 210, 210);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 18;
    return y;
}

// Renders "±σ_sub interval: [low, high] unit" using jsPDF's built-in
// Symbol font (its glyph for the Latin letter 's' is the Greek sigma) so the
// report shows a real sigma instead of the word "sigma" - normal Helvetica
// can't render Greek letters since its WinAnsi encoding only covers Latin-1.
function drawIntervalLine(doc, marginX, y, entry) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    let x = marginX + 14;
    doc.text('±', x, y);
    x += doc.getTextWidth('±');
    if (entry.symbol === 'sigma') {
        doc.setFont('symbol', 'normal');
        doc.text('s', x, y);
        x += doc.getTextWidth('s');
        doc.setFont('helvetica', 'normal');
    } else {
        doc.text(entry.symbol, x, y);
        x += doc.getTextWidth(entry.symbol);
    }
    if (entry.sub) {
        doc.setFontSize(7.5);
        doc.text(entry.sub, x, y + 2);
        x += doc.getTextWidth(entry.sub);
        doc.setFontSize(10.5);
    }
    doc.text(` interval: [${entry.low}, ${entry.high}] ${entry.unit}`, x, y);
}

async function downloadReportPDF(testType) {
    const config = TEST_CONFIGURATIONS[testType];
    const data = window.__lastResults && window.__lastResults[testType];
    if (!config || !config.getReportSections || !data) {
        console.error(`No results available to build a report for: ${testType}`);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const availWidth = pageWidth - marginX * 2;

    let y = await drawReportHeader(doc, pageWidth, marginX, `${config.reportTitle || testType} Prediction Report`);

    const sections = config.getReportSections(data);
    for (const section of sections) {
        (section.lines || []).forEach((line, idx) => {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = 50;
            }
            if (typeof line === 'object' && line.type === 'interval') {
                drawIntervalLine(doc, marginX, y, line);
                y += 14;
                return;
            }
            if (idx === 0) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
            } else {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10.5);
            }
            doc.text(line, marginX, y);
            y += idx === 0 ? 18 : 14;
        });

        if (section.imageUrl) {
            try {
                const jpegDataUrl = await urlToJpegDataURL(section.imageUrl);
                const props = doc.getImageProperties(jpegDataUrl);
                const imgWidth = section.imageWidth ? Math.min(section.imageWidth, availWidth) : availWidth;
                const imgHeight = imgWidth * (props.height / props.width);
                const imgX = section.imageCenter ? marginX + (availWidth - imgWidth) / 2 : marginX;
                if (y + imgHeight > pageHeight - 40) {
                    doc.addPage();
                    y = 50;
                }
                doc.addImage(jpegDataUrl, 'JPEG', imgX, y, imgWidth, imgHeight);
                y += imgHeight + 20;
            } catch (err) {
                console.error(`Failed to embed image in report: ${section.imageUrl}`, err);
            }
        }
    }

    doc.save(`${testType}_prediction_report.pdf`);
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
            displayErrors(validationErrors, testType);
            return;
        }
        toggleResults(false, testType);
        /*displayProcessing(testType);*/
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
            displayErrors([error.message || 'An error occurred during prediction. Please try again.'], testType);
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
});
