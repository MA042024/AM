/*DA2*/
function renderDA2Table(columns) {
    const table = document.getElementById('da2-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    columns.forEach(col => {
        const row = document.createElement('tr');
        row.setAttribute('data-column', col);

        row.innerHTML = `
        <td class="da2-col-name">${col}</td>
        <td>
            <input type="text" class="da2-rename-input" value="${col}" />
            <button class="da2-rename-btn" title="Rename">
            <i class="fa fa-check"></i>
            </button>
        </td>
        <td>
            <button class="da2-delete-btn" title="Delete">
            <i class="fa fa-trash"></i>
            </button>
        </td>
        `;

        tbody.appendChild(row);
    });
    table.style.display = '';
    document.querySelector('#subtab-DA2 .no-data-message').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.subbar-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.getAttribute('data-subtab') === 'DA2') {
                showLoading();
                if (window.sessionId) {
                    fetch('/visu/get_all_columns/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                        body: JSON.stringify({session_id: window.sessionId})
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.columns && data.columns.length) {
                            renderDA2Table(data.columns);
                        } else {
                            document.getElementById('da2-table').style.display = 'none';
                            document.querySelector('#subtab-DA2 .no-data-message').style.display = '';
                        }
                    })
                    .finally(() => { hideLoading(); });
                } else {
                    document.getElementById('da2-table').style.display = 'none';
                    document.querySelector('#subtab-DA2 .no-data-message').style.display = '';
                    hideLoading();
                }
            }
        });
    });

    document.getElementById('da2-table').addEventListener('click', function(event) {
        if (event.target.closest('.da2-rename-btn')) {
            const btn = event.target.closest('.da2-rename-btn');
            const row = btn.closest('tr');
            const oldName = row.getAttribute('data-column');
            const newName = row.querySelector('.da2-rename-input').value.trim();
            if (!newName || newName === oldName) return;
            /*showLoading();*/
            fetch('/visu/rename_column/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    session_id: window.sessionId,
                    old_name: oldName,
                    new_name: newName
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    row.querySelector('.da2-col-name').textContent = newName;
                    row.setAttribute('data-column', newName);
                    row.querySelector('.da2-rename-input').value = newName;
                } else {
                    alert(data.error || "Rename failed");
                }
            });
            /*.finally(() => { hideLoading(); });*/
        }

        if (event.target.closest('.da2-delete-btn')) {
            const btn = event.target.closest('.da2-delete-btn');
            const row = btn.closest('tr');
            const colName = row.getAttribute('data-column');
            const modal = document.createElement('div');
            modal.className = 'da2-confirm-modal';
            modal.innerHTML = `<div class="da2-confirm-box">
                <p>Delete column "<b>${colName}</b>"?</p>
                <button class="yes">Delete</button>
                <button class="no">Cancel</button>
            </div>`;
            document.body.appendChild(modal);
            modal.querySelector('.no').onclick = () => modal.remove();
            modal.querySelector('.yes').onclick = function() {
                /*showLoading();*/
                fetch('/visu/delete_column/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                    body: JSON.stringify({
                        session_id: window.sessionId,
                        column_name: colName
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        row.remove();
                    } else {
                        alert(data.error || "Delete failed");
                    }
                    modal.remove();
                });
                /*.finally(() => { hideLoading(); });*/
            };
        }
    });
});
