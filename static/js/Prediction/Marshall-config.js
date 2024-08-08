TEST_CONFIGURATIONS.Marshall = {
    suffix: 'Mar',
    formId: 'MarshallpredictionForm',
    endpoint: '/Predict/Marshall/',
    resultsConfig: {
        outputs: [
            { label: 'Marshall Stability', key: 'stability', unit: 'kN' },
            { label: 'Marshall Flow', key: 'flow', unit: 'mm' }
        ]
    },
    fields: {
        MaximumDensity: {
            id: 'MaximumDensityMar',
            label: 'Maximum Density',
            unit: 'Mg/m³',
            randomRange: { min: 2.410, max: 2.542, decimals: 3 },
            placeholder: 'e.g. 2.480'
        },
        BulkDensity: {
            id: 'BulkDensityValueMar',
            label: 'Bulk Density',
            unit: 'Mg/m³',
            randomRange: { min: 2.300, max: 2.43, decimals: 3 },
            placeholder: 'e.g. 2.386',
            specialLogic: 'lessThanMaxDensity'
        },
        Penetration: {
            id: 'PenetrationMar',
            label: 'Penetration',
            unit: '0.1mm',
            randomRange: { min: 26, max: 63, decimals: 0 },
            placeholder: 'e.g. 35'
        },
        Softening: {
            id: 'SofteningMar',
            label: 'Softening Point',
            unit: '°C',
            randomRange: { min: 52.0, max: 81.5, decimals: 1 },
            placeholder: 'e.g. 65.4'
        },
        BinderContent: {
            id: 'BinderContentMar',
            label: 'Binder Content',
            unit: '%',
            randomRange: { min: 3.7, max: 6.5, decimals: 2 },
            placeholder: 'e.g. 5.2'
        }	
    },
    sieves: [
        { id: 'sieve_0_063Mar', size: '0.063 mm', min: 6.8, max: 8.5 },
        { id: 'sieve_0_125Mar', size: '0.125 mm', min: 8.8, max: 11 },
        { id: 'sieve_0_25Mar', size: '0.25 mm', min: 11.6, max: 14.2 },
        { id: 'sieve_0_5Mar', size: '0.5 mm', min: 15, max: 18.5 },
        { id: 'sieve_1Mar', size: '1 mm', min: 19.7, max: 24.8 },
        { id: 'sieve_2Mar', size: '2 mm', min: 27.7, max: 35.2 },
        { id: 'sieve_4Mar', size: '4 mm', min: 40.6, max: 58.6 },
        { id: 'sieve_5_6Mar', size: '5.6 mm', min: 49.7, max: 71.6 },
        { id: 'sieve_8Mar', size: '8 mm', min: 60, max: 96.2 },
        { id: 'sieve_11_2Mar', size: '11.2 mm', min: 71, max: 100 },
        { id: 'sieve_16Mar', size: '16 mm', min: 84, max: 100 },
        { id: 'sieve_22_4Mar', size: '22.4 mm', min: 100, max: 100 },
        { id: 'sieve_31_5Mar', size: '31.5 mm', min: 100, max: 100 },
        { id: 'sieve_45Mar', size: '45 mm', min: 100, max: 100 }
    ],
    renderResults: function(data) {
        const preds = data.predictions;
        const msg   = data.message;
        const infoImageUrl = data.Mar_prop_url;
        const plotImageUrl = data.Mar_pred_url;

        const S_std_lo = parseFloat(preds["S_sigma_kN-"]);
        const S_std_hi = parseFloat(preds["S_sigma_kN+"]);
        const S_R_lo   = parseFloat(preds["S_R_kN-"]);
        const S_R_hi   = parseFloat(preds["S_R_kN+"]);
        const F_std_lo = parseFloat(preds["F_sigma_mm-"]);
        const F_std_hi = parseFloat(preds["F_sigma_mm+"]);
        const F_R_lo   = parseFloat(preds["F_R_mm-"]);
        const F_R_hi   = parseFloat(preds["F_R_mm+"]);

        const intervalsHTML = ([
            S_std_lo, S_std_hi, S_R_lo, S_R_hi,
            F_std_lo, F_std_hi, F_R_lo, F_R_hi
        ].every(v => !isNaN(v))) ? `
            <div class="marshall-intervals">
                <div class="marshall-interval-column">
                    <h3>Marshall Stability Intervals</h3>
                    <p>
                        <span class="interval-label">&plusmn;&sigma;<sub>R</sub>:</span>
                        <span class="interval-value">[&nbsp;&nbsp;${S_std_lo.toFixed(1)}&nbsp;&nbsp;,&nbsp;&nbsp;${S_std_hi.toFixed(1)}&nbsp;&nbsp;]&nbsp;&nbsp;kN</span>
                    </p>
                    <p>
                        <span class="interval-label">&plusmn;R:</span>
                        <span class="interval-value">[&nbsp;&nbsp;${S_R_lo.toFixed(1)}&nbsp;&nbsp;,&nbsp;&nbsp;${S_R_hi.toFixed(1)}&nbsp;&nbsp;]&nbsp;&nbsp;kN</span>
                    </p>
                </div>
                <div class="marshall-interval-column">
                    <h3>Marshall Flow Intervals</h3>
                    <p>
                        <span class="interval-label">&plusmn;&sigma;<sub>R</sub>:</span>
                        <span class="interval-value">[&nbsp;&nbsp;${F_std_lo.toFixed(1)}&nbsp;&nbsp;,&nbsp;&nbsp;${F_std_hi.toFixed(1)}&nbsp;&nbsp;]&nbsp;&nbsp;mm</span>
                    </p>
                    <p>
                        <span class="interval-label">&plusmn;R:</span>
                        <span class="interval-value">[&nbsp;&nbsp;${F_R_lo.toFixed(1)}&nbsp;&nbsp;,&nbsp;&nbsp;${F_R_hi.toFixed(1)}&nbsp;&nbsp;]&nbsp;&nbsp;mm</span>
                    </p>
                </div>
            </div>
        ` : '';

        const MarStandImageUrl = window.STATIC_URLS.MarStandard;

        return `
            <h2>Mixture Properties</h2>
            <div class="marshall-block">
                <img src="${infoImageUrl}"
                    alt="Gradation Curve and Mixture Properties"
                    class="test-prop-image">
            </div>
            <div class="section-divider"></div>
            <h2>Prediction Results</h2>
            <div class="marshall-block">
                <img src="${plotImageUrl}"
                    alt="Marshall Stability versus Marshall Flow Prediction"
                    class="test-pred-image">
            </div>
            ${intervalsHTML}
            <div class="marshall-block">
                <p>The test experimental reproducibility defined by EN 12697‑34 for the Marshall test is:</p>
                <img src="${MarStandImageUrl}"
                    alt="Marshall Reproducibility"
                    class="test-stand-image">
            </div>
        `;
    }
};

