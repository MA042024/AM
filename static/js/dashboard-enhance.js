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

    // Shared Workspaces: clicking anywhere on a row opens "View Content",
    // except when the click lands on the row's own Actions dropdown.
    document.querySelectorAll('#content tr.workspace-row').forEach(function (row) {
        row.addEventListener('click', function (event) {
            if (event.target.closest('.workspace-actions')) {
                return;
            }
            var href = row.dataset.href;
            if (href) {
                window.location.href = href;
            }
        });
    });

    // The Change owner / Change workspace modals render a native <select>
    // server-side and inject it via AJAX. A native option list can't be
    // restyled to match the rest of the page, so each one is enhanced into
    // the site's custom .ws-dropdown as soon as it lands in the DOM. The
    // original <select> stays (hidden) as the value source, so the
    // vendored JS reading/writing it keeps working unchanged.
    ['#change-owner-form-container', '#assign-workspace-form'].forEach(function (containerId) {
        var container = document.querySelector(containerId);
        if (!container) {
            return;
        }
        new MutationObserver(function () {
            var select = container.querySelector('select');
            if (select) {
                enhanceSelectDropdown(select);
            }
        }).observe(container, { childList: true, subtree: true });
    });
});

function enhanceSelectDropdown(select) {
    if (!select || select.dataset.wsEnhanced) {
        return;
    }
    select.dataset.wsEnhanced = 'true';
    select.classList.add('ws-native-select');

    var wrapper = document.createElement('div');
    wrapper.className = 'ws-dropdown';

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'ws-dropdown-toggle';
    toggle.setAttribute('aria-haspopup', 'listbox');
    toggle.setAttribute('aria-expanded', 'false');

    var valueSpan = document.createElement('span');
    valueSpan.className = 'ws-dropdown-value';
    var arrow = document.createElement('span');
    arrow.className = 'ws-dropdown-arrow';
    toggle.appendChild(valueSpan);
    toggle.appendChild(arrow);

    var list = document.createElement('ul');
    list.className = 'ws-dropdown-list';
    list.setAttribute('role', 'listbox');

    function refresh() {
        var selectedOption = select.options[select.selectedIndex];
        valueSpan.textContent = selectedOption ? selectedOption.textContent : '';
        list.querySelectorAll('.ws-dropdown-option').forEach(function (opt) {
            var isSelected = opt.dataset.value === select.value;
            opt.classList.toggle('selected', isSelected);
            opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
    }

    Array.prototype.forEach.call(select.options, function (option) {
        var li = document.createElement('li');
        li.className = 'ws-dropdown-option';
        li.textContent = option.textContent;
        li.dataset.value = option.value;
        li.setAttribute('role', 'option');
        li.addEventListener('click', function () {
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            refresh();
            closeDropdown();
        });
        list.appendChild(li);
    });

    function openDropdown() {
        wrapper.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }
    function closeDropdown() {
        wrapper.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
        if (wrapper.classList.contains('open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            closeDropdown();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    wrapper.appendChild(toggle);
    wrapper.appendChild(list);
    refresh();
}
