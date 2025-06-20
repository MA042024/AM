/*DA3*/
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.subbar-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const subtab = this.getAttribute('data-subtab');
            if (subtab === 'DA3') {
                if (window.sessionId) {
                    showLoading();
                    fetch('/visu/get_columns/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                        },
                        body: JSON.stringify({
                            session_id: window.sessionId
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.columns && data.columns.length > 0) {
                            renderColumnCheckboxes(data.columns);
                        } else {
                            renderColumnCheckboxes([]);
                        }
                    })
                    .catch(() => {
                        renderColumnCheckboxes([]);
                    })
                    .finally(() => {
                        hideLoading();
                    });
                } else {
                    renderColumnCheckboxes([]);
                }
            }
        });
    });
});

function renderColumnCheckboxes(columns) {
    const analyzeDiv = document.getElementById('columns-to-analyze');
    const filterDiv = document.getElementById('columns-to-filter');
    const statsForm = document.getElementById('basic-stats-form');
    const statsTable = document.getElementById('stats-table');
    const noDataMessage = document.querySelector('#subtab-DA3 .no-data-message');
    analyzeDiv.innerHTML = '';
    filterDiv.innerHTML = '';
    if (!columns || columns.length === 0) {
        noDataMessage.style.display = '';
        statsForm.style.display = 'none';
        statsTable.style.display = 'none';
        analyzeDiv.innerHTML = '';
        filterDiv.innerHTML = '';
        return;
    } else {
        noDataMessage.style.display = 'none';
        statsForm.style.display = '';
        statsTable.style.display = '';
    }
    const third = Math.ceil(columns.length / 3);
    const leftCols = columns.slice(0, third);
    const centerCols = columns.slice(third, 2 * third);
    const rightCols = columns.slice(2 * third);
    function makeColHTML(cols, name) {
        return cols.map(col =>
            `<label><input type="checkbox" name="${name}" value="${col}"> ${col}</label>`
        ).join('');
    }
    analyzeDiv.innerHTML = `
        <div class="checkbox-col">${makeColHTML(leftCols, 'analyze')}</div>
        <div class="checkbox-col">${makeColHTML(centerCols, 'analyze')}</div>
        <div class="checkbox-col">${makeColHTML(rightCols, 'analyze')}</div>
    `;
    filterDiv.innerHTML = `
        <div class="checkbox-col">${makeColHTML(leftCols, 'filter')}</div>
        <div class="checkbox-col">${makeColHTML(centerCols, 'filter')}</div>
        <div class="checkbox-col">${makeColHTML(rightCols, 'filter')}</div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const statsForm = document.getElementById('basic-stats-form');
    if (statsForm) {
        statsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const analyzeChecked = Array.from(document.querySelectorAll('input[name="analyze"]:checked')).map(cb => cb.value);
        const filterChecked = Array.from(document.querySelectorAll('input[name="filter"]:checked')).map(cb => cb.value);

        if (analyzeChecked.length === 0) {
            alert("Please select at least one column for analysis.");
            return;
        }
        showLoading();
        const statsTableDiv = document.getElementById('stats-table');
        const histImgDiv = document.getElementById('histograms-image');
        statsTableDiv.innerHTML = '';
        histImgDiv.innerHTML = '';
        const barColor = document.getElementById('hist_bar_color').value || "#008000";
        const barWidth = parseFloat(document.getElementById('hist_bar_width').value) || 0.8;
        const labelFontsize = parseInt(document.getElementById('hist_label_fontsize').value) || 14;
        const ticksFontsize = parseInt(document.getElementById('hist_ticks_fontsize').value) || 10;
        const kdeLine = document.getElementById('hist_kde_line').checked;
        fetch('/visu/show_stat_table/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
            session_id: window.sessionId,
            columns: analyzeChecked,
            filter_columns: filterChecked
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.html_stats) {
            statsTableDiv.innerHTML = data.html_stats;
            const table = statsTableDiv.querySelector('table');
            if (table && table.rows.length > 0 && table.rows[0].cells.length > 0) {
                table.rows[0].cells[0].textContent = "Parameter";
            }
            return fetch('/visu/show_histograms/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                session_id: window.sessionId,
                columns: analyzeChecked,
                label_fontsize: labelFontsize,
                ticks_fontsize: ticksFontsize,
                bar_color: barColor,
                bar_width: barWidth,
                kde_line: kdeLine
                })
            })
            .then(res2 => res2.json())
            .then(histData => {
                if(histData.img_url){
                histImgDiv.innerHTML =
                    `<img src="${histData.img_url}" alt="Histograms" style="max-width:100%;">` +
                    `<div><a href="${histData.img_url}" download="histograms.png" class="predict-btn" 
                        style="display:inline-block;text-decoration:none;width:40%;padding:8px 16px;margin-top:10px;">
                        <i class="fa fa-download"></i> Download Histograms</a></div>`;
                } else if (histData.error) {
                histImgDiv.innerHTML = `<div class="error">${histData.error}</div>`;
                }
            });
            } else if (data.error) {
            statsTableDiv.innerHTML = `<div class="error">${data.error}</div>`;
            return Promise.reject();
            }
        })
        .catch(err => {
            if (!statsTableDiv.innerHTML)
            statsTableDiv.innerHTML = "<div class='error'>Error retrieving statistics.</div>";
        })
        .finally(() => {
            hideLoading();
        });

        });
    }
});
