// Function for plotting graphs
// horitype and veritype: "any": any number, "pn": positive number, "pi": positive integer, "p%": positive percentage  
function PlotGraph(fieldId, fieldname, horiaxis, horiaxisname , horitype, veriaxis, veriaxisname, veritype)  {
    var existingChart = document.getElementById(fieldId + '_chart');
    if (existingChart) {existingChart.remove();return;}
    var XInput = document.getElementById(horiaxis).value.trim();
    var YInput = document.getElementById(veriaxis).value.trim();
    var X = XInput.split(';').map(v => v.trim()).filter(Boolean);
    var Y = YInput.split(';').map(v => v.trim()).filter(Boolean);
    if (!XInput || !YInput) {EntryError(`Please fill in both ${horiaxisname} and ${veriaxisname} fields.`, fieldId);return;}
    if (X.length !== Y.length) {
        EntryError(`${fieldname}  mismatch: The number of ${horiaxisname} values and ${veriaxisname} values must be the same.`, fieldId);return;}
    for (let i = 0; i < X.length; i++) {
        let Xvalue = X[i];
        let Yvalue = Y[i];
        if (!PlotValidateValues(Xvalue, horiaxisname, fieldname, horitype)) return;
        if (!PlotValidateValues(Yvalue, veriaxisname, fieldname, veritype)) return;
    }
    var sortedData = X.map((value, index) => {
        return { x: parseFloat(value), y: parseFloat(Y[index]) };
    }).sort((a, b) => a.x - b.x);
    var sortedX = sortedData.map(point => point.x);
    var sortedY = sortedData.map(point => point.y);
    var data = {
    labels: sortedX,
    datasets: [{
        data: sortedY,
        label: veriaxisname,
        borderColor: 'rgba(90, 188, 184, 1)',
        backgroundColor: 'rgba(90, 188, 184, 0.12)',
        pointBackgroundColor: 'rgba(255, 255, 255, 0.95)',
        pointBorderColor: 'rgba(90, 188, 184, 1)',
        pointHoverBackgroundColor: 'rgba(90, 188, 184, 1)',
        pointHoverBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        borderWidth: 3,
        tension: 0.28,
        fill: false
    }]
    };
    var chartDiv = document.createElement('div');
    chartDiv.id = fieldId + '_chart';
    document.getElementById(fieldId).appendChild(chartDiv);
    var canvas = document.createElement('canvas');
    canvas.id = fieldId + '_myChart';
    canvas.classList.add('linegraph-canvas');
    chartDiv.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var xAxisType = horiaxisname.startsWith("Size") ? 'logarithmic' : 'linear';
    var myChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
        padding: { top: 10, right: 16, bottom: 0, left: 10 }
        },
        plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(47, 69, 88, 0.95)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(90, 188, 184, 0.5)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false
        }
        },
        scales: {
        x: {
            type: xAxisType,
            ticks: {
            color: '#5c6670',
            maxRotation: 45,
            minRotation: 45
            },
            title: {
            display: true,
            text: horiaxisname,
            color: '#4b5563',
            font: { size: 14, weight: '600' }
            },
            grid: {
            display: false
            }
        },
        y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
            color: '#5c6670'
            },
            title: {
            display: true,
            text: veriaxisname,
            color: '#4b5563',
            font: { size: 14, weight: '600' }
            },
            grid: {
            color: 'rgba(60, 172, 168, 0.12)',
            lineWidth: 1
            }
        }
        }
    }
    });
    return false;
}
function PlotValidateValues(value, axisName, fieldname, axisType) {
    if (axisType==="any"){
        if (isNaN(parseFloat(value)) || !/^\s*-?(\d+(\.\d+)?|\.\d+)\s*$/.test(value)) {
                EntryError(`Invalid ${axisName} in ${fieldname}: ${value}`, axisName);return;}
    } else if (axisType==="pn"){
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0 || !/^\d+(\.\d+)?$/.test(value)) {
            EntryError(`Invalid ${axisName} in ${fieldname}: ${value}`, axisName);return;}
    } else if (axisType==="pi"){
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0 || !/^\d+$/.test(value)) {
            EntryError(`Invalid ${axisName} in ${fieldname}: ${value}`, axisName);return;}
    } else if (axisType==="p%"){
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0 || parseFloat(value) > 100 || !/^\d+(\.\d+)?$/.test(value)) {
            EntryError(`Invalid ${axisName} in ${fieldname}: ${value}`, axisName);return;} 
    }
    return true;
}
