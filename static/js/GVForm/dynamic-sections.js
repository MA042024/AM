// General function to add additional properties for the different raw materials
function addadditional(containerId, type, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
        <input type="text" id="TestMethod${type}_${newIndex}" name="TestMethod${type}_${newIndex}" >
        
        <input type="text" id="Value${type}_${newIndex}" name="Value${type}_${newIndex}">
        
        <input type="text" id="Unit${type}_${newIndex}" name="Unit${type}_${newIndex}">
    `;
    container.appendChild(newField);
    attachTooltipListeners(newField);
}

// General function to add additional Additives
function addAdditive(containerId, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
            <br><br>
            <span class="multilabel multilabellarger"> &#11201;&nbsp; Additive ${newIndex} &nbsp;&#11201; </span>

            <label for="TypeAddtv_${newIndex}" titletip-dynadtv="The type of the additive (e.g., Recycling agent).">Type: &nbsp;&nbsp;<div class="tooltip-dynadtv"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dynadtv"></span></div></label>
            <input type="text" id="TypeAddtv_${newIndex}" name="TypeAddtv_${newIndex}">

            <label for="PercentageMassAddtv_${newIndex}" titletip-dynadtv="The percentage by mass of this additive to the total mass of the bituminous mixture (e.g., 1.1).">Percentage by Mass (%): &nbsp;&nbsp;<div class="tooltip-dynadtv"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dynadtv"></span></div></label>
            <input type="text" id="PercentageMassAddtv_${newIndex}" name="PercentageMassAddtv_${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">

            <div id="adtvtab-${newIndex}" class="innertab-lvl4-t-adtv TwoColumn"> Additional Properties </div>
            <div class="innertab-lvl4-content-adtv form-group TwoColumn">
                <fieldset id="fld14-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend" title="The name, value, and unit of measurement for any additional properties of the used material.">Additional Properties<span class="hideinner-lvl4-content-adtv">&minus;</span></legend>
                    <div id="AdditionalPropertiesAddtv_${newIndex}" class="form-group grid-wrap">
                        <div class="label-input-pair">
                            <label for="TestMethodAddtv_${newIndex}_1" titletip-dynadtv="The name of the additional property of the considered raw material (e.g., Micro-Deval test).">Test Method: &nbsp;&nbsp;<div class="tooltip-dynadtv"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dynadtv"></span></div></label>
                            <input type="text" id="TestMethodAddtv_${newIndex}_1" name="TestMethodAddtv_${newIndex}_1">
                        </div>
                        <div class="label-input-pair">
                            <label for="ValueAddtv_${newIndex}_1" titletip-dynadtv="The value of the additional property of the considered raw material (e.g., 16).">Value: &nbsp;&nbsp;<div class="tooltip-dynadtv"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dynadtv"></span></div></label>
                            <input type="text" id="ValueAddtv_${newIndex}_1" name="ValueAddtv_${newIndex}_1">
                        </div>
                        <div class="label-input-pair">
                            <label for="UnitAddtv_${newIndex}_1" titletip-dynadtv="The unit of measurement of the additional property of the considered raw material (e.g., percentage).">Unit: &nbsp;&nbsp;<div class="tooltip-dynadtv"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dynadtv"></span></div></label>
                            <input type="text" id="UnitAddtv_${newIndex}_1" name="UnitAddtv_${newIndex}_1">
                        </div>
                    </div>
                </fieldset>
            <button type="button" class= "additive-property-button TwoColumn"  onclick="addadditional('fld14-${newIndex}','Addtv_${newIndex}','form-group grid-wrap-one-row TwoColumn dynamicPro')">&#10010; Property</button>                    
            </div>
        `;
    container.appendChild(newField);
    attachTooltipListenersAdtv(newField);
}