MODEL_INFO.Marshall = {
  title: "Marshall Model Scope",
  sections: [
      {
      heading: "Source:",
      bulletsHtml: [
          `This model implementation is based on the methodology described in the paper: 
          <em>Abbas, M., & Zaumanis, M. (2026). Methodology for Physics-Informed Neural Networks for materials test result prediction: Case study on the Marshall test for asphalt. <span style="font-style: italic;">Case Studies in Construction Materials</span>, 24, e05829.</em>
          <a href="https://doi.org/10.1016/j.cscm.2026.e05829" target="_blank" rel="noopener">
          https://doi.org/10.1016/j.cscm.2026.e05829
          </a>`
      ]
      },
      {
      heading: "Test General Properties:",
      bullets: [
          "Marshall test is based on European standard EN 12697-34.",
          "Marshall tests were performed at temperature 60°C."
      ]
      },
      {
      heading: "Model Boundary Conditions:",
      /*intro: [
          "The model was trained using Physics-Informed Neural Networks (PINNs).",
      ],*/
      bullets: [
          "The model was trained using Physics-Informed Neural Networks (PINNs).",
          "Total number of records used was 2656 records.",
          "All records used in training were from Switzerland (Canton Zurich and Canton Aargau).",
          "More than 85% of the records were asphalt concrete.",
          "Around 70% of the records used polymer modified binders (PmB), mainly grades 45/80-80 and 45/80-65.",
          "Around 30% of the records used unmodified binders, mainly grades 50/70 and 70/100.",
          "All polymer modified binders (PmB) used were SBS-modified (styrene–butadiene–styrene)."
      ]
      }
    ]
};
