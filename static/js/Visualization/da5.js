/*DA5*/
document.addEventListener("DOMContentLoaded", function() {
    function setupDA5() {
        const form = document.getElementById("single-plot-form");
        const xSelect = document.getElementById("x-col");
        const ySelect = document.getElementById("y-col");
        const resultDiv = document.getElementById("single-plot-result");
        const noDataMsg = document.querySelector('#subtab-DA5 .no-data-message');
        document.querySelector('.subbar-btn[data-subtab="DA5"]').addEventListener('click', function() {
        showLoading();
        form.style.display = 'none';
        noDataMsg.style.display = '';
        xSelect.innerHTML = "";
        ySelect.innerHTML = "";
        resultDiv.innerHTML = "";
        if (!window.sessionId) {
            hideLoading();
            return;
        }
        fetch('/visu/get_columns/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ session_id: window.sessionId }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.columns && data.columns.length > 1) {
            data.columns.forEach(function(col) {
                let xopt = document.createElement("option");
                xopt.value = col; xopt.textContent = col;
                let yopt = xopt.cloneNode(true);
                xSelect.appendChild(xopt); ySelect.appendChild(yopt);
            });
            form.style.display = ''; noDataMsg.style.display = 'none';
            } else {
            noDataMsg.textContent = "Need at least two numeric columns.";
            form.style.display = 'none';
            }
        })
        .finally(() => { hideLoading(); });
        });

        form.addEventListener("submit", function(e) {
        e.preventDefault();
        resultDiv.innerHTML = "";
        showLoading();
        const fields = {
            session_id: window.sessionId,
            x: xSelect.value, y: ySelect.value,
            color: document.getElementById('color').value,
            marker: document.getElementById('marker').value,
            title: document.getElementById('title').value,
            xlabel: document.getElementById('xlabel').value,
            ylabel: document.getElementById('ylabel').value,
            title_fontsize: parseInt(document.getElementById('title_fontsize').value) || 14,
            label_fontsize: parseInt(document.getElementById('label_fontsize').value) || 12,
            tick_fontsize: parseInt(document.getElementById('tick_fontsize').value) || 12,
            xmin: document.getElementById('xmin').value === "" ? null : parseFloat(document.getElementById('xmin').value),
            xmax: document.getElementById('xmax').value === "" ? null : parseFloat(document.getElementById('xmax').value),
            ymin: document.getElementById('ymin').value === "" ? null : parseFloat(document.getElementById('ymin').value),
            ymax: document.getElementById('ymax').value === "" ? null : parseFloat(document.getElementById('ymax').value),
            figsize: [
            parseFloat(document.getElementById('figsize1').value) || 8,
            parseFloat(document.getElementById('figsize2').value) || 6
            ],
            add_corr_title: document.getElementById('add_corr_title').checked,
            corr_type: document.getElementById('corr_type').value,
            show_trendline: document.getElementById('show_trendline').checked,
            trendline_color: document.getElementById('trendline_color').value,
            trendline_style: document.getElementById('trendline_style').value,
            trendline_width: parseFloat(document.getElementById('trendline_width').value) || 2,
            show_ci: document.getElementById('show_ci').checked
        };
        fetch('/visu/single_plot/', {
            method: "POST",
            headers: { "Content-Type": "application/json", 'X-CSRFToken': csrftoken },
            body: JSON.stringify(fields),
        })
        .then(res => res.json())
        .then(data => {
            if (data.img_url) {
            resultDiv.innerHTML = `
                <img src="${data.img_url}" alt="Single Plot" style="max-width:100%; margin-bottom:10px;">
                <br>
                <a href="${data.img_url}" download="singleplot.png" class="predict-btn" 
                style="display:inline-block;text-decoration:none;width:40%;padding:8px 16px;margin-top:10px;">
                <i class="fa fa-download"></i> Download Image
                </a>
            `;
            } else if (data.error) {
            resultDiv.innerHTML = '<div class="error">' + data.error + '</div>';
            } else {
            resultDiv.innerHTML = '<div class="error">Could not generate plot.</div>';
            }
        })
        .catch(() => {
            resultDiv.innerHTML = '<div class="error">Plotting failed.</div>';
        })
        .finally(() => { hideLoading(); });
        });
    }
    if(document.getElementById('card-DA5')) setupDA5();
});