// General function to add additional properties for the mix design process
function addmixdesign(containerId, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
        <input type="text" id="OtherMixingPropertyName_${newIndex}" name="OtherMixingPropertyName_${newIndex}">
        
        <input type="text" id="OtherMixingPropertyValue_${newIndex}" name="OtherMixingPropertyValue_${newIndex}">
        
        <input type="text" id="OtherMixingPropertyUnit_${newIndex}" name="OtherMixingPropertyUnit_${newIndex}">           
    `;
    container.appendChild(newField);
    attachTooltipListeners(newField);
}

// General function to add Replications for the Large case
function addLarge(containerId, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
        <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>
        
        <label for="ThicknessL${newIndex}" titletip-dyn="The value of the thickness of the samples in mm (e.g., 50).">Thickness (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="ThicknessL${newIndex}" name="ThicknessL${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

        <label for="CyclesNumberL${newIndex}" titletip-dyn="The required number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Number of Cycles:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="number" id="CyclesNumberL${newIndex}" min="0" title="Enter a valid positive integer.">
        
        <label for="ProportionalRutDepthL${newIndex}" titletip-dyn="The average depth of a rut at the required number of cycles for the specimen, expressed as a percentage (e.g., 7.0).">Proportional Rut Depth (%):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="ProportionalRutDepthL${newIndex}" name="ProportionalRutDepthL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">

        <fieldset id="field21-1-1-L${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
            <div id="BulkDensitydivL${newIndex}" class="form-group">
                <label for="BulkDensityValueL${newIndex}" titletip-dyn="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="BulkDensityValueL${newIndex}" name="BulkDensityValueL${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                <label for="BulkDensityMethodL${newIndex}" titletip-dyn="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <select id="BulkDensityMethodL${newIndex}" name="BulkDensityMethodL${newIndex}">
                    <option value=""> Select </option>
                    <option value="Bulk density - dry">Bulk density - dry</option>
                    <option value="Bulk density - saturated surface dry (SSD)">Bulk density - saturated surface dry (SSD)</option>
                    <option value="Bulk density - sealed specimen">Bulk density - sealed specimen</option>
                    <option value="Bulk density by dimensions">Bulk density by dimensions</option>
                    <option value="Bulk density by Gamma-rays">Bulk density by Gamma-rays</option>
                </select>
            </div>
        </fieldset>

        <fieldset id="field21-1-2-L${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The percentage of voids in the bituminous sample, according to EN 12697-8.">Voids &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-8</span>&nbsp; </legend>
            <div id="VoidsdivL${newIndex}" class="form-group">
                <label for="AirVoidsL${newIndex}" titletip-dyn="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="AirVoidsL${newIndex}" name="AirVoidsL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                
                <label for="MineralAggregateVoidsL${newIndex}" titletip-dyn="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="MineralAggregateVoidsL${newIndex}" name="MineralAggregateVoidsL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            
                <label for="VoidsFilledWithBitumenL${newIndex}" titletip-dyn="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="VoidsFilledWithBitumenL${newIndex}" name="VoidsFilledWithBitumenL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            </div>
        </fieldset>
        
        <fieldset id="field21-1-3-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend">Proportional Rut Depth versus Cycles <span class="semicolon">(semicolon separated)</span></legend>
            <div id="ProportionalRutDepthVersusCyclesGraphdiv-${newIndex}" class="graph-form-group">
                <label for="CycleLg${newIndex}" titletip-dyn="The number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Cycles: &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="CycleLg${newIndex}" name="CycleLg${newIndex}" title="Enter valid positive integers, separated by semicolons.">
                <label for="ProportionalRutDepthLg${newIndex}" titletip-dyn="The average depth of a rut at the corresponding measurement cycle for the specimen, expressed as a percentage (e.g., 3.2).">Proportional Rut Depths (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="ProportionalRutDepthLg${newIndex}" name="ProportionalRutDepthLg${newIndex}" title="Enter valid numbers between 0 and 100, separated by semicolons.">
                <button class="graph-form-group-button" type="button" title="Show or hide plot." onclick="PlotGraph('field21-1-3-${newIndex}','Large or Extra-large Devices - Replications Results graph','CycleLg${newIndex}','Cycles','pi','ProportionalRutDepthLg${newIndex}','Proportional Rut Depth','pn')">&#x1F4C8;</button>
            </div>
        </fieldset>

        <span></span><span></span><span></span><span></span><span></span><span></span>
    `;
    if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
    container.appendChild(newField);
    attachTooltipListeners(newField);
}

