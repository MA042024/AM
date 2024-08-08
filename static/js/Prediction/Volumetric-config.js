TEST_CONFIGURATIONS.Volumetric = {
    suffix: 'Vol',
    formId: 'VolumetricpredictionForm',
    endpoint: '/Predict/Volumetric/',
    reportTitle: 'Volumetric Properties',
    resultsConfig: {
        outputs: [
            { label: 'Bulk Density', key: 'bd_pred', unit: 'Mg/m³' },
            { label: 'Air Voids', key: 'av_pred', unit: '%' }
        ]
    },
    fields: {
        RAPContent: {
            id: 'RAPContentVol',
            label: 'RAP Content',
            unit: '%',
            randomRange: { min: 0, max: 100, decimals: 0 },
            placeholder: 'e.g. 60'
        },
        MaximumDensity: {
            id: 'MaximumDensityVol',
            label: 'Maximum Density',
            unit: 'Mg/m³',
            randomRange: { min: 2.350, max: 2.550, decimals: 3 },
            placeholder: 'e.g. 2.500'
        },
        BinderContent: {
            id: 'BinderContentVol',
            label: 'Binder Content',
            unit: '%',
            randomRange: { min: 3.5, max: 6.0, decimals: 2 },
            placeholder: 'e.g. 4.28'
        }
    },
    sieves: [
        { id: 'sieve_0_063Vol', size: '0.063 mm', min: 3, max: 12 },
        { id: 'sieve_0_5Vol', size: '0.5 mm', min: 12, max: 25 },
        { id: 'sieve_1Vol', size: '1 mm', min: 18, max: 32 },
        { id: 'sieve_2Vol', size: '2 mm', min: 25, max: 42 },
        { id: 'sieve_4Vol', size: '4 mm', min: 38, max: 55 },
        { id: 'sieve_8Vol', size: '8 mm', min: 55, max: 75 },
        { id: 'sieve_11_2Vol', size: '11.2 mm', min: 65, max: 85 },
        { id: 'sieve_22_4Vol', size: '22.4 mm', min: 90, max: 100 }
    ],
    renderResults: function(data) {
        const preds = data.predictions;
        const infoImageUrl = data.Vol_prop_url;

        const bd_pred     = parseFloat(preds['bd_pred']);
        const bd_std_lo    = parseFloat(preds['bd_sigma_minus']);
        const bd_std_hi    = parseFloat(preds['bd_sigma_plus']);
        const av_pred      = parseFloat(preds['av_pred']);
        const av_std_lo    = parseFloat(preds['av_sigma_minus']);
        const av_std_hi    = parseFloat(preds['av_sigma_plus']);

        return `
            <h2>Mixture Properties</h2>
            <div class="marshall-block">
                <img src="${infoImageUrl}"
                    alt="Gradation Curve and Mixture Properties"
                    class="test-prop-image">
            </div>
            <div class="section-divider"></div>
            <h2>Prediction Results</h2>
            <div class="marshall-intervals">
                <div class="marshall-interval-column">
                    <h3>Bulk Density</h3>
                    <p><span class="interval-value">${bd_pred.toFixed(3)}&nbsp;Mg/m³</span></p>
                    <p>
                        <span class="interval-label">&plusmn;&sigma;<sub>R</sub>:</span>
                        <span class="interval-value">[&nbsp;&nbsp;${bd_std_lo.toFixed(3)}&nbsp;&nbsp;,&nbsp;&nbsp;${bd_std_hi.toFixed(3)}&nbsp;&nbsp;]&nbsp;&nbsp;Mg/m³</span>
                    </p>
                </div>
                <div class="marshall-interval-column">
                    <h3>Air Voids</h3>
                    <p><span class="interval-value">${av_pred.toFixed(1)}&nbsp;%</span></p>
                    <p>
                        <span class="interval-label">&plusmn;&sigma;<sub>R</sub>:</span>
                        <span class="interval-value">[&nbsp;&nbsp;${av_std_lo.toFixed(1)}&nbsp;&nbsp;,&nbsp;&nbsp;${av_std_hi.toFixed(1)}&nbsp;&nbsp;]&nbsp;&nbsp;%</span>
                    </p>
                </div>
            </div>
        `;
    },

    getReportSections: function(data) {
        const preds = data.predictions;
        const mix = data.mixture;
        const sections = [];

        if (mix) {
            sections.push({
                lines: ['Mixture Properties'],
                imageUrl: data.Vol_prop_url
            });
        }

        if (preds) {
            const bd_pred = parseFloat(preds['bd_pred']);
            const bd_sigma_lo = parseFloat(preds['bd_sigma_minus']);
            const bd_sigma_hi = parseFloat(preds['bd_sigma_plus']);
            const av_pred = parseFloat(preds['av_pred']);
            const av_sigma_lo = parseFloat(preds['av_sigma_minus']);
            const av_sigma_hi = parseFloat(preds['av_sigma_plus']);

            sections.push({
                lines: [
                    'Prediction Results',
                    `Bulk Density: ${bd_pred.toFixed(3)} Mg/m3`,
                    { type: 'interval', symbol: 'sigma', sub: 'R', low: bd_sigma_lo.toFixed(3), high: bd_sigma_hi.toFixed(3), unit: 'Mg/m3' },
                    `Air Voids: ${av_pred.toFixed(1)} %`,
                    { type: 'interval', symbol: 'sigma', sub: 'R', low: av_sigma_lo.toFixed(1), high: av_sigma_hi.toFixed(1), unit: '%' }
                ]
            });
        }

        return sections;
    }
};

MODEL_INFO.Volumetric = {
  title: "Volumetric Properties Model Scope",
  sections: [
      {
      heading: "Test General Properties:",
      bullets: [
          "Predicts Bulk Density and Air Voids of the compacted mixture from its composition.",
          "Air Voids is derived from the predicted Bulk Density and the input Maximum Density."
      ]
      },
      {
      heading: "Model Boundary Conditions:",
      bullets: [
          "The model was trained as an Artificial Neural Network (ANN).",
          "Inputs are limited to RAP content, binder content, maximum density and the aggregate gradation.",
          "Predictions outside the range of the training data may be less reliable."
      ]
      }
    ]
};
