// Live Insights
document.addEventListener('DOMContentLoaded', function () {
    var state = { scope: 'all', workspaceIds: [], mixTypes: [], years: [], binderGrades: [], activeTest: null, initialized: false, wsMatches: [], wsHighlight: -1, correlationExpanded: false };
    var charts = {};
    var chartRegistry = {};
    var allWorkspaces = [];
    var lastUpdated = null;
    var overviewRequestSeq = 0;
    var testDetailRequestSeq = 0;
    var modalOverlay = null;

    // Defined early (createTagFilter itself is a hoisted function declaration
    // further down) so simpleFilters is populated before initLiveInsightsOnce
    // can possibly fire synchronously below.
    var mixTypeFilter = createTagFilter({
        stateKey: 'mixTypes', prefix: 'li-mixtype', paramName: 'mix_type',
        endpoint: '/visu/live-insights/mix-types/', responseKey: 'mix_types',
        emptyLabel: 'No mix types found'
    });
    var yearFilter = createTagFilter({
        stateKey: 'years', prefix: 'li-year', paramName: 'year',
        endpoint: '/visu/live-insights/years/', responseKey: 'years',
        emptyLabel: 'No years found'
    });
    var binderGradeFilter = createTagFilter({
        stateKey: 'binderGrades', prefix: 'li-binder-grade', paramName: 'binder_grade',
        endpoint: '/visu/live-insights/binder-grades/', responseKey: 'binder_grades',
        emptyLabel: 'No binder grades found'
    });
    var simpleFilters = [mixTypeFilter, yearFilter, binderGradeFilter];

    var ACCENT = '#3CACA8';
    var CATEGORY_PALETTE = ['#3CACA8', '#5B8DEF', '#F2B84B', '#E8695D', '#8C6FE0', '#4FBF7F', '#EC7FB0', '#7D8CA3'];

    var BARREL_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<ellipse cx="12" cy="5" rx="6" ry="2.2"></ellipse>' +
        '<path d="M6 5 L6 19 C6 20.2 8.7 21.2 12 21.2 C15.3 21.2 18 20.2 18 19 L18 5"></path>' +
        '<line x1="6" y1="10.5" x2="18" y2="10.5"></line>' +
        '<line x1="6" y1="15.5" x2="18" y2="15.5"></line>' +
        '</svg>';

    var EXPAND_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline>' +
        '<line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
    var IMAGE_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle>' +
        '<polyline points="21 15 16 10 5 21"></polyline></svg>';
    var CSV_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
        '<polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="11" x2="12" y2="17"></line>' +
        '<polyline points="9.5 14.5 12 17 14.5 14.5"></polyline></svg>';
    var CLOSE_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" ' +
        'stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"></line>' +
        '<line x1="19" y1="5" x2="5" y2="19"></line></svg>';
    var INFO_ICON = '<i class="fa fa-info-circle"></i>';

    var MIXING_METHOD_TIP = 'The name of the mixing method used.';
    var TARGET_BINDER_GRADE_TIP = 'The target binder grade, as reported in the form X/Y-Z or any other format.';
    var YEAR_TIP = 'Year when the work referenced by the data was completed.';
    var SIEVE_COMPOSITION_TIP = 'The distribution of grain sizes by mass for the aggregates.';
    var SIEVE_RECOVERED_TIP = 'The distribution of grain sizes by mass for the recovered aggregates.';
    var RECORDS_BY_TEST_TIP = 'Number of curated records for each test type.';
    var TOTAL_RECORDS_TIP = 'Total number of curated records in the current scope.';
    var BINDER_CONTENT_TIP = 'The percentage by mass of the binder, including that extracted from the reclaimed asphalt, to the total mass of the bituminous mixture according to EN 12697-1.';
    var RAP_CONTENT_TIP = 'The percentage by mass of the reclaimed asphalt to the total mass of the bituminous mixture.';
    var MAX_DENSITY_TIP = 'The value of the maximum density of the bituminous specimen, expressed in Mg/m³.';
    var RECOVERED_PENETRATION_TIP = 'The measured penetration of a standard needle at 25°C in the recovered binder, according to EN 1426, expressed in tenths of a millimeter.';
    var RECOVERED_SOFTENING_POINT_TIP = 'The temperature at which the recovered binder begins to soften and lose its rigidity, according to EN 1427.';
    var RECOVERED_ELASTIC_RECOVERY_TIP = 'The elastic recovery of the recovered binder at 25°C, according to EN 13398.';

    // Decimal places for numeric metric cards, per field key -- covers both
    // the explicit mixture-level cards below and the data-driven per-test
    // results grid (keyed the same way as TEST_RESULT_FIELDS/MIXTURE_NUMERIC_
    // FIELDS in live_insights_fields.py). Falls back to 2 when a key isn't
    // listed here.
    var FIELD_DECIMALS = {
        rap_content: 1,
        max_density: 3,
        recovered_penetration: 0,
        recovered_softening_point: 1,
        recovered_elastic_recovery: 1,
        bulk_density: 3,
        air_voids: 1,
        vma: 1,
        vfb: 1,
        stability: 1,
        flow: 1,
        marshall_quotient: 1
    };

    var STATIC_CHART_TOOLTIPS = {
        'li-chart-tests': RECORDS_BY_TEST_TIP,
        'li-chart-mixing-method': MIXING_METHOD_TIP,
        'li-chart-binder-grade': TARGET_BINDER_GRADE_TIP,
        'li-chart-year': YEAR_TIP,
        'li-chart-sieve-composition': SIEVE_COMPOSITION_TIP,
        'li-chart-sieve-recovered': SIEVE_RECOVERED_TIP,
        'li-chart-test-mixing-method': MIXING_METHOD_TIP,
        'li-chart-test-binder-grade': TARGET_BINDER_GRADE_TIP,
        'li-chart-test-year': YEAR_TIP,
        'li-chart-test-sieve-composition': SIEVE_COMPOSITION_TIP,
        'li-chart-test-sieve-recovered': SIEVE_RECOVERED_TIP
    };

    var TEST_RESULT_TOOLTIPS = {
        marshall: {
            stability: 'The corrected maximum load, expressed in kilonewtons kN.',
            flow: 'The deformation in millimetres (mm), at maximum load minus the nominal deformation obtained by extrapolation of the tangent of the graph of load against deformation back to zero load, according to EN 12697-34.',
            marshall_quotient: 'The ratio of the stability to the flow, expressed in kilonewtons kN per millimetres mm.',
            bulk_density: 'The value of the bulk density of the bituminous specimen, expressed in Mg/m³.',
            air_voids: 'The percentage of air voids in the bituminous sample.',
            vma: 'The percentage of voids in the mineral aggregate (VMA) in the bituminous sample.',
            vfb: 'The percentage of voids filled with bitumen in the bituminous sample.'
        },
        its: {
            test_temperature: 'The temperature at which the Indirect Tensile Strength test was conducted, measured in Degrees Celsius.',
            itsr: 'The ratio of the indirect tensile strength of the wet specimens to that of dry specimens using Method A in EN 12697-12, expressed in percent.',
            its_dry: 'The value of the maximum tensile stress calculated from the peak load, expressed in kilo-Pascals kPa.',
            its_wet: 'The value of the maximum tensile stress calculated from the peak load, expressed in kilo-Pascals kPa.'
        },
        rutting: {
            test_temperature: 'The temperature at which the rutting test was conducted, measured in Degrees Celsius.',
            rut_depth: 'The average depth of a rut at the corresponding measurement cycle for a group of samples, expressed as a percentage.'
        },
        stiffness: {
            stiffness_modulus: 'The stiffness modulus measured according to EN 12697-26, expressed in Megapascal.'
        },
        tsrst: {
            start_temperature: 'The starting temperature of the test, measured in Degrees Celsius.',
            temperature_rate: 'The rate of change of the temperature throughout the test, measured in Degrees Celsius per hour.',
            failure_stress: 'The cryogenic stress that causes a failure of the specimen in the TSRST according to EN 12697-46, measured in Megapascal.',
            failure_temperature: 'The temperature at which the cryogenic stress causes a failure of the specimen in the TSRST according to EN 12697-46, measured in Degrees Celsius.'
        },
        utst: {
            test_temperature: 'The temperature at which the test was conducted, measured in Degrees Celsius.',
            deformation_rate: 'The applied deformation rate throughout the test, expressed in percent per minute.',
            tensile_strength: 'The maximum tensile stress measured in the UTST according to EN 12697-46, expressed in Megapascal.',
            failure_strain: 'The tensile strain measured when the tensile strength has been reached according to EN 12697-46, expressed in percentage.'
        }
    };

    function infoTooltip(text) {
        if (!text) return '';
        return '<span class="li-info">' +
            '<span class="li-info-icon" role="button" tabindex="0" aria-label="More info">' + INFO_ICON + '</span>' +
            '<span class="li-info-text">' + text + '</span>' +
            '</span>';
    }

    // Capture phase: some info icons sit inside a clickable card, and a
    // bubble-phase listener would fire after the card's own handler already did.
    function setupInfoTooltips() {
        document.addEventListener('click', function (e) {
            var icon = e.target.closest && e.target.closest('.li-info-icon');
            if (icon) {
                e.stopPropagation();
                var text = icon.parentElement.querySelector('.li-info-text');
                var wasOpen = text.classList.contains('show');
                document.querySelectorAll('.li-info-text.show').forEach(function (t) { t.classList.remove('show'); });
                if (!wasOpen) text.classList.add('show');
                return;
            }
            document.querySelectorAll('.li-info-text.show').forEach(function (t) { t.classList.remove('show'); });
        }, true);
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
            var active = document.activeElement;
            if (active && active.classList && active.classList.contains('li-info-icon')) {
                e.preventDefault();
                e.stopPropagation();
                active.click();
            }
        }, true);

        document.addEventListener('mouseover', function (e) {
            var icon = e.target.closest && e.target.closest('.li-info-icon');
            if (!icon) return;
            var text = icon.parentElement.querySelector('.li-info-text');
            document.querySelectorAll('.li-info-text.show').forEach(function (t) { if (t !== text) t.classList.remove('show'); });
            text.classList.add('show');
        });
        document.addEventListener('mouseout', function (e) {
            var icon = e.target.closest && e.target.closest('.li-info-icon');
            if (!icon || icon.contains(e.relatedTarget)) return;
            icon.parentElement.querySelector('.li-info-text').classList.remove('show');
        });
    }

    function injectStaticTooltips() {
        Object.keys(STATIC_CHART_TOOLTIPS).forEach(function (canvasId) {
            var canvas = document.getElementById(canvasId);
            var card = canvas && canvas.closest('.li-chart-card');
            var h3 = card && card.querySelector('h3');
            if (h3) h3.insertAdjacentHTML('beforeend', infoTooltip(STATIC_CHART_TOOLTIPS[canvasId]));
        });
    }

    var moreTabBtn = document.querySelector('.tab-btn[data-tab="more"]');
    if (!moreTabBtn) return;
    moreTabBtn.addEventListener('click', initLiveInsightsOnce);
    if (moreTabBtn.classList.contains('active')) initLiveInsightsOnce();

    function initLiveInsightsOnce() {
        if (state.initialized) return;
        state.initialized = true;
        setupChartTheme();
        setupScopeToggle();
        setupRefreshButton();
        setupClearFilters();
        simpleFilters.forEach(function (f) { f.setup(); });
        setupInfoTooltips();
        injectStaticTooltips();
        loadWorkspaces();
        loadTests();
        loadOverview();
    }

    function setupChartTheme() {
        if (!window.Chart) return;
        var muted = cssVar('--text-muted', '#64748b');
        Chart.defaults.font.family = "'Inter', Arial, sans-serif";
        Chart.defaults.color = muted;
        Chart.defaults.borderColor = 'rgba(148,163,184,0.18)';
        Chart.defaults.plugins.tooltip.backgroundColor = cssVar('--accent-dark', '#287371');
        Chart.defaults.plugins.tooltip.titleColor = '#fff';
        Chart.defaults.plugins.tooltip.bodyColor = '#fff';
        Chart.defaults.plugins.tooltip.titleFont = { family: "'Inter', Arial, sans-serif", weight: '700' };
        Chart.defaults.plugins.tooltip.bodyFont = { family: "'Inter', Arial, sans-serif" };
        Chart.defaults.plugins.tooltip.padding = { top: 8, bottom: 8, left: 12, right: 12 };
        Chart.defaults.plugins.tooltip.cornerRadius = 10;
    }

    function cssVar(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name);
        return v ? v.trim() || fallback : fallback;
    }

    function setupScopeToggle() {
        document.querySelectorAll('.li-scope-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.li-scope-btn').forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');
                state.scope = this.getAttribute('data-scope');
                document.getElementById('li-workspace-select').classList.toggle('show', state.scope === 'workspace');
                resetFilters();
                refreshAll();
            });
        });
    }

    function setupRefreshButton() {
        var btn = document.getElementById('li-refresh-btn');
        if (!btn) return;
        btn.addEventListener('click', function () {
            btn.classList.add('li-refresh-spinning');
            Promise.resolve(refreshAll()).then(function () {
                btn.classList.remove('li-refresh-spinning');
            });
        });
    }

    function setupClearFilters() {
        var btn = document.getElementById('li-clear-filters');
        if (!btn) return;
        btn.addEventListener('click', function () {
            state.workspaceIds = [];
            renderWorkspaceChips();
            updateClearFiltersVisibility();
            simpleFilters.forEach(function (f) { f.clearSelection(); f.refreshOptions(); });
            deselectActiveTest();
            refreshAll();
        });
    }

    function updateClearFiltersVisibility() {
        var btn = document.getElementById('li-clear-filters');
        if (btn) btn.classList.toggle('show', state.scope === 'workspace' && state.workspaceIds.length > 0);
    }

    function deselectActiveTest() {
        // Filters changed underneath whatever test was selected -- its
        // results no longer reflect the current filter set, so force the
        // user to reopen a test tab rather than silently showing stale
        // (or momentarily race-condition-stale) data.
        testDetailRequestSeq++;
        state.activeTest = null;
        document.querySelectorAll('.li-subbar-btn').forEach(function (b) { b.classList.remove('active'); });
        toggle('li-test-detail', false);
        toggle('li-test-loading', false);
        var emptyEl = document.getElementById('li-test-empty');
        if (emptyEl) emptyEl.textContent = 'No test selected.';
        toggle('li-test-empty', true);
    }

    function resetFilters() {
        state.workspaceIds = [];
        renderWorkspaceChips();
        updateClearFiltersVisibility();
        var search = document.getElementById('li-workspace-search');
        if (search) search.value = '';
        simpleFilters.forEach(function (f) { f.clearSelection(); f.updateSelectVisibility(); });
        deselectActiveTest();
    }

    function refreshAll() {
        var overview = loadOverview();
        var detail = state.activeTest ? loadTestDetail(state.activeTest) : null;
        return Promise.all([overview, detail]);
    }

    function loadWorkspaces() {
        var wsBtn = document.querySelector('.li-scope-btn[data-scope="workspace"]');
        if (wsBtn && wsBtn.disabled) return;
        fetch('/visu/live-insights/workspaces/', { credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                allWorkspaces = data.workspaces || [];
                setupWorkspaceTagInput();
            })
            .catch(function () {});
    }

    function setupWorkspaceTagInput() {
        var wrapper = document.getElementById('li-workspace-tags');
        var search = document.getElementById('li-workspace-search');

        search.addEventListener('input', function () { renderWorkspaceOptions(this.value); });
        search.addEventListener('focus', function () { renderWorkspaceOptions(this.value); });
        search.addEventListener('click', function () { renderWorkspaceOptions(this.value); });
        search.addEventListener('keydown', handleWorkspaceSearchKeydown);
        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) closeWorkspaceOptions();
        });
    }

    function closeWorkspaceOptions() {
        document.getElementById('li-workspace-options').style.display = 'none';
        state.wsMatches = [];
        state.wsHighlight = -1;
    }

    function findWorkspace(id) {
        for (var i = 0; i < allWorkspaces.length; i++) {
            if (String(allWorkspaces[i].id) === id) return allWorkspaces[i];
        }
        return null;
    }

    function renderWorkspaceOptions(query) {
        var q = (query || '').trim().toLowerCase();
        state.wsMatches = allWorkspaces.filter(function (ws) {
            return state.workspaceIds.indexOf(String(ws.id)) === -1 &&
                ws.title.toLowerCase().indexOf(q) !== -1;
        });
        state.wsHighlight = state.wsMatches.length ? 0 : -1;
        renderWorkspaceOptionsList();
    }

    function renderWorkspaceOptionsList() {
        var optionsList = document.getElementById('li-workspace-options');
        optionsList.innerHTML = '';
        if (!state.wsMatches.length) {
            var empty = document.createElement('div');
            empty.className = 'li-tag-empty';
            empty.textContent = 'No workspaces found';
            optionsList.appendChild(empty);
            optionsList.style.display = 'block';
            return;
        }
        state.wsMatches.forEach(function (ws, idx) {
            var opt = document.createElement('div');
            opt.className = 'li-tag-option' + (idx === state.wsHighlight ? ' li-tag-option-active' : '');
            opt.textContent = ws.title + (ws.is_public ? ' (Public)' : '');
            opt.addEventListener('mouseenter', function () {
                state.wsHighlight = idx;
                optionsList.querySelectorAll('.li-tag-option').forEach(function (node, i) {
                    node.classList.toggle('li-tag-option-active', i === idx);
                });
            });
            opt.addEventListener('click', function () { addWorkspace(ws); });
            optionsList.appendChild(opt);
        });
        optionsList.style.display = 'block';
        var active = optionsList.querySelector('.li-tag-option-active');
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function handleWorkspaceSearchKeydown(e) {
        var isOpen = document.getElementById('li-workspace-options').style.display !== 'none';

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) { renderWorkspaceOptions(this.value); return; }
            if (state.wsMatches.length) {
                state.wsHighlight = (state.wsHighlight + 1) % state.wsMatches.length;
                renderWorkspaceOptionsList();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.wsMatches.length) {
                state.wsHighlight = (state.wsHighlight - 1 + state.wsMatches.length) % state.wsMatches.length;
                renderWorkspaceOptionsList();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (state.wsHighlight >= 0 && state.wsMatches[state.wsHighlight]) {
                addWorkspace(state.wsMatches[state.wsHighlight]);
            }
        } else if (e.key === 'Escape') {
            closeWorkspaceOptions();
            this.blur();
        } else if (e.key === 'Backspace' && !this.value && state.workspaceIds.length) {
            removeWorkspace(state.workspaceIds[state.workspaceIds.length - 1]);
        }
    }

    function buildChipElement(ws) {
        var chip = document.createElement('span');
        chip.className = 'li-tag-chip';
        chip.setAttribute('data-ws-id', String(ws.id));
        var text = document.createTextNode(ws.title);
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', 'Remove ' + ws.title);
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function () { removeWorkspace(String(ws.id)); });
        chip.appendChild(text);
        chip.appendChild(removeBtn);
        return chip;
    }

    function addWorkspace(ws) {
        state.workspaceIds.push(String(ws.id));
        var search = document.getElementById('li-workspace-search');
        search.value = '';
        search.focus();
        closeWorkspaceOptions();

        var chips = document.getElementById('li-workspace-chips');
        var chip = buildChipElement(ws);
        chip.classList.add('li-tag-chip-enter');
        chips.appendChild(chip);
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                chip.classList.remove('li-tag-chip-enter');
            });
        });

        updateClearFiltersVisibility();
        simpleFilters.forEach(function (f) { f.updateSelectVisibility(); f.refreshOptions(); });
        deselectActiveTest();
        refreshAll();
    }

    function removeWorkspace(id) {
        state.workspaceIds = state.workspaceIds.filter(function (w) { return w !== id; });

        var chips = document.getElementById('li-workspace-chips');
        var chip = chips.querySelector('[data-ws-id="' + id + '"]');
        if (chip) {
            chip.classList.add('li-tag-chip-leave');
            setTimeout(function () {
                if (chip.parentNode) chip.parentNode.removeChild(chip);
            }, 160);
        }

        updateClearFiltersVisibility();
        simpleFilters.forEach(function (f) { f.updateSelectVisibility(); f.refreshOptions(); });
        deselectActiveTest();
        refreshAll();
    }

    function renderWorkspaceChips() {
        var chips = document.getElementById('li-workspace-chips');
        if (!chips) return;
        chips.innerHTML = '';
        state.workspaceIds.forEach(function (id) {
            var ws = findWorkspace(id);
            if (ws) chips.appendChild(buildChipElement(ws));
        });
    }

    // ---------- Simple tag filters (Mix Type / Year / Binder Grade) ----------
    // All three are single-string-value, workspace-scoped filters sharing
    // identical UI behavior (tag input with autocomplete dropdown) - built
    // once as a factory instead of tripling the same ~180 lines per field.

    function createTagFilter(config) {
        var allValues = [];
        var matches = [];
        var highlight = -1;
        var ready = false;

        function el(suffix) { return document.getElementById(config.prefix + suffix); }

        function closeOptions() {
            var optionsList = el('-options');
            if (optionsList) optionsList.style.display = 'none';
            matches = [];
            highlight = -1;
        }

        function renderOptions(query) {
            var q = (query || '').trim().toLowerCase();
            var current = state[config.stateKey];
            matches = allValues.filter(function (value) {
                return current.indexOf(value) === -1 && value.toLowerCase().indexOf(q) !== -1;
            });
            highlight = matches.length ? 0 : -1;
            renderOptionsList();
        }

        function renderOptionsList() {
            var optionsList = el('-options');
            optionsList.innerHTML = '';
            if (!matches.length) {
                var empty = document.createElement('div');
                empty.className = 'li-tag-empty';
                empty.textContent = config.emptyLabel;
                optionsList.appendChild(empty);
                optionsList.style.display = 'block';
                return;
            }
            matches.forEach(function (value, idx) {
                var opt = document.createElement('div');
                opt.className = 'li-tag-option' + (idx === highlight ? ' li-tag-option-active' : '');
                opt.textContent = value;
                opt.addEventListener('mouseenter', function () {
                    highlight = idx;
                    optionsList.querySelectorAll('.li-tag-option').forEach(function (node, i) {
                        node.classList.toggle('li-tag-option-active', i === idx);
                    });
                });
                opt.addEventListener('click', function () { addValue(value); });
                optionsList.appendChild(opt);
            });
            optionsList.style.display = 'block';
            var active = optionsList.querySelector('.li-tag-option-active');
            if (active) active.scrollIntoView({ block: 'nearest' });
        }

        function handleSearchKeydown(e) {
            var optionsList = el('-options');
            var isOpen = optionsList.style.display !== 'none';

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!isOpen) { renderOptions(this.value); return; }
                if (matches.length) {
                    highlight = (highlight + 1) % matches.length;
                    renderOptionsList();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (matches.length) {
                    highlight = (highlight - 1 + matches.length) % matches.length;
                    renderOptionsList();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlight >= 0 && matches[highlight]) {
                    addValue(matches[highlight]);
                }
            } else if (e.key === 'Escape') {
                closeOptions();
                this.blur();
            } else if (e.key === 'Backspace' && !this.value && state[config.stateKey].length) {
                removeValue(state[config.stateKey][state[config.stateKey].length - 1]);
            }
        }

        function buildChipElement(value) {
            var chip = document.createElement('span');
            chip.className = 'li-tag-chip';
            chip.setAttribute('data-value', value);
            var text = document.createTextNode(value);
            var removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.setAttribute('aria-label', 'Remove ' + value);
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', function () { removeValue(value); });
            chip.appendChild(text);
            chip.appendChild(removeBtn);
            return chip;
        }

        function addValue(value) {
            state[config.stateKey].push(value);
            var search = el('-search');
            search.value = '';
            search.focus();
            closeOptions();

            var chips = el('-chips');
            var chip = buildChipElement(value);
            chip.classList.add('li-tag-chip-enter');
            chips.appendChild(chip);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    chip.classList.remove('li-tag-chip-enter');
                });
            });

            updateClearVisibility();
            deselectActiveTest();
            refreshAll();
        }

        function removeValue(value) {
            state[config.stateKey] = state[config.stateKey].filter(function (v) { return v !== value; });

            var chips = el('-chips');
            var chip = chips.querySelector('[data-value="' + value.replace(/"/g, '\\"') + '"]');
            if (chip) {
                chip.classList.add('li-tag-chip-leave');
                setTimeout(function () {
                    if (chip.parentNode) chip.parentNode.removeChild(chip);
                }, 160);
            }

            updateClearVisibility();
            deselectActiveTest();
            refreshAll();
        }

        function renderChips() {
            var chips = el('-chips');
            if (!chips) return;
            chips.innerHTML = '';
            state[config.stateKey].forEach(function (value) {
                chips.appendChild(buildChipElement(value));
            });
        }

        function updateClearVisibility() {
            var btn = el('-clear');
            if (btn) btn.classList.toggle('show', state[config.stateKey].length > 0);
        }

        function clearSelection() {
            state[config.stateKey] = [];
            renderChips();
            updateClearVisibility();
            var search = el('-search');
            if (search) search.value = '';
            closeOptions();
        }

        function updateSelectVisibility() {
            var selectEl = el('-select');
            if (selectEl) selectEl.classList.toggle('show', state.scope === 'workspace' && state.workspaceIds.length > 0);
        }

        function refreshOptions() {
            updateSelectVisibility();
            if (state.scope !== 'workspace' || !state.workspaceIds.length) {
                allValues = [];
                clearSelection();
                return;
            }
            var params = new URLSearchParams({ workspace_id: state.workspaceIds.join(',') });
            fetch(config.endpoint + '?' + params.toString(), { credentials: 'same-origin' })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    allValues = data[config.responseKey] || [];
                    var current = state[config.stateKey];
                    var stillValid = current.filter(function (v) { return allValues.indexOf(v) !== -1; });
                    var changed = stillValid.length !== current.length;
                    state[config.stateKey] = stillValid;
                    renderChips();
                    updateClearVisibility();
                    if (changed) refreshAll();
                })
                .catch(function () { allValues = []; });
        }

        function setup() {
            if (ready) return;
            var wrapper = el('-tags');
            var search = el('-search');
            if (!wrapper || !search) return;
            ready = true;

            search.addEventListener('input', function () { renderOptions(this.value); });
            search.addEventListener('focus', function () { renderOptions(this.value); });
            search.addEventListener('click', function () { renderOptions(this.value); });
            search.addEventListener('keydown', handleSearchKeydown);
            document.addEventListener('click', function (e) {
                if (!wrapper.contains(e.target)) closeOptions();
            });

            var clearBtn = el('-clear');
            if (clearBtn) {
                clearBtn.addEventListener('click', function () {
                    clearSelection();
                    deselectActiveTest();
                    refreshAll();
                });
            }
        }

        return {
            setup: setup,
            clearSelection: clearSelection,
            updateSelectVisibility: updateSelectVisibility,
            refreshOptions: refreshOptions,
            stateKey: config.stateKey,
            paramName: config.paramName
        };
    }

    function loadTests() {
        fetch('/visu/live-insights/tests/', { credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var bar = document.getElementById('li-test-subbar');
                (data.tests || []).forEach(function (t) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'li-subbar-btn';
                    btn.textContent = t.label;
                    btn.addEventListener('click', function () {
                        document.querySelectorAll('.li-subbar-btn').forEach(function (b) { b.classList.remove('active'); });
                        this.classList.add('active');
                        state.activeTest = t.key;
                        state.correlationExpanded = false;
                        toggle('li-test-empty', false);
                        loadTestDetail(t.key);
                    });
                    bar.appendChild(btn);
                });
            })
            .catch(function () {});
    }

    function scopeParams() {
        var params = new URLSearchParams({ scope: state.scope });
        if (state.scope === 'workspace' && state.workspaceIds.length) {
            params.set('workspace_id', state.workspaceIds.join(','));
        }
        simpleFilters.forEach(function (f) {
            if (state[f.stateKey].length) {
                params.set(f.paramName, state[f.stateKey].join(','));
            }
        });
        return params;
    }

    function toggle(id, show) {
        var el = document.getElementById(id);
        if (el) el.style.display = show ? '' : 'none';
    }

    function showOverviewEmpty(text) {
        var el = document.getElementById('li-overview-empty');
        if (el) el.textContent = text;
        toggle('li-overview-empty', true);
    }

    function showTestEmpty(text) {
        var el = document.getElementById('li-test-empty');
        if (el) el.textContent = text;
        toggle('li-test-detail', false);
        toggle('li-test-empty', true);
    }

    function recordsLabel(n) {
        return n + (n === 1 ? ' record' : ' records');
    }

    // ---------- Data freshness ----------

    function markUpdated() {
        lastUpdated = new Date();
        renderUpdatedText();
    }

    function renderUpdatedText() {
        var el = document.getElementById('li-updated');
        if (!el || !lastUpdated) return;
        var seconds = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
        var label;
        if (seconds < 10) label = 'Updated just now';
        else if (seconds < 60) label = 'Updated ' + seconds + 's ago';
        else if (seconds < 3600) label = 'Updated ' + Math.round(seconds / 60) + ' min ago';
        else label = 'Updated at ' + lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        el.textContent = label;
    }
    setInterval(renderUpdatedText, 30000);

    function loadOverview() {
        // requestSeq: discards this fetch's result if a newer scope switch already superseded it.
        var requestSeq = ++overviewRequestSeq;
        if (state.scope === 'workspace' && !state.workspaceIds.length) {
            toggle('li-overview', false);
            toggle('li-overview-loading', false);
            showOverviewEmpty('No workspace selected.');
            return Promise.resolve();
        }
        toggle('li-overview-loading', true);
        toggle('li-overview', false);
        toggle('li-overview-empty', false);
        return fetch('/visu/live-insights/overview/?' + scopeParams().toString(), { credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (requestSeq !== overviewRequestSeq) return;
                toggle('li-overview-loading', false);
                if (data.error || !data.total_records) {
                    showOverviewEmpty(state.scope === 'workspace' ?
                        'No records found for the selected workspace(s).' :
                        'No records found for this scope yet.');
                    return;
                }
                renderOverview(data);
                toggle('li-overview', true);
                markUpdated();
            })
            .catch(function () {
                if (requestSeq !== overviewRequestSeq) return;
                toggle('li-overview-loading', false);
                showOverviewEmpty('Could not load data for this scope.');
            });
    }

    function loadTestDetail(testKey) {
        if (state.scope === 'workspace' && !state.workspaceIds.length) return Promise.resolve();
        // requestSeq: discards this fetch's result if a newer filter/test
        // change already superseded it, so a slow response from before a
        // filter change can't land after (and overwrite) a faster, fresher one.
        var requestSeq = ++testDetailRequestSeq;
        toggle('li-test-loading', true);
        toggle('li-test-detail', false);
        toggle('li-test-empty', false);
        return fetch('/visu/live-insights/test/' + testKey + '/?' + scopeParams().toString(), { credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (requestSeq !== testDetailRequestSeq) return;
                toggle('li-test-loading', false);
                if (data.error) return;
                if (!data.record_count) {
                    showTestEmpty('No records found for this test in the current scope.');
                    return;
                }
                renderTestDetail(data);
                toggle('li-test-detail', true);
            })
            .catch(function () {
                if (requestSeq !== testDetailRequestSeq) return;
                toggle('li-test-loading', false);
            });
    }

    function kpiTile(label, value, iconHtml, sub, tooltipText) {
        var div = document.createElement('div');
        div.className = 'li-kpi-tile';
        div.innerHTML = (iconHtml ? '<div class="li-kpi-icon">' + iconHtml + '</div>' : '') +
            '<div class="li-kpi-value">' + value + '</div>' +
            '<div class="li-kpi-label">' + label + infoTooltip(tooltipText) + '</div>' +
            (sub ? '<div class="li-kpi-sub">' + sub + '</div>' : '');
        return div;
    }

    function renderNumericCard(containerId, summary, tooltipText, decimals) {
        var el = document.getElementById(containerId);
        if (!el) return;
        var label = (summary && summary.label) || '';
        var n = (summary && summary.n) || 0;
        var dp = decimals == null ? 2 : decimals;

        if (el._liClickHandler) {
            el.removeEventListener('click', el._liClickHandler);
            el._liClickHandler = null;
        }
        if (el._liKeyHandler) {
            el.removeEventListener('keydown', el._liKeyHandler);
            el._liKeyHandler = null;
        }
        el.removeAttribute('role');
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-haspopup');
        var oldToolbar = el.querySelector('.li-chart-toolbar');
        if (oldToolbar) oldToolbar.remove();

        if (!n || summary.mean == null) {
            el.className = 'li-metric-card';
            el.innerHTML =
                '<div class="li-metric-header"><span class="li-metric-label">' + label + infoTooltip(tooltipText) + '</span></div>' +
                '<div class="li-metric-empty">No data reported for this field in the current scope.</div>';
            return;
        }
        var low = summary.low, high = summary.high, mean = summary.mean;
        var span = high - low;
        var pos = span > 0 ? ((mean - low) / span) * 100 : 50;
        pos = Math.max(0, Math.min(100, pos));
        var canvasId = containerId + '-hist-canvas';
        var title = label + ' Distribution';
        var csvExport = histCsv(summary.histogram);

        el.className = 'li-metric-card';
        el.innerHTML =
            '<div class="li-metric-header"><span class="li-metric-label">' + label + infoTooltip(tooltipText) + '</span></div>' +
            '<div class="li-metric-mean">' + mean.toFixed(dp) + '</div>' +
            '<div class="li-metric-range-track">' +
                '<div class="li-metric-range-marker" style="left:' + pos + '%;"></div>' +
            '</div>' +
            '<div class="li-metric-range-labels">' +
                '<span>' + low.toFixed(dp) + '</span>' +
                '<span class="li-metric-range-ci">95% interval</span>' +
                '<span>' + high.toFixed(dp) + '</span>' +
            '</div>' +
            '<div class="li-metric-count">' + recordsLabel(n) + '</div>';

        chartRegistry[canvasId] = { renderFn: renderHistogramChart, args: [summary.histogram], title: title, csvExport: csvExport };
        makeCardExpandable(el, canvasId, title);
        attachToolbarTo(el, canvasId, title, csvExport);
    }

    function renderOverview(data) {
        var grid = document.getElementById('li-kpi-grid');
        grid.innerHTML = '';
        grid.appendChild(kpiTile('Total Records', data.total_records, '<i class="fas fa-database"></i>', '', TOTAL_RECORDS_TIP));

        var sub = document.getElementById('li-sub-tests');
        if (sub) sub.textContent = recordsLabel(data.total_records) + ' total';

        registerChart(
            'li-chart-tests', 'Record Distribution by Test', renderBarChart,
            [data.records_by_test.map(function (t) { return t.label; }), data.records_by_test.map(function (t) { return t.count; })],
            { headers: ['Test', 'Records'], rows: data.records_by_test.map(function (t) { return [t.label, t.count]; }) }
        );
        registerChart(
            'li-chart-mixing-method', 'Mixing Method', renderPieChart, [data.mixture.mixing_method],
            categoricalCsv(data.mixture.mixing_method)
        );
        registerChart(
            'li-chart-binder-grade', 'Target Binder Grade', renderHorizontalBar, [data.mixture.target_binder_grade],
            categoricalCsv(data.mixture.target_binder_grade)
        );
        registerChart(
            'li-chart-year', 'Records by Year', renderYearTrend, [data.mixture.year_trend],
            { headers: ['Year', 'Records'], rows: (data.mixture.year_trend.points || []).map(function (p) { return [p.year, p.count]; }) }
        );
        renderNumericCard('li-metric-binder', data.mixture.binder_content, BINDER_CONTENT_TIP);
        renderNumericCard('li-metric-rap', data.mixture.rap_content, RAP_CONTENT_TIP, FIELD_DECIMALS.rap_content);
        renderNumericCard('li-metric-max-density', data.mixture.max_density, MAX_DENSITY_TIP, FIELD_DECIMALS.max_density);
        renderNumericCard('li-metric-recovered-penetration', data.mixture.recovered_penetration, RECOVERED_PENETRATION_TIP, FIELD_DECIMALS.recovered_penetration);
        renderNumericCard('li-metric-recovered-softening-point', data.mixture.recovered_softening_point, RECOVERED_SOFTENING_POINT_TIP, FIELD_DECIMALS.recovered_softening_point);
        renderNumericCard('li-metric-recovered-elastic-recovery', data.mixture.recovered_elastic_recovery, RECOVERED_ELASTIC_RECOVERY_TIP, FIELD_DECIMALS.recovered_elastic_recovery);
        registerChart(
            'li-chart-sieve-composition', 'Sieve Gradation – Composition', renderSieveBand, [data.mixture.sieve_curves.composition],
            sieveCsv(data.mixture.sieve_curves.composition)
        );
        registerChart(
            'li-chart-sieve-recovered', 'Sieve Gradation – Recovered Materials', renderSieveBand, [data.mixture.sieve_curves.recovered],
            sieveCsv(data.mixture.sieve_curves.recovered)
        );
    }

    function renderTestDetail(data) {
        var recordCount = document.getElementById('li-test-record-count');
        if (recordCount) recordCount.textContent = recordsLabel(data.record_count);
        var resultsRecordCount = document.getElementById('li-test-results-record-count');
        if (resultsRecordCount) resultsRecordCount.textContent = recordsLabel(data.record_count);

        registerChart(
            'li-chart-test-mixing-method', 'Mixing Method', renderPieChart, [data.mixture.mixing_method],
            categoricalCsv(data.mixture.mixing_method)
        );
        registerChart(
            'li-chart-test-binder-grade', 'Target Binder Grade', renderHorizontalBar, [data.mixture.target_binder_grade],
            categoricalCsv(data.mixture.target_binder_grade)
        );
        registerChart(
            'li-chart-test-year', 'Records by Year', renderYearTrend, [data.mixture.year_trend],
            { headers: ['Year', 'Records'], rows: (data.mixture.year_trend.points || []).map(function (p) { return [p.year, p.count]; }) }
        );
        renderNumericCard('li-metric-test-binder', data.mixture.binder_content, BINDER_CONTENT_TIP);
        renderNumericCard('li-metric-test-rap', data.mixture.rap_content, RAP_CONTENT_TIP, FIELD_DECIMALS.rap_content);
        renderNumericCard('li-metric-test-max-density', data.mixture.max_density, MAX_DENSITY_TIP, FIELD_DECIMALS.max_density);
        renderNumericCard('li-metric-test-recovered-penetration', data.mixture.recovered_penetration, RECOVERED_PENETRATION_TIP, FIELD_DECIMALS.recovered_penetration);
        renderNumericCard('li-metric-test-recovered-softening-point', data.mixture.recovered_softening_point, RECOVERED_SOFTENING_POINT_TIP, FIELD_DECIMALS.recovered_softening_point);
        renderNumericCard('li-metric-test-recovered-elastic-recovery', data.mixture.recovered_elastic_recovery, RECOVERED_ELASTIC_RECOVERY_TIP, FIELD_DECIMALS.recovered_elastic_recovery);
        registerChart(
            'li-chart-test-sieve-composition', 'Sieve Gradation – Composition', renderSieveBand, [data.mixture.sieve_curves.composition],
            sieveCsv(data.mixture.sieve_curves.composition)
        );
        registerChart(
            'li-chart-test-sieve-recovered', 'Sieve Gradation – Recovered Materials', renderSieveBand, [data.mixture.sieve_curves.recovered],
            sieveCsv(data.mixture.sieve_curves.recovered)
        );

        var resultsGrid = document.getElementById('li-test-results-grid');
        resultsGrid.innerHTML = '';
        var testTooltips = TEST_RESULT_TOOLTIPS[data.test] || {};
        Object.keys(data.results || {}).forEach(function (key) {
            var card = document.createElement('div');
            card.className = 'li-metric-card';
            card.id = 'li-metric-result-' + key;
            resultsGrid.appendChild(card);
            renderNumericCard(card.id, data.results[key], testTooltips[key], FIELD_DECIMALS[key]);
        });

        renderCorrelationSection(data.correlation);
    }

    // ---------- Correlation Analysis ----------

    function renderCorrelationSection(correlation) {
        var section = document.getElementById('li-correlation-section');
        var toggleBtn = document.getElementById('li-correlation-toggle');
        if (!correlation || !correlation.fields || !correlation.fields.length) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';
        var hasExtra = correlation.fields.length > correlation.default_count;

        function draw() {
            var revealed = state.correlationExpanded ? correlation.fields.length : correlation.default_count;
            registerHtmlWidgetNoExpand(
                'li-correlation-matrix', 'Correlation Analysis', renderCorrelationMatrix,
                [correlation, revealed], correlationCsv(correlation, revealed)
            );
            toggleBtn.textContent = state.correlationExpanded ? 'Show fewer parameters' : 'Show more parameters';
        }

        if (hasExtra) {
            toggleBtn.style.display = '';
            toggleBtn.onclick = function () {
                state.correlationExpanded = !state.correlationExpanded;
                draw();
            };
        } else {
            toggleBtn.style.display = 'none';
        }
        draw();
    }

    var CORR_ACCENT_RGB = [60, 172, 168];

    function hexToRgb(hex) {
        hex = (hex || '#ffffff').replace('#', '').trim();
        if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
        var num = parseInt(hex, 16) || 0xffffff;
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    function correlationCellColor(r, neutralRgb) {
        var mix = Math.min(1, Math.abs(r));
        return 'rgb(' + neutralRgb.map(function (c, idx) {
            return Math.round(c + (CORR_ACCENT_RGB[idx] - c) * mix);
        }).join(',') + ')';
    }

    function correlationCellsByPos(correlation, n) {
        var byPos = {};
        (correlation.cells || []).forEach(function (c) {
            if (c.row < n && c.col < n) byPos[c.row + '_' + c.col] = c;
        });
        return byPos;
    }

    function renderCorrelationMatrix(containerId, correlation, revealedCount) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var allFields = correlation.fields;
        var n = Math.min(revealedCount || correlation.default_count, allFields.length);
        var visibleFields = allFields.slice(0, n);
        var cellByPos = correlationCellsByPos(correlation, n);
        var neutralRgb = hexToRgb(cssVar('--card-bg', '#f9fafb'));

        var grid = document.createElement('div');
        grid.className = 'li-corr-grid';
        grid.style.gridTemplateColumns = 'repeat(' + n + ', 1fr)';

        for (var row = 0; row < n; row++) {
            for (var col = 0; col < n; col++) {
                var cell = document.createElement('div');
                if (row === col) {
                    cell.className = 'li-corr-cell li-corr-cell-label';
                    cell.textContent = visibleFields[row].label;
                    cell.title = visibleFields[row].label;
                } else {
                    var entry = cellByPos[row + '_' + col];
                    if (!entry) {
                        cell.className = 'li-corr-cell li-corr-cell-empty';
                        cell.textContent = 'not enough records';
                        cell.title = 'Not enough paired records in the current scope.';
                    } else {
                        cell.className = 'li-corr-cell li-corr-cell-clickable ' +
                            (row < col ? 'li-corr-cell-upper' : 'li-corr-cell-lower');
                        cell.style.backgroundColor = correlationCellColor(entry.r, neutralRgb);
                        if (Math.abs(entry.r) > 0.55) cell.style.color = '#fff';
                        cell.innerHTML = '<span class="li-corr-r">' + entry.r.toFixed(2) + '</span>' +
                            '<span class="li-corr-n">' + recordsLabel(entry.n) + '</span>';
                        cell.title = visibleFields[row].label + ' vs ' + visibleFields[col].label +
                            ' (' + (row < col ? 'Spearman' : 'Pearson') + ') - click to see the underlying data';
                        cell.setAttribute('role', 'button');
                        cell.setAttribute('tabindex', '0');
                        (function (fieldRow, fieldCol) {
                            var open = function () { openCorrelationScatter(fieldRow, fieldCol); };
                            cell.addEventListener('click', open);
                            cell.addEventListener('keydown', function (e) {
                                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                                    e.preventDefault();
                                    open();
                                }
                            });
                        })(visibleFields[row], visibleFields[col]);
                    }
                }
                grid.appendChild(cell);
            }
        }
        container.innerHTML = '';
        container.appendChild(grid);
    }

    function wrapCanvasText(ctx, text, cx, cy, maxWidth, lineHeight) {
        var words = text.split(' ');
        var lines = [];
        var current = '';
        words.forEach(function (w) {
            var test = current ? current + ' ' + w : w;
            if (ctx.measureText(test).width > maxWidth && current) {
                lines.push(current);
                current = w;
            } else {
                current = test;
            }
        });
        if (current) lines.push(current);
        var startY = cy - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach(function (line, i) { ctx.fillText(line, cx, startY + i * lineHeight); });
    }

    function drawCorrelationMatrixToCanvas(canvasId, correlation, revealedCount) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;
        var n = Math.min(revealedCount || correlation.default_count, correlation.fields.length);
        var cellSize = 92;
        canvas.width = n * cellSize;
        canvas.height = n * cellSize;
        var ctx = canvas.getContext('2d');
        var cellByPos = correlationCellsByPos(correlation, n);
        var neutralRgb = hexToRgb(cssVar('--card-bg', '#ffffff'));
        var blockBg = cssVar('--block-bg', '#e9eef5');
        var textColor = cssVar('--text', '#232733');
        var mutedColor = cssVar('--text-muted', '#64748b');
        var borderColor = cssVar('--input-border', '#b2c2d6');

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var row = 0; row < n; row++) {
            for (var col = 0; col < n; col++) {
                var x = col * cellSize, y = row * cellSize;
                if (row === col) {
                    ctx.fillStyle = blockBg;
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.fillStyle = mutedColor;
                    ctx.font = '600 10px Inter, Arial, sans-serif';
                    wrapCanvasText(ctx, correlation.fields[row].label, x + cellSize / 2, y + cellSize / 2, cellSize - 12, 12);
                } else {
                    var entry = cellByPos[row + '_' + col];
                    if (!entry) {
                        ctx.fillStyle = blockBg;
                        ctx.fillRect(x, y, cellSize, cellSize);
                        ctx.fillStyle = mutedColor;
                        ctx.font = '400 10px Inter, Arial, sans-serif';
                        wrapCanvasText(ctx, 'not enough records', x + cellSize / 2, y + cellSize / 2, cellSize - 12, 12);
                    } else {
                        ctx.fillStyle = correlationCellColor(entry.r, neutralRgb);
                        ctx.fillRect(x, y, cellSize, cellSize);
                        if (row < col) {
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(x, y, cellSize, cellSize);
                            ctx.clip();
                            ctx.strokeStyle = 'rgba(255,255,255,0.35)';
                            ctx.lineWidth = 2;
                            for (var d = -cellSize; d < cellSize * 2; d += 6) {
                                ctx.beginPath();
                                ctx.moveTo(x + d, y);
                                ctx.lineTo(x + d + cellSize, y + cellSize);
                                ctx.stroke();
                            }
                            ctx.restore();
                        }
                        ctx.fillStyle = Math.abs(entry.r) > 0.55 ? '#fff' : textColor;
                        ctx.font = '700 13px Inter, Arial, sans-serif';
                        ctx.fillText(entry.r.toFixed(2), x + cellSize / 2, y + cellSize / 2 - 7);
                        ctx.font = '400 9px Inter, Arial, sans-serif';
                        ctx.fillText(recordsLabel(entry.n), x + cellSize / 2, y + cellSize / 2 + 9);
                    }
                }
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
            }
        }
    }

    function correlationCsv(correlation, revealedCount) {
        var n = Math.min(revealedCount || correlation.default_count, correlation.fields.length);
        var cellByPos = correlationCellsByPos(correlation, n);
        var rows = [];
        for (var i = 0; i < n; i++) {
            for (var j = i + 1; j < n; j++) {
                var pearson = cellByPos[j + '_' + i];
                var spearman = cellByPos[i + '_' + j];
                if (!pearson && !spearman) continue;
                rows.push([
                    correlation.fields[i].label,
                    correlation.fields[j].label,
                    pearson ? pearson.r : '',
                    spearman ? spearman.r : '',
                    pearson ? pearson.n : (spearman ? spearman.n : '')
                ]);
            }
        }
        return { headers: ['Field A', 'Field B', 'Pearson r', 'Spearman rho', 'N'], rows: rows };
    }

    function openCorrelationScatter(fieldA, fieldB) {
        var testKey = state.activeTest;
        if (!testKey) return;
        ensureModal();
        modalOverlay.classList.add('show');
        document.getElementById('li-modal-title').textContent = fieldA.label + ' vs ' + fieldB.label;
        document.getElementById('li-modal-subtitle').textContent = 'Loading…';
        document.getElementById('li-modal-canvas').style.display = '';
        document.getElementById('li-modal-generic').style.display = 'none';
        destroyChart('li-modal-canvas');
        document.getElementById('li-modal-actions').innerHTML = '';

        var url = '/visu/live-insights/test/' + testKey + '/correlation/' +
            encodeURIComponent(fieldA.key) + '/' + encodeURIComponent(fieldB.key) + '/?' + scopeParams().toString();
        fetch(url, { credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.error || !modalOverlay.classList.contains('show')) return;
                renderScatterChart('li-modal-canvas', data);

                var subtitle = document.getElementById('li-modal-subtitle');
                var parts = [recordsLabel(data.n)];
                if (data.pearson != null) parts.push('Pearson r = ' + data.pearson.toFixed(2));
                if (data.spearman != null) parts.push('Spearman ρ = ' + data.spearman.toFixed(2));
                subtitle.textContent = parts.join(' · ');

                var title = fieldA.label + ' vs ' + fieldB.label;
                var actions = document.getElementById('li-modal-actions');
                actions.innerHTML = '';
                actions.appendChild(toolButton(IMAGE_ICON, 'Save ' + title + ' as PNG', function () {
                    downloadChartPng('li-modal-canvas', slug(title) + '.png');
                }));
                var closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = 'li-modal-close';
                closeBtn.setAttribute('aria-label', 'Close');
                closeBtn.innerHTML = CLOSE_ICON;
                closeBtn.addEventListener('click', closeModal);
                actions.appendChild(closeBtn);
            })
            .catch(function () {
                document.getElementById('li-modal-subtitle').textContent = 'Could not load this data.';
            });
    }

    function linearRegression(points) {
        var pts = (points || []).filter(function (p) {
            return typeof p.x === 'number' && typeof p.y === 'number' && isFinite(p.x) && isFinite(p.y);
        });
        if (pts.length < 2) return null;
        var n = pts.length, sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        pts.forEach(function (p) { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x; });
        var denom = n * sumXX - sumX * sumX;
        if (!denom) return null;
        var slope = (n * sumXY - sumX * sumY) / denom;
        var intercept = (sumY - slope * sumX) / n;
        var xs = pts.map(function (p) { return p.x; });
        var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
        return [{ x: minX, y: slope * minX + intercept }, { x: maxX, y: slope * maxX + intercept }];
    }

    function renderScatterChart(canvasId, data) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        var datasets = [{
            data: data.points,
            backgroundColor: 'rgba(60,172,168,0.55)',
            borderColor: '#2f8a86'
        }];
        var regressionLine = linearRegression(data.points);
        if (regressionLine) {
            datasets.push({
                type: 'line',
                data: regressionLine,
                borderColor: '#2f8a86',
                borderWidth: 1.5,
                borderDash: [6, 4],
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                tension: 0
            });
        }
        charts[canvasId] = new Chart(ctx, {
            type: 'scatter',
            data: { datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { title: { display: true, text: data.field_a.label } },
                    y: { title: { display: true, text: data.field_b.label } }
                }
            }
        });
    }

    function categoricalCsv(summary) {
        var categories = (summary && summary.categories) || [];
        return {
            headers: [(summary && summary.label) || 'Category', 'Records'],
            rows: categories.map(function (c) { return [c.value, c.count]; })
        };
    }

    function sieveCsv(curve) {
        var points = (curve && curve.points) || [];
        return {
            headers: ['Sieve Size (mm)', 'Mean % Passing', '95% Low', '95% High', 'Records'],
            rows: points.map(function (p) { return [p.size, p.mean, p.low, p.high, p.n]; })
        };
    }

    function destroyChart(id) {
        if (charts[id]) {
            charts[id].destroy();
            delete charts[id];
        }
    }

    // ---------- Chart registry (Expand / PNG / CSV toolbar) ----------

    function registerChart(canvasId, title, renderFn, args, csvExport) {
        chartRegistry[canvasId] = { renderFn: renderFn, args: args, title: title, csvExport: csvExport, type: 'chart' };
        renderFn.apply(null, [canvasId].concat(args));
        attachToolbar(canvasId, title, csvExport);
    }

    function registerHtmlWidgetNoExpand(containerId, title, renderFn, args, csvExport) {
        chartRegistry[containerId] = { renderFn: renderFn, args: args, title: title, csvExport: csvExport, type: 'html' };
        renderFn.apply(null, [containerId].concat(args));
        var el = document.getElementById(containerId);
        var card = el && el.closest('.li-chart-card');
        if (!card) return;
        var old = card.querySelector('.li-chart-toolbar');
        if (old) old.remove();
        var bar = document.createElement('div');
        bar.className = 'li-chart-toolbar';
        bar.appendChild(toolButton(IMAGE_ICON, 'Save ' + title + ' as PNG', function () {
            downloadChartPng(containerId, slug(title) + '.png');
        }));
        if (csvExport && csvExport.rows && csvExport.rows.length) {
            bar.appendChild(toolButton(CSV_ICON, 'Export ' + title + ' as CSV', function () {
                downloadCsv(slug(title) + '.csv', csvExport.headers, csvExport.rows);
            }));
        }
        card.appendChild(bar);
    }

    function slug(s) {
        return (s || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'chart';
    }

    function attachToolbar(canvasId, title, csvExport) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;
        var card = canvas.closest('.li-chart-card');
        attachToolbarTo(card, canvasId, title, csvExport);
        makeCardExpandable(card, canvasId, title);
    }

    function makeCardExpandable(container, canvasId, title) {
        if (!container) return;
        if (container._liClickHandler) {
            container.removeEventListener('click', container._liClickHandler);
        }
        if (container._liKeyHandler) {
            container.removeEventListener('keydown', container._liKeyHandler);
        }
        container.classList.add('li-expandable');
        container.setAttribute('role', 'button');
        container.setAttribute('tabindex', '0');
        container.setAttribute('aria-haspopup', 'dialog');

        var handler = function () { openModal(canvasId, title); };
        container._liClickHandler = handler;
        container.addEventListener('click', handler);

        var keyHandler = function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                handler();
            }
        };
        container._liKeyHandler = keyHandler;
        container.addEventListener('keydown', keyHandler);
    }

    function attachToolbarTo(container, canvasId, title, csvExport) {
        if (!container) return;
        var old = container.querySelector('.li-chart-toolbar');
        if (old) old.remove();

        var bar = document.createElement('div');
        bar.className = 'li-chart-toolbar';

        bar.appendChild(toolButton(EXPAND_ICON, 'Expand ' + title, function () { openModal(canvasId, title); }));
        bar.appendChild(toolButton(IMAGE_ICON, 'Save ' + title + ' as PNG', function () {
            downloadChartPng(canvasId, slug(title) + '.png');
        }));
        if (csvExport && csvExport.rows && csvExport.rows.length) {
            bar.appendChild(toolButton(CSV_ICON, 'Export ' + title + ' as CSV', function () {
                downloadCsv(slug(title) + '.csv', csvExport.headers, csvExport.rows);
            }));
        }
        container.appendChild(bar);
    }

    function histCsv(hist) {
        var labels = (hist && hist.labels) || [];
        var counts = (hist && hist.counts) || [];
        return { headers: ['Bin', 'Records'], rows: labels.map(function (l, i) { return [l, counts[i]]; }) };
    }

    function toolButton(iconSvg, label, onClick) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'li-tool-btn';
        btn.title = label;
        btn.setAttribute('aria-label', label);
        btn.innerHTML = iconSvg;
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            onClick(e);
        });
        return btn;
    }

    var OFFSCREEN_CANVAS_ID = 'li-offscreen-canvas';

    function ensureOffscreenCanvas() {
        if (document.getElementById(OFFSCREEN_CANVAS_ID)) return;
        var canvas = document.createElement('canvas');
        canvas.id = OFFSCREEN_CANVAS_ID;
        canvas.width = 640;
        canvas.height = 400;
        canvas.style.position = 'absolute';
        canvas.style.left = '-9999px';
        canvas.style.top = '0';
        document.body.appendChild(canvas);
    }

    function downloadChartPng(canvasId, filename) {
        var chart = charts[canvasId];
        if (chart) {
            triggerPngDownload(chart.toBase64Image(), filename);
            return;
        }
        var entry = chartRegistry[canvasId];
        if (!entry) return;
        if (entry.type === 'html') {
            ensureOffscreenCanvas();
            drawCorrelationMatrixToCanvas(OFFSCREEN_CANVAS_ID, entry.args[0], entry.args[1]);
            triggerPngDownload(document.getElementById(OFFSCREEN_CANVAS_ID).toDataURL('image/png'), filename);
            return;
        }
        ensureOffscreenCanvas();
        entry.renderFn.apply(null, [OFFSCREEN_CANVAS_ID].concat(entry.args));
        triggerPngDownload(charts[OFFSCREEN_CANVAS_ID].toBase64Image(), filename);
        destroyChart(OFFSCREEN_CANVAS_ID);
    }

    function triggerPngDownload(dataUrl, filename) {
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function downloadCsv(filename, headers, rows) {
        var esc = function (v) {
            v = v == null ? '' : String(v);
            return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
        };
        var lines = [headers.map(esc).join(',')].concat(rows.map(function (r) { return r.map(esc).join(','); }));
        var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ---------- Expand modal ----------

    function ensureModal() {
        if (modalOverlay) return;
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'li-modal-overlay';
        modalOverlay.innerHTML =
            '<div class="li-modal">' +
                '<div class="li-modal-header">' +
                    '<div>' +
                        '<h3 id="li-modal-title"></h3>' +
                        '<p class="li-modal-subtitle" id="li-modal-subtitle"></p>' +
                    '</div>' +
                    '<div class="li-modal-actions" id="li-modal-actions"></div>' +
                '</div>' +
                '<div class="li-modal-canvas-wrap">' +
                    '<canvas id="li-modal-canvas"></canvas>' +
                    '<div id="li-modal-generic" class="li-modal-generic"></div>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modalOverlay);
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('show')) closeModal();
        });
    }

    function openModal(canvasId, title) {
        var entry = chartRegistry[canvasId];
        if (!entry) return;
        ensureModal();
        document.getElementById('li-modal-title').textContent = title;
        document.getElementById('li-modal-subtitle').textContent = '';
        modalOverlay.classList.add('show');

        var isHtml = entry.type === 'html';
        document.getElementById('li-modal-canvas').style.display = isHtml ? 'none' : '';
        document.getElementById('li-modal-generic').style.display = isHtml ? '' : 'none';
        entry.renderFn.apply(null, [(isHtml ? 'li-modal-generic' : 'li-modal-canvas')].concat(entry.args));

        var actions = document.getElementById('li-modal-actions');
        actions.innerHTML = '';
        var pngTargetId = isHtml ? canvasId : 'li-modal-canvas';
        actions.appendChild(toolButton(IMAGE_ICON, 'Save ' + title + ' as PNG', function () {
            downloadChartPng(pngTargetId, slug(title) + '.png');
        }));
        if (entry.csvExport && entry.csvExport.rows && entry.csvExport.rows.length) {
            actions.appendChild(toolButton(CSV_ICON, 'Export ' + title + ' as CSV', function () {
                downloadCsv(slug(title) + '.csv', entry.csvExport.headers, entry.csvExport.rows);
            }));
        }
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'li-modal-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = CLOSE_ICON;
        closeBtn.addEventListener('click', closeModal);
        actions.appendChild(closeBtn);
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('show');
        destroyChart('li-modal-canvas');
        document.getElementById('li-modal-generic').innerHTML = '';
    }

    function axisOptions(xTitle, yTitle) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { title: { display: !!xTitle, text: xTitle || '' }, ticks: { maxRotation: 60, minRotation: 0 } },
                y: { beginAtZero: true, title: { display: !!yTitle, text: yTitle || '' } }
            }
        };
    }

    function renderBarChart(canvasId, labels, values) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ data: values, backgroundColor: ACCENT, borderRadius: 4 }] },
            options: axisOptions('', 'Records')
        });
    }

    function renderHistogramChart(canvasId, hist) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: (hist && hist.labels) || [],
                datasets: [{ data: (hist && hist.counts) || [], backgroundColor: '#5ABCB8', borderRadius: 4 }]
            },
            options: axisOptions('', 'Records')
        });
    }

    function renderPieChart(canvasId, summary) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        var categories = (summary && summary.categories) || [];
        if (!categories.length) {
            charts[canvasId] = new Chart(ctx, { type: 'doughnut', data: { labels: [], datasets: [] }, options: {} });
            return;
        }
        charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(function (c) { return c.value; }),
                datasets: [{ data: categories.map(function (c) { return c.count; }), backgroundColor: CATEGORY_PALETTE }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: function (item) {
                                var total = item.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                                var pct = total ? Math.round((item.raw / total) * 100) : 0;
                                return item.label + ': ' + item.raw + ' (' + pct + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    function renderHorizontalBar(canvasId, summary) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        var categories = (summary && summary.categories) || [];
        charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(function (c) { return c.value; }),
                datasets: [{ data: categories.map(function (c) { return c.count; }), backgroundColor: ACCENT, borderRadius: 4 }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, title: { display: true, text: 'Records' } },
                    y: { ticks: { autoSkip: false } }
                }
            }
        });
    }

    function renderYearTrend(canvasId, summary) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        var points = (summary && summary.points) || [];
        charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: points.map(function (p) { return p.year; }),
                datasets: [{
                    data: points.map(function (p) { return p.count; }),
                    borderColor: ACCENT,
                    backgroundColor: 'rgba(60,172,168,0.18)',
                    fill: true,
                    tension: 0.25,
                    pointRadius: 3
                }]
            },
            options: axisOptions('Year', 'Records')
        });
    }

    function renderSieveBand(canvasId, curve) {
        destroyChart(canvasId);
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        var wrap = ctx.closest('.li-chart-wrap');
        var existingEmpty = wrap && wrap.querySelector('.li-chart-empty');
        if (existingEmpty) existingEmpty.remove();
        var subN = document.getElementById(canvasId.replace('li-chart-', 'li-sub-') + '-n');
        var points = (curve && curve.points) || [];
        if (points.length === 0) {
            ctx.style.display = 'none';
            if (wrap) {
                var empty = document.createElement('div');
                empty.className = 'li-chart-empty';
                empty.textContent = 'No data reported for this field in the current scope.';
                wrap.appendChild(empty);
            }
            if (subN) subN.textContent = '';
            return;
        }
        ctx.style.display = '';
        if (subN) {
            var maxN = Math.max.apply(null, points.map(function (p) { return p.n || 0; }));
            subN.textContent = 'Up to ' + recordsLabel(maxN) + '.';
        }
        var labels = points.map(function (p) { return p.size; });
        // Dataset order matters for Chart.js's fill-between-datasets behavior.
        charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '95% Lower',
                        data: points.map(function (p) { return p.low; }),
                        borderColor: 'transparent',
                        fill: false,
                        pointRadius: 0,
                        tension: 0.3,
                        order: 2
                    },
                    {
                        label: '95% Upper',
                        data: points.map(function (p) { return p.high; }),
                        borderColor: 'transparent',
                        backgroundColor: 'rgba(60,172,168,0.35)',
                        fill: 0,
                        pointRadius: 0,
                        tension: 0.3,
                        order: 2
                    },
                    {
                        label: 'Mean',
                        data: points.map(function (p) { return p.mean; }),
                        borderColor: '#2f8a86',
                        backgroundColor: '#2f8a86',
                        borderWidth: 3,
                        fill: false,
                        pointRadius: 3,
                        tension: 0.3,
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        filter: function (item) { return item.dataset.label === 'Mean'; },
                        callbacks: {
                            label: function (item) { return 'Mean % passing: ' + item.formattedValue; },
                            afterBody: function (items) {
                                var point = points[items[0].dataIndex];
                                if (!point) return '';
                                var lines = [recordsLabel(point.n)];
                                if (point.n >= 3 && point.low != null && point.high != null && point.low !== point.high) {
                                    lines.unshift('95% interval: ' + point.low + ' – ' + point.high);
                                }
                                return lines;
                            }
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Sieve Size (mm)' } },
                    y: { beginAtZero: true, max: 100, title: { display: true, text: '% Passing' } }
                }
            }
        });
    }
});