// General function to add Replications for the Small Method A case
function addSAAir(containerId, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
        <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>

        <label for="ThicknessSA${newIndex}" titletip-dyn="The value of the thickness of the samples in mm (e.g., 50).">Thickness (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="ThicknessSA${newIndex}" name="ThicknessSA${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
        
        <label for="WheelTrackingRateSA${newIndex}" titletip-dyn="The mean rate at which the rut depth increases with time under repeated passes of a loaded wheel of a small size device Method A in air for the considered specimen, measured in micrometers per cycle (e.g., 30).">Wheel Tracking Rate (&micro;m/cycle):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="WheelTrackingRateSA${newIndex}" name="WheelTrackingRateSA${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
        
        <label for="CyclesNumberSA${newIndex}" titletip-dyn="The number of cycles reached. Note that two wheel passes count as one cycle (e.g., 1000).">Number of Cycles:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="number" id="CyclesNumberSA${newIndex}"  name="CyclesNumberSA${newIndex}"  min="1" title="Enter a valid positive integer.">

        <label for="RutDepthSA${newIndex}" titletip-dyn="The average depth of a rut at 1000 cycles for the considered specimen, if 1000 cycles are reached, which is measured in mm (e.g., 1.6).">Rut Depth (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="RutDepthSA${newIndex}"  name="RutDepthSA${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

        <fieldset id="field21-2-1-SA${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
            <div id="BulkDensitydivSA${newIndex}" class="form-group">
                <label for="BulkDensityValueSA${newIndex}" titletip-dyn="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="BulkDensityValueSA${newIndex}" name="BulkDensityValueSA${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                <label for="BulkDensityMethodSA${newIndex}" titletip-dyn="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <select id="BulkDensityMethodSA${newIndex}" name="BulkDensityMethodSA${newIndex}">
                    <option value=""> Select</option>
                    <option value="Bulk density - dry">Bulk density - dry</option>
                    <option value="Bulk density - saturated surface dry (SSD)">Bulk density - saturated surface dry (SSD)</option>
                    <option value="Bulk density - sealed specimen">Bulk density - sealed specimen</option>
                    <option value="Bulk density by dimensions">Bulk density by dimensions</option>
                    <option value="Bulk density by Gamma-rays">Bulk density by Gamma-rays</option>
                </select>
            </div>
        </fieldset>

        <fieldset id="field21-2-2-SA${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The percentage of voids in the bituminous sample, according to EN 12697-8.">Voids &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-8</span>&nbsp; </legend>
            <div id="VoidsdivSA${newIndex}" class="form-group">
                <label for="AirVoidsSA${newIndex}" titletip-dyn="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="AirVoidsSA${newIndex}" name="AirVoidsSA${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                
                <label for="MineralAggregateVoidsSA${newIndex}" titletip-dyn="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="MineralAggregateVoidsSA${newIndex}" name="MineralAggregateVoidsSA${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            
                <label for="VoidsFilledWithBitumenSA${newIndex}" titletip-dyn="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="VoidsFilledWithBitumenSA${newIndex}" name="VoidsFilledWithBitumenSA${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            </div>
        </fieldset>

        <fieldset id="field21-2-3-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend">Rut Depth versus Cycles <span class="semicolon">(semicolon separated)</span></legend>
            <div id="RutDepthVersusCyclesGraphSAdiv-${newIndex}" class="graph-form-group">
                <label for="CycleSAg${newIndex}" titletip-dyn="The number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Cycles: &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="CycleSAg${newIndex}" name="CycleSAg${newIndex}" title="Enter valid positive integers, separated by semicolons.">
                <label for="RutDepthSAg${newIndex}" titletip-dyn="The average depth of a rut at the corresponding measurement cycle for the specimen, measured in mm (e.g., 1.3).">Rut Depth (mm): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="RutDepthSAg${newIndex}" name="RutDepthSAg${newIndex}" title="Enter valid positive numbers, separated by semicolons.">
                <button class="graph-form-group-button" type="button" title="Show or hide plot." onclick="PlotGraph('field21-2-3-${newIndex}','Small Size Device Method A in Air - Replications Results graph','CycleSAg${newIndex}','Cycles','pi','RutDepthSAg${newIndex}','Rut Depth','pn')">&#x1F4C8;</button>
            </div>
        </fieldset>

        <span></span><span></span><span></span><span></span><span></span><span></span>
    `;
    if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
    container.appendChild(newField);
    attachTooltipListeners(newField);
}

// General function to add Replications for the Small Method B cases
function addSB(maincontainerId,containerId, type, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    let name = type === "SBA" ? "Air" : type === "SBW" ? "Water" : "Error";
    newField.className = theclass;
    newField.innerHTML = `
        <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>

        <label for="Thickness${type}${newIndex}" titletip-dyn="The value of the thickness of the samples in mm (e.g., 50).">Thickness (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="Thickness${type}${newIndex}" name="Thickness${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
        
        <label for="WheelTrackingSlope${type}${newIndex}" titletip-dyn="The mean rate at which the rut depth increases with time under repeated passes of a loaded wheel of a small size device Method B in air for the considered specimen, measured in millimeters per 1000 cycles (e.g., 30).">Wheel Tracking Slope (mm/10<sup>3</sup>cycle):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="WheelTrackingSlope${type}${newIndex}" name="WheelTrackingSlope${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

        <label for="CyclesNumber${type}${newIndex}" titletip-dyn="The number of cycles reached. Note that two wheel passes count as one cycle (e.g., 8200).">Number of Cycles:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="number" id="CyclesNumber${type}${newIndex}"  name="CyclesNumber${type}${newIndex}"  min="1" title="Enter a valid positive integer.">
        
        <label for="Value${type}prop${newIndex}" titletip-dyn="The average depth of a rut at 10000 cycles or at the final number of cycles reached if less than 10000 cycles, expressed as a percentage (e.g., 7.0).">Proportional Rut Depth (%):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="Value${type}prop${newIndex}"  name="Value${type}prop${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
    
        <label for="Value${type}${newIndex}" titletip-dyn="The average depth of a rut at 10000 cycles or at the final number of cycles reached if less than 10000 cycles, which is measured in mm (e.g., 2.7).">Rut Depth (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="Value${type}${newIndex}"  name="Value${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">


        <fieldset id="${maincontainerId}-1-${type}${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
            <div id="BulkDensitydiv${type}${newIndex}" class="form-group">
                <label for="BulkDensityValue${type}${newIndex}" titletip-dyn="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="BulkDensityValue${type}${newIndex}" name="BulkDensityValue${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                <label for="BulkDensityMethod${type}${newIndex}" titletip-dyn="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <select id="BulkDensityMethod${type}${newIndex}" name="BulkDensityMethod${type}${newIndex}">
                    <option value="">Select </option>
                    <option value="Bulk density - dry">Bulk density - dry</option>
                    <option value="Bulk density - saturated surface dry (SSD)">Bulk density - saturated surface dry (SSD)</option>
                    <option value="Bulk density - sealed specimen">Bulk density - sealed specimen</option>
                    <option value="Bulk density by dimensions">Bulk density by dimensions</option>
                    <option value="Bulk density by Gamma-rays">Bulk density by Gamma-rays</option>
                </select>
            </div>
        </fieldset>

        <fieldset id="${maincontainerId}-2-${type}${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The percentage of voids in the bituminous sample, according to EN 12697-8.">Voids &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-8</span>&nbsp; </legend>
            <div id="Voidsdiv${type}${newIndex}" class="form-group">
                <label for="AirVoids${type}${newIndex}" titletip-dyn="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="AirVoids${type}${newIndex}" name="AirVoids${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                
                <label for="MineralAggregateVoids${type}${newIndex}" titletip-dyn="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="MineralAggregateVoids${type}${newIndex}" name="MineralAggregateVoids${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            
                <label for="VoidsFilledWithBitumen${type}${newIndex}" titletip-dyn="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="VoidsFilledWithBitumen${type}${newIndex}" name="VoidsFilledWithBitumen${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            </div>
        </fieldset>

        <fieldset id="${maincontainerId}-3-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend">Rut Depth versus Cycles <span class="semicolon">(semicolon separated)</span></legend>
            <div id="RutDepthVersusCyclesGraph${type}div-${newIndex}" class="graph-form-group">
                <label for="Cycle${type}g${newIndex}" titletip-dyn="The number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Cycles: &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="Cycle${type}g${newIndex}" name="Cycle${type}g${newIndex}" title="Enter valid positive integers, separated by semicolons.">
                <label for="RutDepth${type}g${newIndex}" titletip-dyn="The average despth of a rut at the corresponding measurement cycle for the specimen, measured in mm (e.g., 2.2).">Rut Depth (mm): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="RutDepth${type}g${newIndex}" name="RutDepth${type}g${newIndex}" title="Enter valid positive numbers, separated by semicolons.">
                <button class="graph-form-group-button" type="button" title="Show or hide plot."onclick="PlotGraph('${maincontainerId}-3-${newIndex}','Small Size Device Method A in ${name} - Replications Results graph','Cycle${type}g${newIndex}','Cycles','pi','RutDepth${type}g${newIndex}','Rut Depth','pn')">&#x1F4C8;</button>
            </div>
        </fieldset>

        <span></span><span></span><span></span><span></span><span></span><span></span>
    `;
    if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
    container.appendChild(newField);
    attachTooltipListeners(newField);
}


// General function to add Replications for the Indirect Tensile Strength test
function addITSReplication(maincontainerId,containerId, type, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
        <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>

        <label for="IndirectTensileStrength${type}${newIndex}" titletip-dyn="The value of the maximum tensile stress calculated from the peak load, expressed in kilo-Pascals kPa (e.g., 3.034).">Indirect Tensile Strength - Dry (kPa):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="IndirectTensileStrength${type}${newIndex}" name="IndirectTensileStrength${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

        <fieldset id="${maincontainerId}-1-${type}${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend">Sample Dimensions</legend> 
            <div id="SampleDimensionsdiv${type}${newIndex}" class="form-group">
                <label for="Height${type}${newIndex}" titletip-dyn="The value of the height of the sample in mm (e.g., 63.5).">Height (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="Height${type}${newIndex}" name="Height${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                <label for="Diameter${type}${newIndex}" titletip-dyn="The value of the diameter of the sample in mm (e.g., 100).">Diameter (mm):&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="Diameter${type}${newIndex}" name="Diameter${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">                                 
            </div>
        </fieldset>  

        <fieldset id="${maincontainerId}-2-${type}${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
            <div id="BulkDensitydiv${type}${newIndex}" class="form-group">
                <label for="BulkDensityValue${type}${newIndex}" titletip-dyn="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="BulkDensityValue${type}${newIndex}" name="BulkDensityValue${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                <label for="BulkDensityMethod${type}${newIndex}" titletip-dyn="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:&nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <select id="BulkDensityMethod${type}${newIndex}" name="BulkDensityMethod${type}${newIndex}">
                    <option value="">Select </option>
                    <option value="Bulk density - dry">Bulk density - dry</option>
                    <option value="Bulk density - saturated surface dry (SSD)">Bulk density - saturated surface dry (SSD)</option>
                    <option value="Bulk density - sealed specimen">Bulk density - sealed specimen</option>
                    <option value="Bulk density by dimensions">Bulk density by dimensions</option>
                    <option value="Bulk density by Gamma-rays">Bulk density by Gamma-rays</option>
                </select>
            </div>
        </fieldset>

        <fieldset id="${maincontainerId}-3-${type}${newIndex}" class="TwoColumn-fieldset inner-fieldset">
            <legend class="specific-legend" title="The percentage of voids in the bituminous sample, according to EN 12697-8.">Voids &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-8</span>&nbsp; </legend>
            <div id="Voidsdiv${type}${newIndex}" class="form-group">
                <label for="AirVoids${type}${newIndex}" titletip-dyn="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="AirVoids${type}${newIndex}" name="AirVoids${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                
                <label for="MineralAggregateVoids${type}${newIndex}" titletip-dyn="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="MineralAggregateVoids${type}${newIndex}" name="MineralAggregateVoids${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            
                <label for="VoidsFilledWithBitumen${type}${newIndex}" titletip-dyn="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
                <input type="text" id="VoidsFilledWithBitumen${type}${newIndex}" name="VoidsFilledWithBitumen${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
            </div>
        </fieldset>

        <span></span><span></span><span></span><span></span><span></span><span></span>
    `;
    if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
    container.appendChild(newField);
    attachTooltipListeners(newField);
}

// General function to add Replications for the Stiffness test
function addStiffReplication(containerId, theclass) {
    const container = document.getElementById(containerId);
    const newIndex = container.childElementCount; 
    const newField = document.createElement('div');
    newField.className = theclass;
    newField.innerHTML = `
        <span class="repli-label"> &nbsp; Temperature ${newIndex} &nbsp; </span>

        <label for="TestTemperatureStiff${newIndex}" titletip-dyn="The temperature at which the test was conducted, measured in Degrees Celsius (e.g., 15).">Test Temperature (°C): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <input type="text" id="TestTemperatureStiff${newIndex}" name="TestTemperatureStiff${newIndex}" pattern="^(-?[0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid number.">

        <div>
            <select id="SelectFrequencyTimeStiff${newIndex}">
                <option value="Frequency" selected>Frequency (Hz)</option>
                <option value="LoadingTime">Loading time (ms)</option>
            </select>
            <label id="frequencyStiff${newIndex}" for="FrequencyTimeStiff${newIndex}_1" style="display: none;" titletip-dyn="The number of loading cycles applied to the specimen according to EN 12697-26, expressed in Hertz (e.g., 10).">Frequency (Hz): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
            <label id="loadtimeStiff${newIndex}" for="FrequencyTimeStiff${newIndex}_1" style="display: none;" titletip-dyn="The load time according to EN 12697-26, expressed in milliseconds (e.g., 100).">Loading time (ms): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button id="changefrequencytimeStiff${newIndex}" class="change-btn" style="display: none; padding: 5px 10px; font-size: 10px;" type="button">Change</button>
        </div>
        <div class="fourinputs">
            <input type="text" id="FrequencyTimeStiff${newIndex}_1" name="FrequencyTimeStiff${newIndex}_1" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="FrequencyTimeStiff${newIndex}_2" name="FrequencyTimeStiff${newIndex}_2" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="FrequencyTimeStiff${newIndex}_3" name="FrequencyTimeStiff${newIndex}_3" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="FrequencyTimeStiff${newIndex}_4" name="FrequencyTimeStiff${newIndex}_4" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
        </div>

        <label for="StiffnessModulusStiff${newIndex}_1" titletip-dyn="The stiffness modulus measured according to EN 12697-26, expressed in Megapascal (e.g., 3524).">Stiffness Modulus (MPa): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
        <div class="fourinputs">
            <input type="text" id="StiffnessModulusStiff${newIndex}_1" name="StiffnessModulusStiff${newIndex}_1"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="StiffnessModulusStiff${newIndex}_2" name="StiffnessModulusStiff${newIndex}_2"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="StiffnessModulusStiff${newIndex}_3" name="StiffnessModulusStiff${newIndex}_3"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="StiffnessModulusStiff${newIndex}_4" name="StiffnessModulusStiff${newIndex}_3"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
        </div>
                  
        <div>
            <select id="SelectStrainDisplacementStiff${newIndex}">
                <option value="Strain" selected>Strain (&micro;m/m)</option>
                <option value="Displacement">Displacement (mm)</option>
            </select>
            <label id="strainStiff${newIndex}" for="StrainDisplacementStiff${newIndex}_1" style="display: none;" titletip-dyn="The applied strain according to EN 12697-26, expressed in micrometers per meter (e.g., 400).">Strain (&micro;m/m): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>                                     
            <label id="displacementStiff${newIndex}" for="StrainDisplacementStiff${newIndex}_1" style="display: none;" titletip-dyn="The applied displacement in the Stiffness Test according to EN 12697-26, expressed in millimeters (e.g., 0.05).">Displacement (mm): &nbsp;&nbsp;<div class="tooltip-dyn"><i class="fa fa-info-circle information"></i> <span class="tooltiptext-dyn"></span></div></label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button id="changestraindisplacementStiff${newIndex}" class="change-btn" style="display: none; padding: 5px 10px; font-size: 10px;" type="button">Change</button>
        </div>

        <div class="fourinputs">
            <input type="text" id="StrainDisplacementStiff${newIndex}_1" name="StrainDisplacementStiff${newIndex}_1"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="StrainDisplacementStiff${newIndex}_2" name="StrainDisplacementStiff${newIndex}_2"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="StrainDisplacementStiff${newIndex}_3" name="StrainDisplacementStiff${newIndex}_3"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
            <input type="text" id="StrainDisplacementStiff${newIndex}_4" name="StrainDisplacementStiff${newIndex}_4"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
        </div>

        <span></span><span></span><span></span><span></span><span></span><span></span>
    `;
    container.appendChild(newField);
    attachTooltipListeners(newField);
    ChangeInputFieldLabel(`SelectStrainDisplacementStiff${newIndex}`, `strainStiff${newIndex}`, `Strain`, `displacementStiff${newIndex}`, `Displacement`, `changestraindisplacementStiff${newIndex}`);
    ChangeInputFieldLabel(`SelectFrequencyTimeStiff${newIndex}`, `frequencyStiff${newIndex}`, `Frequency`, `loadtimeStiff${newIndex}`, `LoadingTime`, `changefrequencytimeStiff${newIndex}`);
}

// Functions to show/hide data record forms
document.addEventListener("DOMContentLoaded", function () {
    var specificForms = document.querySelectorAll(".specific-form");
    specificForms.forEach(function (form) {
        form.classList.add("hidden");
    });
    showRecordForm();
});
function showRecordForm() {
    RecordFunction()
    var selectedRecordType = document.getElementById("completerecordType").value;
    var specificForms = document.querySelectorAll(".specific-form");
    specificForms.forEach(function (form) {form.classList.add("hidden");});
    var selectedForm = document.getElementById(selectedRecordType);
    if (selectedForm) {selectedForm.classList.remove("hidden");}
}
function RecordFunction() {
    var selectedRecordMainType = document.getElementById("RecordType").value;
    var selectedCompleteRecordType = document.getElementById("completerecordType").value;
    var completeFormSection = document.getElementById("Complete");
    var completeFormSectionField = document.getElementById("field2");
    var doiOnlySection = document.getElementById("field3");

    if (selectedRecordMainType === "completeForm") {
        completeFormSection.classList.remove("hidden");
        doiOnlySection.classList.add("hidden");
        if (selectedCompleteRecordType === "") {
            completeFormSectionField.classList.add("hidden");
             } else{completeFormSectionField.classList.remove("hidden");
        }
    } else if (selectedRecordMainType === "doiOnly") {
        completeFormSection.classList.add("hidden");
        completeFormSectionField.classList.add("hidden");
        doiOnlySection.classList.remove("hidden");
    } else {
        completeFormSection.classList.add("hidden");
        completeFormSectionField.classList.add("hidden");
        doiOnlySection.classList.add("hidden");
    }
}

// Function to show/hide sample preparation form - Rutting, Marshall, ITS, TSRST, UTST
function SamplePrepFunction(selectedelement, coringfield, loosefield){
    var selectedSampling = document.getElementById(selectedelement).value;
    var selectedcoring = document.getElementById(coringfield);
    var selectedloose = document.getElementById(loosefield);
    selectedcoring.style.display = "none";
    selectedloose.style.display = "none";
    if (selectedSampling === "PavementCoring") {
        selectedcoring.style.display = "block";
        selectedloose.style.display = "none";
    } else if (selectedSampling === "LooseMixture") {
        selectedcoring.style.display = "none";
        selectedloose.style.display = "block";
    } else {
        selectedcoring.style.display = "none";
        selectedloose.style.display = "none"; 
    }
}

// Function to show/hide sample dimensions - TSRST/UTST
function SampleDimPrisCylFunction(selectedelement, prisfield, cylfield){
    let selectedshape = document.getElementById(selectedelement).value;
    let selectedpri = document.getElementById(prisfield);
    let selectedcyl = document.getElementById(cylfield);
    selectedpri.style.display = "none";
    selectedcyl.style.display = "none";
    if (selectedshape === "Prismatic") {
        selectedpri.style.display = "block";
        selectedcyl.style.display = "none";
    } else if (selectedshape === "Cylindrical") {
        selectedpri.style.display = "none";
        selectedcyl.style.display = "block";
    } else {
        selectedpri.style.display = "none";
        selectedcyl.style.display = "none"; 
    }
}

// Function to show/hide sample shapes and dimensions - Stiffness Test
function StiffTestTypeSelection(prisfld,cylfld,trpfld) {
    var selectedTestTypestf = document.getElementById("TestTypeStiff").value;
    document.getElementById(prisfld).style.display = "none";
    document.getElementById(cylfld).style.display = "none";
    document.getElementById(trpfld).style.display = "none";
    if (selectedTestTypestf === "2PB-PR" || selectedTestTypestf === "3PB-PR" || selectedTestTypestf === "4PB-PR" || selectedTestTypestf === "DT-PR") {
        document.getElementById(prisfld).style.display = "block";
    } else if (selectedTestTypestf === "IT-CY" || selectedTestTypestf === "CIT-CY" || selectedTestTypestf === "DTC-CY" || selectedTestTypestf === "DT-CY") {
        document.getElementById(cylfld).style.display = "block";
    } else if (selectedTestTypestf === "2PB-TR") {
        document.getElementById(trpfld).style.display = "block";
    }
}

// Compaction Sub-function for Stiffness Test
function StiffnessCompaction(selectedelement, Roller) {
    var selectedcomptypestiff = document.getElementById(selectedelement).value;
    var selectedrollers = document.getElementsByClassName(Roller);
    for (var i = 0; i < selectedrollers.length; i++) {
        if (selectedcomptypestiff != "GyratoryCompactor" && selectedcomptypestiff != "MarshallCompactor") {
            selectedrollers[i].style.display = "block";
        } else {
            selectedrollers[i].style.display = "none";
        }
    }
}

// Function to show/hide reults form and to enable/disable required fields within each form - Rutting Test
function showResultsForm() {
    var selectedValue = document.getElementById("ResultsSelection").value;
    var Large = document.getElementById("field21-1");
    var LargeS = document.getElementById("field21-1-S");
    var Largebutton = document.getElementById("Largebutton");
    var SmallAAir = document.getElementById("field21-2");
    var SmallAAirS = document.getElementById("field21-2-S");
    var SmallAAirbutton = document.getElementById("SmallAAirbutton");
    var SmallBAir = document.getElementById("field21-3");
    var SmallBAirS = document.getElementById("field21-3-S");
    var SmallBAirbutton = document.getElementById("SmallBAirbutton");
    var SmallBWater = document.getElementById("field21-4");
    var SmallBWaterS = document.getElementById("field21-4-S");
    var SmallBWaterbutton = document.getElementById("SmallBWaterbutton");

    Large.style.display = "none";
    LargeS.style.display = "none";
    Largebutton.style.display = "none";
    SmallAAir.style.display = "none";
    SmallAAirS.style.display = "none";
    SmallAAirbutton.style.display = "none";
    SmallBAir.style.display = "none";
    SmallBAirS.style.display = "none";
    SmallBAirbutton.style.display = "none";
    SmallBWater.style.display = "none";
    SmallBWaterS.style.display = "none";
    SmallBWaterbutton.style.display = "none";

    if (selectedValue === "LargeOrExtraLargeDevices") {
        Large.style.display = "block";
        if (LargeS.childElementCount>1){LargeS.style.display = "block";}
        Largebutton.style.display = "block";
    } else if (selectedValue === "SmallSizeDeviceMethod_A_Air") {
        SmallAAir.style.display = "block";
        if (SmallAAirS.childElementCount>1){SmallAAirS.style.display = "block";}
        SmallAAirbutton.style.display = "block";
    } else if (selectedValue === "SmallSizeDeviceMethod_B_Air") {
        SmallBAir.style.display = "block";
        if (SmallBAirS.childElementCount>1){SmallBAirS.style.display = "block";}
        SmallBAirbutton.style.display = "block";
    } else if (selectedValue === "SmallSizeDeviceMethod_B_Water") {
        SmallBWater.style.display = "block";
        if (SmallBWaterS.childElementCount>1){SmallBWaterS.style.display = "block";}
        SmallBWaterbutton.style.display = "block";
    }

    var Lgroup = [
        document.getElementById("MeanThicknessL"),
        document.getElementById("CyclesNumberL"),
        document.getElementById("MeanProportionalRutDepthL"),
        document.getElementById("BulkDensityMethodL")
        ];  
    var SAgroup = [
        document.getElementById("MeanThicknessSA"),
        document.getElementById("MeanRutDepthSA"),
        document.getElementById("CyclesNumberSA"),
        document.getElementById("MeanWheelTrackingRateSA"),
        document.getElementById("BulkDensityMethodSA")
        ];
    var SBAgroup = [
        document.getElementById("MeanThicknessSBA"),
        document.getElementById("MeanWheelTrackingSlopeSBA"),
        document.getElementById("CyclesNumberSBA"),
        document.getElementById("MeanProportionalRutDepthSBA"),
        document.getElementById("MeanRutDepthSBA"),
        document.getElementById("BulkDensityMethodSBA")
        ];
    var SBWgroup = [
        document.getElementById("MeanThicknessSBW"),
        document.getElementById("MeanWheelTrackingSlopeSBW"),
        document.getElementById("CyclesNumberSBW"),
        document.getElementById("MeanProportionalRutDepthSBW"),
        document.getElementById("MeanRutDepthSBW"),
        document.getElementById("BulkDensityMethodSBW")
        ];

    if (selectedValue === "LargeOrExtraLargeDevices") {
        Lgroup.forEach(function(element) {element.setAttribute("required", "");});
        SAgroup.forEach(function(element) {element.removeAttribute("required");});
        SBAgroup.forEach(function(element) {element.removeAttribute("required");});
        SBWgroup.forEach(function(element) {element.removeAttribute("required");});
    } else if (selectedValue === "SmallSizeDeviceMethod_A_Air") {
        SAgroup.forEach(function(element) {element.setAttribute("required", "");});
        Lgroup.forEach(function(element) {element.removeAttribute("required");});
        SBAgroup.forEach(function(element) {element.removeAttribute("required");});
        SBWgroup.forEach(function(element) {element.removeAttribute("required");});
    } else if (selectedValue === "SmallSizeDeviceMethod_B_Air") {
        SBAgroup.forEach(function(element) {element.setAttribute("required", "");});
        Lgroup.forEach(function(element) {element.removeAttribute("required");});
        SAgroup.forEach(function(element) {element.removeAttribute("required");});
        SBWgroup.forEach(function(element) {element.removeAttribute("required");});
    } else if (selectedValue === "SmallSizeDeviceMethod_B_Water") {
        SBWgroup.forEach(function(element) {element.setAttribute("required", "");});
        Lgroup.forEach(function(element) {element.removeAttribute("required");});
        SAgroup.forEach(function(element) {element.removeAttribute("required");});
        SBAgroup.forEach(function(element) {element.removeAttribute("required");});
    }
}
