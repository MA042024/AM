$(document).ready(function() {
    ["id_global_templates", "id_user_templates"].forEach(function(prefix) {
        var $inputs = $("input[id^='" + prefix + "']");
        if ($inputs.length && $inputs.filter(":checked").length === 0) {
            $inputs.prop("checked", true).trigger("change");
        }
    });
});
