document.addEventListener('DOMContentLoaded', function () {
    // Shared Workspaces table renders booleans as literal "True"/"False"
    // text (core_dashboard_common_app has no template hook to swap the
    // wording). Only touches cells whose *entire* content is exactly
    // "True"/"False" with no child elements, to avoid catching record
    // data that might legitimately contain that word.
    document.querySelectorAll('#content table.table-striped td').forEach(function (td) {
        if (td.children.length > 0) {
            return;
        }
        var text = td.textContent.trim();
        if (text === 'True') {
            td.textContent = 'Yes';
        } else if (text === 'False') {
            td.textContent = 'No';
        }
    });
});
