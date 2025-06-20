/*DA4*/
document.addEventListener('DOMContentLoaded', function() {
    function setupDA4() {
        const form = document.getElementById('correlation-form');
        const noDataMsg = document.querySelector('#subtab-DA4 .no-data-message');
        const columnsDiv = document.getElementById('correlation-columns');
        const resultDiv = document.getElementById('correlation-result');

        document.querySelector('.subbar-btn[data-subtab="DA4"]').addEventListener('click', function() {
            showLoading();
            form.style.display = 'none';
            noDataMsg.style.display = '';
            columnsDiv.innerHTML = '';
            resultDiv.innerHTML = '';
            if (!window.sessionId) {
                hideLoading();
                return;
            }
            fetch('/visu/get_columns/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                body: JSON.stringify({session_id: window.sessionId})
            })
            .then(res => res.json())
            .then(data => {
                if (data.columns && data.columns.length > 0) {
                form.style.display = '';
                noDataMsg.style.display = 'none';
                columnsDiv.innerHTML = '';
                data.columns.forEach(col => {
                    const lbl = document.createElement('label');
                    lbl.innerHTML = `<input type="checkbox" name="corr_cols" value="${col}"> ${col}`;
                    columnsDiv.appendChild(lbl);
                });
                }
            })
            .finally(() => {
                hideLoading();
            });
            const hueMinSlider = document.getElementById('hue_start');
            const hueMaxSlider = document.getElementById('hue_end');
            const hueMinBox = document.getElementById('hue_start_value');
            const hueMaxBox = document.getElementById('hue_end_value');
            function updateHueColor(el, value) {
                el.style.backgroundColor = `hsl(${value}, 100%, 50%)`;
                el.title = `${value}°`;
            }
            updateHueColor(hueMinBox, hueMinSlider.value);
            updateHueColor(hueMaxBox, hueMaxSlider.value);
            hueMinSlider.addEventListener('input', function() {
                updateHueColor(hueMinBox, this.value);
            });
            hueMaxSlider.addEventListener('input', function() {
                updateHueColor(hueMaxBox, this.value);
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const checkedCols = Array.from(document.querySelectorAll('#correlation-columns input:checked')).map(cb => cb.value);
            if (!checkedCols.length) {
                resultDiv.innerHTML = '<div class="error">Please select at least two columns.</div>';
                return;
            }
            resultDiv.innerHTML = '';
            showLoading();
            function paramOrDefault(id, defaultVal) {
                const el = document.getElementById(id);
                if (!el) return defaultVal;
                if (el.type === "checkbox") return el.checked;
                if (el.type === "number") return el.value !== "" ? parseFloat(el.value) : defaultVal;
                if (el.type === "color" || el.type === "range") return el.value || defaultVal;
                return el.value !== "" ? el.value : defaultVal;
            }
            fetch('/visu/show_correlation/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    session_id: window.sessionId,
                    columns: checkedCols,
                    corr_method: paramOrDefault("corr_method", "pearson"),
                    box_padding: paramOrDefault("box_padding", 0.15),
                    corr_fontsize: paramOrDefault("corr_fontsize", 14),
                    axis_fontsize: paramOrDefault("axis_fontsize", 16),
                    hist_color: paramOrDefault("hist_color", "#808080"),
                    line_color: paramOrDefault("line_color", "#ff0000"),
                    scatter_color: paramOrDefault("scatter_color", "#008000"),
                    scatter_alpha: paramOrDefault("scatter_alpha", 0.7),
                    hue_start: paramOrDefault("hue_start", 10),
                    hue_end: paramOrDefault("hue_end", 220),
                    palette_saturation: paramOrDefault("palette_saturation", 99)
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.img_url) {
                    resultDiv.innerHTML = `
                        <img src="${data.img_url}" alt="Correlation Matrix" style="max-width:100%;margin-bottom:10px;">
                        <br>
                        <a href="${data.img_url}" download="correlation_matrix.png" class="predict-btn" style="display: inline-block;text-decoration: none;width:40%;padding:8px 16px;margin-top:10px;">
                            <i class="fa fa-download"></i> Download Image
                        </a>
                    `;
                } else if (data.error) {
                    resultDiv.innerHTML = '<div class="error">' + data.error + '</div>';
                } else {
                    resultDiv.innerHTML = '<div class="error">Could not generate plot.</div>';
                }
            })
            .finally(() => {
                hideLoading();
            });
        });
    }
    if (document.getElementById('correlation-form')) setupDA4();
});

window.showLoading = function(msg) {
    var overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
    if (msg) overlay.querySelector('div > div:last-child').textContent = msg;
};
window.hideLoading = function() {
    document.getElementById('loading-overlay').style.display = 'none';
};
