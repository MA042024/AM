/*DA1*/
document.addEventListener('DOMContentLoaded', function() {
    const uploadTrigger = document.getElementById('upload-trigger');
    const fileInput = document.getElementById('excel-file');
    const sheetSection = document.getElementById('sheet-section');
    const sheetNameSelect = document.getElementById('sheet_name');
    const deployBtn = document.getElementById('deploy-btn');
    uploadTrigger.addEventListener('click', function() {
        fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('excelFile', file);
            fetch('/visu/get_excel_sheets/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => response.json())
            .then(data => {
                sheetNameSelect.innerHTML = '';
                if (data.sheets) {
                    data.sheets.forEach(name => {
                        let opt = document.createElement('option');
                        opt.value = name;
                        opt.textContent = name;
                        sheetNameSelect.appendChild(opt);
                    });
                    sheetSection.style.display = '';
                    window.uploadedFilePath = data.file_path;
                } else {
                    alert('Could not extract sheet names.');
                }
            })
            .catch(error => {
                alert('Error uploading file.');
                console.error(error);
            });
        }
    });
    deployBtn.addEventListener('click', function() {
        removeOldDeployMessage();
        const selectedSheet = sheetNameSelect.value;
        const startRow = document.getElementById('start_row').value;
        const filePath = window.uploadedFilePath;
        const sessionId = window.sessionId || (window.sessionId = uuidv4());
        if (!selectedSheet || !startRow || !filePath) {
            alert('Please select a sheet, enter a start row, and upload a file.');
            return;
        }
        showLoading();
        fetch('/visu/deploy_df/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                file_path: filePath,
                sheet_name: selectedSheet,
                start_row: startRow,
                session_id: sessionId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || 'Unknown error');
            }
            return fetch('/visu/get_columns/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({session_id: sessionId}),
            });
        })
        .then(resp => resp.json())
        .then(data => {
            if (!data.columns || data.columns.length === 0) {
                throw new Error("DataFrame could not be validated (no columns found).");
            }
            hideLoading();
            let deployMessage = document.createElement('div');
            deployMessage.id = 'deploy-message';
            /*deployMessage.textContent = `✅ Deployed successfully: ${filePath.split(/[\\/]/).pop()}`;*/
            deployMessage.textContent = `✅ Deployed successfully: ${fileInput.files[0].name}`;
            deployBtn.parentNode.insertBefore(deployMessage, deployBtn.nextSibling);
            deployMessage.style.display = 'block';
        })
        .catch(error => {
            hideLoading();
            alert(error.message || 'Error deploying/validating DataFrame.');
            console.error(error);
        });
    });
});
function removeOldDeployMessage() {
    const oldMessage = document.getElementById('deploy-message');
    if (oldMessage) {
        oldMessage.remove();
    }
}
