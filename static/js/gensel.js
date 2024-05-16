
 
        // Functions concerning upload
        function updateFileName() {
            var fileInput = document.getElementById('xmlFile');
            var fileNameSpan = document.getElementById('fileName');
            fileNameSpan.innerHTML = '<b>' + fileInput.files[0].name + '</b>';
        }

        document.getElementById('select-all').addEventListener('change', function() {
            var checkboxes = document.querySelectorAll('#field-U input[type="checkbox"]');
            checkboxes.forEach(function(checkbox) {checkbox.checked = document.getElementById('select-all').checked;});
        });
        var otherCheckboxes = document.querySelectorAll('#field-U input[type="checkbox"]:not(#select-all)');
        otherCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                if (!this.checked) {
                    document.getElementById('select-all').checked = false;
                } else {
                    var allChecked = true;
                    otherCheckboxes.forEach(function(cb) {if (!cb.checked) {allChecked = false;}});
                    document.getElementById('select-all').checked = allChecked;
                }
            });
        });


        // Fucntion to activate sidebar dropdown
        document.addEventListener('DOMContentLoaded', function () {
            const sidebarLinks = document.querySelectorAll('.sidebar a.dropdown');
            sidebarLinks.forEach(function (link) {
                link.addEventListener('click', function (event) {
                    const hasSubmenu = link.nextElementSibling && link.nextElementSibling.tagName === 'UL';
                    const parentMenu = link.parentElement;
                    const siblingLinks = parentMenu.parentElement.querySelectorAll('a.dropdown');
                    siblingLinks.forEach(function (otherLink) {
                        if (otherLink !== link) {
                            otherLink.classList.remove('active');
                            const otherNestedList = otherLink.nextElementSibling;
                            if (otherNestedList) {
                                otherNestedList.style.display = 'none';
                            }
                        }
                    });
                    link.classList.toggle('active');
                    if (hasSubmenu) {
                        const nestedList = link.nextElementSibling;
                        if (nestedList.style.display === 'block') {
                            nestedList.style.display = 'none';
                        } else {
                            nestedList.style.display = 'block';
                        }
                    }
                });
            });
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            var sidebarLinks = document.querySelectorAll('.sidebar a');
            sidebarLinks.forEach(function(link) {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    var targetId = this.getAttribute('href').substring(1);
                    var targetElement = document.getElementById(targetId);
                    if (targetElement) {targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });}
                });
            });
        });


        // General fucntion to add additional propoerties for the different raw materials
        function addadditional(containerId, type, theclass) {
            const container = document.getElementById(containerId);
            const newIndex = container.childElementCount; 
            const newField = document.createElement('div');
            newField.className = theclass;
            newField.innerHTML = `
                <span class="multilabel"> •&nbsp; Property ${newIndex} &nbsp;• </span>
                <label for="TestMethod${type}_${newIndex}" title="The name of the additional property of the considered raw material (e.g., Micro-Deval test).">Test Method:</label>
                <input type="text" id="TestMethod${type}_${newIndex}" name="TestMethod${type}_${newIndex}" >

                <label for="Value${type}_${newIndex}" title="The value of the additional property of the considered raw material (e.g., 16).">Value:</label>
                <input type="text" id="Value${type}_${newIndex}" name="Value${type}_${newIndex}">

                <label for="Unit${type}_${newIndex}" title="The unit of measurement of the additional property of the considered raw material (e.g., percentage).">Unit:</label>
                <input type="text" id="Unit${type}_${newIndex}" name="Unit${type}_${newIndex}">
            `;
            container.appendChild(newField);
        }

        // General fucntion to add additional Additives
        function addAdditive(containerId, theclass) {
            const container = document.getElementById(containerId);
            const newIndex = container.childElementCount; 
            const newField = document.createElement('div');
            newField.className = theclass;
            newField.innerHTML = `
                    <br><br>
                    <span class="multilabel multilabellarger"> &#11201;&nbsp; Additive ${newIndex} &nbsp;&#11201; </span>
                    <label for="TypeAddtv_${newIndex}" title=">The type of the additive (e.g., Recycling agent).">Type: </label>
                    <input type="text" id="TypeAddtv_${newIndex}" name="TypeAddtv_${newIndex}">

                    <label for="PercentageMassAddtv_${newIndex}" title="The percentage by mass of this additive to the total mass of the bituminous mixture (e.g., 1.1).">Percentage by Mass (%): </label>
                    <input type="text" id="PercentageMassAddtv_${newIndex}" name="PercentageMassAddtv_${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">

                    <fieldset id="field14-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                        <legend class="specific-legend" title="The name, value, and unit of measurement for any additional properties of the used material.">Additional Properties</legend>
                        <div id="AdditionalPropertiesAddtv_${newIndex}" class="form-group">
                            <span class="multilabel"> •&nbsp; Property 1 &nbsp;• </span>
                            <label for="TestMethodAddtv_${newIndex}_1" title="The name of the additional property of the considered raw material (e.g., Micro-Deval test).">Test Method: </label>
                            <input type="text" id="TestMethodAddtv_${newIndex}_1" name="TestMethodAddtv_${newIndex}_1">
                            
                            <label for="ValueAddtv_${newIndex}_1" title="The value of the additional property of the considered raw material (e.g., 16).">Value: </label>
                            <input type="text" id="ValueAddtv_${newIndex}_1" name="ValueAddtv_${newIndex}_1">
                            
                            <label for="UnitAddtv_${newIndex}_1" title="The unit of measurement of the additional property of the considered raw material (e.g., percentage).">Unit: </label>
                            <input type="text" id="UnitAddtv_${newIndex}_1" name="UnitAddtv_${newIndex}_1">
                        </div>
                    </fieldset>
                    <button type="button" class= "special-button TwoColumn"  onclick="addadditional('field14-${newIndex}','Addtv_${newIndex}','form-group TwoColumn dynamicPro')">&#10010; Property</button>                    
            `;
            container.appendChild(newField);
        }

        // General fucntion to add additional properties for the mix design process
        function addmixdesign(containerId, theclass) {
            const container = document.getElementById(containerId);
            const newIndex = container.childElementCount; 
            const newField = document.createElement('div');
            newField.className = theclass;
            newField.innerHTML = `
                <span class="multilabel"> 	&#9664;&nbsp; Property ${newIndex} &nbsp;&#9654;	 </span>
                <label for="OtherMixingPropertyName_${newIndex}" title="The name of a non-standard property in the mixing design process (e.g., Fibres percentage).">Name: </label>
                <input type="text" id="OtherMixingPropertyName_${newIndex}" name="OtherMixingPropertyName_${newIndex}">
                
                <label for="OtherMixingPropertyValue_${newIndex}" title="The value of the non-standard property in the mixing design process (e.g., 0.042).">Value: </label>
                <input type="text" id="OtherMixingPropertyValue_${newIndex}" name="OtherMixingPropertyValue_${newIndex}">
                
                <label for="OtherMixingPropertyUnit_${newIndex}" title="The unit of measurement for the non-standard property in the mixing design process (e.g., Mass-%).">Unit: </label>
                <input type="text" id="OtherMixingPropertyUnit_${newIndex}" name="OtherMixingPropertyUnit_${newIndex}">           
            `;
            container.appendChild(newField);
        }

        // General fucntion to add Replications for the Large case
        function addLarge(containerId, theclass) {
            const container = document.getElementById(containerId);
            const newIndex = container.childElementCount; 
            const newField = document.createElement('div');
            newField.className = theclass;
            newField.innerHTML = `
                <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>
                <label for="CyclesNumberL${newIndex}" title="The required number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Number of Cycles:</label>
                <input type="number" id="CyclesNumberL${newIndex}" min="0" title="Enter a valid positive integer.">
                
                <label for="ProportionalRutDepthL${newIndex}" title="The average depth of a rut at the required number of cycles for the specimen, expressed as a percentage (e.g., 3.2).">Proportional Rut Depth (%):</label>
                <input type="text" id="ProportionalRutDepthL${newIndex}" name="ProportionalRutDepthL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">

                <fieldset id="field21-1-1-L${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
                    <div id="BulkDensitydivL${newIndex}" class="form-group">
                        <label for="BulkDensityValueL${newIndex}" title="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): </label>
                        <input type="text" id="BulkDensityValueL${newIndex}" name="BulkDensityValueL${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                        <label for="BulkDensityMethodL${newIndex}" title="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:</label>
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
                        <label for="AirVoidsL${newIndex}" title="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): </label>
                        <input type="text" id="AirVoidsL${newIndex}" name="AirVoidsL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                        
                        <label for="MineralAggregateVoidsL${newIndex}" title="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): </label>
                        <input type="text" id="MineralAggregateVoidsL${newIndex}" name="MineralAggregateVoidsL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    
                        <label for="VoidsFilledWithBitumenL${newIndex}" title="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): </label>
                        <input type="text" id="VoidsFilledWithBitumenL${newIndex}" name="VoidsFilledWithBitumenL${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    </div>
                </fieldset>
                
                <fieldset id="field21-1-3-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend">Proportional Rut Depth versus Cycles <span class="semicolon">(semicolon separated)</span></legend>
                    <div id="ProportionalRutDepthVersusCyclesGraphdiv-${newIndex}" class="graph-form-group">
                        <label for="CycleLg${newIndex}" title="The number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Cycles: </label>
                        <input type="text" id="CycleLg${newIndex}" name="CycleLg${newIndex}" title="Enter valid positive integers, separated by semicolons.">
                        <label for="ProportionalRutDepthLg${newIndex}" title="The average depth of a rut at the corresponding measurement cycle for the specimen, expressed as a percentage (e.g., 3.2).">Proportional Rut Depths (%): </label>
                        <input type="text" id="ProportionalRutDepthLg${newIndex}" name="ProportionalRutDepthLg${newIndex}" title="Enter valid numbers between 0 and 100, separated by semicolons.">
                        <button class="graph-form-group-button" type="button" title="Show or hide plot." onclick="PlotGraph('field21-1-3-${newIndex}','Large or Extra-large Devices - Replications Results graph','CycleLg${newIndex}','Cycles','ProportionalRutDepthLg${newIndex}','Proportional Rut Depth')">&#x1F4C8;</button>
                    </div>
                </fieldset>

                <span></span><span></span><span></span><span></span><span></span><span></span>
            `;
            if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
            container.appendChild(newField);
        }

        // General fucntion to add Replications for the Small Method A case
        function addSAAir(containerId, theclass) {
            const container = document.getElementById(containerId);
            const newIndex = container.childElementCount; 
            const newField = document.createElement('div');
            newField.className = theclass;
            newField.innerHTML = `
                <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>
                <label for="WheelTrackingRateSA${newIndex}" title="The mean rate at which the rut depth increases with time under repeated passes of a loaded wheel of a small size device Method A in air for the considered specimen, measured in micrometers per cycle (e.g., 30).">Wheel Tracking Rate (&micro;m/cycle):</label>
                <input type="text" id="WheelTrackingRateSA${newIndex}" name="WheelTrackingRateSA${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
                
                <fieldset id="field21-2-S-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <div id="RutDepthSAdiv${newIndex}" class="form-group">
                        <label for="RutDepthSA${newIndex}">Final number of cycles:</label>
                        <select id="RutDepthSA${newIndex}" name="RutDepthSA${newIndex}" onchange="showResultsSA('${newIndex}')">
                            <option value="" selected> Select </option>
                            <option value="ReachedSA"> Equal or greater than 1000 </option>
                            <option value="UnreachedSA"> Less than 1000 </option>
                        </select>
                        
                        <label for="Cycles1000SA${newIndex}"  id="Cycles1000SAlabel${newIndex}" class="hidden-class" title="The average depth of a rut at 1000 cycles for the considered specimen, if 1000 cycles are reached, which is measured in mm (e.g., 1.6).">Rut Depth (mm):</label>
                        <input type="text" id="Cycles1000SA${newIndex}" name="Cycles1000SA${newIndex}" class="hidden-class"  pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                        <label for="RutDepth15mmSA${newIndex}" id="RutDepth15mmSAlabel${newIndex}" class="hidden-class" title="The number of cycles needed to reach 15 mm rut depth, if the final number of cycles is less than 1000 (e.g., 750).">Number of Cycles:</label>
                        <input type="number" id="RutDepth15mmSA${newIndex}"  name="RutDepth15mmSA${newIndex}" class="hidden-class" min="1" max="999" title="Enter a valid positive integer.">
                    </div>
                </fieldset>

                <fieldset id="field21-2-1-SA${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
                    <div id="BulkDensitydivSA${newIndex}" class="form-group">
                        <label for="BulkDensityValueSA${newIndex}" title="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): </label>
                        <input type="text" id="BulkDensityValueSA${newIndex}" name="BulkDensityValueSA${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                        <label for="BulkDensityMethodSA${newIndex}" title="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:</label>
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
                        <label for="AirVoidsSA${newIndex}" title="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): </label>
                        <input type="text" id="AirVoidsSA${newIndex}" name="AirVoidsSA${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                        
                        <label for="MineralAggregateVoidsSA${newIndex}" title="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): </label>
                        <input type="text" id="MineralAggregateVoidsSA${newIndex}" name="MineralAggregateVoidsSA${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    
                        <label for="VoidsFilledWithBitumenSA${newIndex}" title="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): </label>
                        <input type="text" id="VoidsFilledWithBitumenSA${newIndex}" name="VoidsFilledWithBitumenSA${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    </div>
                </fieldset>

                <fieldset id="field21-2-3-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend">Rut Depth versus Cycles <span class="semicolon">(semicolon separated)</span></legend>
                    <div id="RutDepthVersusCyclesGraphSAdiv-${newIndex}" class="graph-form-group">
                        <label for="CycleSAg${newIndex}" title="The number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Cycles: </label>
                        <input type="text" id="CycleSAg${newIndex}" name="CycleSAg${newIndex}" title="Enter valid positive integers, separated by semicolons.">
                        <label for="RutDepthSAg${newIndex}" title="The average depth of a rut at the corresponding measurement cycle for the specimen, measured in mm (e.g., 1.3).">Rut Depth (mm): </label>
                        <input type="text" id="RutDepthSAg${newIndex}" name="RutDepthSAg${newIndex}" title="Enter valid positive numbers, separated by semicolons.">
                        <button class="graph-form-group-button" type="button" title="Show or hide plot." onclick="PlotGraph('field21-2-3-${newIndex}','Small Size Device Method A in Air - Replications Results graph','CycleSAg${newIndex}','Cycles','RutDepthSAg${newIndex}','Rut Depth')">&#x1F4C8;</button>
                    </div>
                </fieldset>

                <span></span><span></span><span></span><span></span><span></span><span></span>
            `;
            if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
            container.appendChild(newField);
        }

        // General fucntion to add Replications for the Small Method B cases
        function addSB(maincontainerId,containerId, type, theclass) {
            const container = document.getElementById(containerId);
            const newIndex = container.childElementCount; 
            const newField = document.createElement('div');
            let name = type === "SBA" ? "Air" : type === "SBW" ? "Water" : "Error";
            newField.className = theclass;
            newField.innerHTML = `
                <span class="repli-label"> &nbsp; Replication ${newIndex} &nbsp; </span>
                <label for="WheelTrackingSlope${type}${newIndex}" title="The mean rate at which the rut depth increases with time under repeated passes of a loaded wheel of a small size device Method B in air for the considered specimen, measured in micrometers per 1000 cycles (e.g., 30).">Wheel Tracking Slope (&micro;m/1000cycle):</label>
                <input type="text" id="WheelTrackingSlope${type}${newIndex}" name="WheelTrackingSlope${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                <fieldset id="${containerId}-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <div id="ProportionalAndRutDepth${type}div${newIndex}" class="form-group">
                        <label for="ProportionalAndRutDepth${type}${newIndex}">Final number of cycles:</label>
                        <select id="ProportionalAndRutDepth${type}${newIndex}" name="ProportionalAndRutDepth${type}${newIndex}" onchange="showResultsSB('${type}','${newIndex}')">
                            <option value="" disabled selected>Select </option>
                            <option value="Reached${type}"> Equal or greater than 10000 </option>
                            <option value="Unreached${type}"> Less than 10000 </option>
                        </select>

                        <label for="Cycles10000ValueCyclesNumber${type}${newIndex}" id="Cycles10000ValueCyclesNumber${type}label${newIndex}" class="hidden-class" title="The final number of cycles reached above 10000. Note that two wheel passes count as one cycle (e.g., 17500).">Number of Cycles:</label>
                        <input type="number" id="Cycles10000ValueCyclesNumber${type}${newIndex}"  name="Cycles10000ValueCyclesNumber${type}${newIndex}" class="hidden-class" min="10000" title="Enter a valid positive integer.">
                        
                        <label for="Cycles10000Value${type}prop${newIndex}"  id="Cycles10000Value${type}proplabel${newIndex}" class="hidden-class" title="The average depth of a rut at 10000 cycles for the specimen, expressed as a percentage (e.g., 4.95).">Proportional Rut Depth (%): </label>
                        <input type="text" id="Cycles10000Value${type}prop${newIndex}" name="Cycles10000Value${type}prop${newIndex}" class="hidden-class" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">

                        <label for="Cycles10000Value${type}${newIndex}"  id="Cycles10000Value${type}label${newIndex}" class="hidden-class" title="The average depth of a rut at 10000 cycles for the considered specimen, if 10000 cycles are reached, which is measured in mm (e.g., 1.85).">Rut Depth (mm):</label>
                        <input type="text" id="Cycles10000Value${type}${newIndex}" name="Cycles10000Value${type}${newIndex}" class="hidden-class" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                        <label for="CyclesNumber${type}${newIndex}" id="CyclesNumber${type}label${newIndex}" class="hidden-class" title="The number of cycles reached if less than 10000. Note that two wheel passes count as one cycle (e.g., 8200).">Number of Cycles:</label>
                        <input type="number" id="CyclesNumber${type}${newIndex}"  name="CyclesNumber${type}${newIndex}" class="hidden-class" min="1" max="9999" title="Enter a valid positive integer.">
                        
                        <label for="Value${type}prop${newIndex}" id="Value${type}proplabel${newIndex}" class="hidden-class" title="The average depth of a rut at the number of cycles reached for the specimen, expressed as a percentage (e.g., 4.8).">Proportional Rut Depth (%):</label>
                        <input type="text" id="Value${type}prop${newIndex}"  name="Value${type}prop${newIndex}" class="hidden-class" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    
                        <label for="Value${type}${newIndex}" id="Value${type}label${newIndex}" class="hidden-class" title="The average depth of a rut at the number of cycles reached for the considered specimen, if 10000 cycles are not reached, which is measured in mm (e.g., 2.7).">Rut Depth (mm):</label>
                        <input type="text" id="Value${type}${newIndex}"  name="Value${type}${newIndex}" class="hidden-class" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">
                    </div>
                </fieldset>

                <fieldset id="${maincontainerId}-1-${type}${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend" title="The value, unit of measurement, and method of measurement for the bulk density of the specimen according to EN 12697-6.">Bulk Density &nbsp;&nbsp;&nbsp;<span class="standard">EN 12697-6</span>&nbsp;</legend>
                    <div id="BulkDensitydiv${type}${newIndex}" class="form-group">
                        <label for="BulkDensityValue${type}${newIndex}" title="The value of the bulk density of the bituminous specimen, expressed in Mg/m&sup3; (e.g., 2.326).">Bulk Density (Mg/m&sup3;): </label>
                        <input type="text" id="BulkDensityValue${type}${newIndex}" name="BulkDensityValue${type}${newIndex}" pattern="^([0-9]\\d*(\\.\\d{1,4})?)$" title="Enter a valid positive number.">

                        <label for="BulkDensityMethod${type}${newIndex}" title="The method of measurement of the bulk density of the bituminous specimen according to EN 12697-6 (e.g., Bulk density - sealed specimen).">Method of Measurement:</label>
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
                        <label for="AirVoids${type}${newIndex}" title="The percentage of air voids in the bituminous sample (e.g., 4.6).">Air Voids (%): </label>
                        <input type="text" id="AirVoids${type}${newIndex}" name="AirVoids${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                        
                        <label for="MineralAggregateVoids${type}${newIndex}" title="The percentage of voids in the mineral aggregate (VMA) in the bituminous sample (e.g., 16.2).">Mineral Aggregate Voids (%): </label>
                        <input type="text" id="MineralAggregateVoids${type}${newIndex}" name="MineralAggregateVoids${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    
                        <label for="VoidsFilledWithBitumen${type}${newIndex}" title="The percentage of voids filled with bitumen in the bituminous sample (e.g., 71.6).">Voids Filled With Bitumen (%): </label>
                        <input type="text" id="VoidsFilledWithBitumen${type}${newIndex}" name="VoidsFilledWithBitumen${type}${newIndex}" pattern="^(100(\\.0{1,4})?|\\d{1,2}(\\.\\d{1,4})?)$" title="Enter a valid number between 0 and 100.">
                    </div>
                </fieldset>

                <fieldset id="${maincontainerId}-3-${newIndex}" class="TwoColumn-fieldset inner-fieldset">
                    <legend class="specific-legend">Rut Depth versus Cycles <span class="semicolon">(semicolon separated)</span></legend>
                    <div id="RutDepthVersusCyclesGraph${type}div-${newIndex}" class="graph-form-group">
                        <label for="Cycle${type}g${newIndex}" title="The number of cycles. Note that two wheel passes count as one cycle (e.g., 2500).">Cycles: </label>
                        <input type="text" id="Cycle${type}g${newIndex}" name="Cycle${type}g${newIndex}" title="Enter valid positive integers, separated by semicolons.">
                        <label for="RutDepth${type}g${newIndex}" title="The average despth of a rut at the corresponding measurement cycle for the specimen, measured in mm (e.g., 2.2).">Rut Depth (mm): </label>
                        <input type="text" id="RutDepth${type}g${newIndex}" name="RutDepth${type}g${newIndex}" title="Enter valid positive numbers, separated by semicolons.">
                        <button class="graph-form-group-button" type="button" title="Show or hide plot."onclick="PlotGraph('${maincontainerId}-3-${newIndex}','Small Size Device Method A in ${name} - Replications Results graph','Cycle${type}g${newIndex}','Cycles','RutDepth${type}g${newIndex}','Rut Depth')">&#x1F4C8;</button>
                    </div>
                </fieldset>

                <span></span><span></span><span></span><span></span><span></span><span></span>
            `;
            if (document.getElementById(containerId).childElementCount>0){document.getElementById(containerId).style.display = "block";}
            container.appendChild(newField);
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
            RecordFucntion()
            var selectedRecordType = document.getElementById("completerecordType").value;
            var specificForms = document.querySelectorAll(".specific-form");
            specificForms.forEach(function (form) {
                form.classList.add("hidden");
                Array.from(form.querySelectorAll('[required]')).forEach(field => {
                    field.disabled = true;
                });
            });
            var selectedForm = document.getElementById(selectedRecordType);
            if (selectedForm) {
                selectedForm.classList.remove("hidden");
                Array.from(selectedForm.querySelectorAll('[required]')).forEach(field => {
                    field.disabled = false;
                });
            }
        }
        function RecordFucntion() {
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
                document.getElementById("doiOnly").setAttribute('required', 'true'); 
            } else {
                completeFormSection.classList.add("hidden");
                completeFormSectionField.classList.add("hidden");
                doiOnlySection.classList.add("hidden");
                document.getElementById("doiOnly").removeAttribute('required');
            }
        }

        // Function to show/hide sample preparation form
        function SamplePrepFucntion(){
            var selectedSampling = document.getElementById("Sampling").value;
            var selectedcoring = document.getElementById("field20-2");
            var selectedloose = document.getElementById("field20-3");

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

        // Function to show/hide reults form and to enable/disable required fields within each form
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
                document.getElementById("CyclesNumberL"),
                document.getElementById("MeanProportionalRutDepthL"),
                document.getElementById("BulkDensityMethodL")
                ];  
            var SAgroup = [
                document.getElementById("MeanRutDepthSA"),
                document.getElementById("CyclesNumberSA"),
                document.getElementById("MeanWheelTrackingRateSA")
                ];
            var SBAgroup = [
                document.getElementById("MeanWheelTrackingSlopeSBA"),
                document.getElementById("CyclesNumberSBA"),
                document.getElementById("MeanProportionalRutDepthSBA"),
                document.getElementById("MeanRutDepthSBA")
                ];
            var SBWgroup = [
                document.getElementById("MeanWheelTrackingSlopeSBW"),
                document.getElementById("CyclesNumberSBW"),
                document.getElementById("MeanProportionalRutDepthSBW"),
                document.getElementById("MeanRutDepthSBW")
                ];

            if (selectedValue === "LargeOrExtraLargeDevices") {
                Lgroup.forEach(function(element) {element.setAttribute("required", "");});
                SAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBWgroup.forEach(function(element) {element.removeAttribute("required");});
            } else if (selectedValue === "SmallSizeDeviceMethod_A_Air") {
                document.getElementById("MeanRutDepthSA").setAttribute("required", "");
                document.getElementById("CyclesNumberSA").setAttribute("required", "");
                document.getElementById("MeanWheelTrackingRateSA").setAttribute("required", "");
                Lgroup.forEach(function(element) {element.removeAttribute("required");});
                SBAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBWgroup.forEach(function(element) {element.removeAttribute("required");});
            } else if (selectedValue === "SmallSizeDeviceMethod_B_Air") {
                document.getElementById("MeanWheelTrackingSlopeSBA").setAttribute("required", "");
                document.getElementById("CyclesNumberSBA").setAttribute("required", "");
                document.getElementById("MeanProportionalRutDepthSBA").setAttribute("required", "");
                document.getElementById("MeanRutDepthSBA").setAttribute("required", "");
                Lgroup.forEach(function(element) {element.removeAttribute("required");});
                SAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBWgroup.forEach(function(element) {element.removeAttribute("required");});
            } else if (selectedValue === "SmallSizeDeviceMethod_B_Water") {
                document.getElementById("MeanWheelTrackingSlopeSBW").setAttribute("required", "");
                document.getElementById("CyclesNumberSBW").setAttribute("required", "");
                document.getElementById("MeanProportionalRutDepthSBW").setAttribute("required", "");
                document.getElementById("MeanRutDepthSBW").setAttribute("required", "");
                Lgroup.forEach(function(element) {element.removeAttribute("required");});
                SAgroup.forEach(function(element) {element.removeAttribute("required");});
                SBAgroup.forEach(function(element) {element.removeAttribute("required");});
            }
        }

        function showResultsSA(index) {
            //Small A Air
            var SASelection = document.getElementById(`RutDepthSA${index}`).value;
            var cycles1000SAlabel = document.getElementById(`Cycles1000SAlabel${index}`);
            var cycles1000SAvalue = document.getElementById(`Cycles1000SA${index}`);
            var rutDepth15mmSAlabel = document.getElementById(`RutDepth15mmSAlabel${index}`);
            var rutDepth15mmSAvalue = document.getElementById(`RutDepth15mmSA${index}`);
            
            if (SASelection === "ReachedSA") {
                cycles1000SAlabel.style.display = "block";
                cycles1000SAvalue.style.display = "block";
                rutDepth15mmSAlabel.style.display = "none";
                rutDepth15mmSAvalue.style.display = "none";
            } else if(SASelection === "UnreachedSA") {
                cycles1000SAlabel.style.display = "none";
                cycles1000SAvalue.style.display = "none";
                rutDepth15mmSAlabel.style.display = "block";
                rutDepth15mmSAvalue.style.display = "block";
            } else {
                cycles1000SAlabel.style.display = "none";
                cycles1000SAvalue.style.display = "none";
                rutDepth15mmSAlabel.style.display = "none";
                rutDepth15mmSAvalue.style.display = "none";
            }

        }
        
        function showResultsSB(type, index) {
            //Small B Air/Water
            var SBSelection = document.getElementById(`ProportionalAndRutDepth${type}${index}`).value;
            var cycles10000ValueCyclesNumberrSBlabel = document.getElementById(`Cycles10000ValueCyclesNumber${type}label${index}`);
            var cycles10000ValueCyclesNumberSB = document.getElementById(`Cycles10000ValueCyclesNumber${type}${index}`);
            var cycles10000ValueSBproplabel = document.getElementById(`Cycles10000Value${type}proplabel${index}`);
            var cycles10000ValueSBprop = document.getElementById(`Cycles10000Value${type}prop${index}`);
            var cycles10000ValueSBlabel = document.getElementById(`Cycles10000Value${type}label${index}`);
            var cycles10000ValueSB = document.getElementById(`Cycles10000Value${type}${index}`);
            var cyclesNumberSBlabel = document.getElementById(`CyclesNumber${type}label${index}`);
            var cyclesNumberSB = document.getElementById(`CyclesNumber${type}${index}`);
            var valueSBproplabel = document.getElementById(`Value${type}proplabel${index}`);
            var valueSBprop = document.getElementById(`Value${type}prop${index}`);
            var valueSBlabel = document.getElementById(`Value${type}label${index}`);
            var valueSB = document.getElementById(`Value${type}${index}`);

            if (SBSelection === `Reached${type}`) {
                cycles10000ValueCyclesNumberrSBlabel.style.display = "block";
                cycles10000ValueCyclesNumberSB.style.display = "block";
                cycles10000ValueSBproplabel.style.display = "block";
                cycles10000ValueSBprop.style.display = "block";
                cycles10000ValueSBlabel.style.display = "block";
                cycles10000ValueSB.style.display = "block";
                cyclesNumberSBlabel.style.display = "none";
                cyclesNumberSB.style.display = "none";
                valueSBproplabel.style.display = "none";
                valueSBprop.style.display = "none";
                valueSBlabel.style.display = "none";
                valueSB.style.display = "none";
            } else if(SBSelection === `Unreached${type}`) {
                cycles10000ValueCyclesNumberrSBlabel.style.display = "none";
                cycles10000ValueCyclesNumberSB.style.display = "none";
                cycles10000ValueSBproplabel.style.display = "none";
                cycles10000ValueSBprop.style.display = "none";
                cycles10000ValueSBlabel.style.display = "none";
                cycles10000ValueSB.style.display = "none";
                cyclesNumberSBlabel.style.display = "block";
                cyclesNumberSB.style.display = "block";
                valueSBproplabel.style.display = "block";
                valueSBprop.style.display = "block";
                valueSBlabel.style.display = "block";
                valueSB.style.display = "block";
            } else {
                cycles10000ValueCyclesNumberrSBlabel.style.display = "none";
                cycles10000ValueCyclesNumberSB.style.display = "none";
                cycles10000ValueSBproplabel.style.display = "none";
                cycles10000ValueSBprop.style.display = "none";
                cycles10000ValueSBlabel.style.display = "none";
                cycles10000ValueSB.style.display = "none";
                cyclesNumberSBlabel.style.display = "none";
                cyclesNumberSB.style.display = "none";
                valueSBproplabel.style.display = "none";
                valueSBprop.style.display = "none";
                valueSBlabel.style.display = "none";
                valueSB.style.display = "none";
            }
        }

        // Function for plotting
        function PlotGraph(fieldId, fieldname, horiaxis, horiaxisname , veriaxis, veriaxisname)  {
            var existingChart = document.getElementById(fieldId + '_chart');
            if (existingChart) {existingChart.remove();return;}
            var XInput = document.getElementById(horiaxis).value.trim();
            var YInput = document.getElementById(veriaxis).value.trim();
            var X = XInput.split(';').map(v => v.trim()).filter(Boolean);
            var Y = YInput.split(';').map(v => v.trim()).filter(Boolean);
            if (!XInput || !YInput) {EntryError(`Please fill in both ${horiaxisname} and ${veriaxisname} fields.`, fieldId);return;}
            if (X.length !== Y.length) {
                EntryError(`${fieldname}  mismatch: ${horiaxisname} and ${veriaxisname} values must have the same count.`, fieldId);return;}
            for (let i = 0; i < X.length; i++) {
                let Xvalue = X[i];
                let Yvalue = Y[i];
                if (isNaN(parseFloat(Xvalue)) || parseFloat(Xvalue) < 0 || !/^\d+(\.\d+)?$/.test(Xvalue)) {
                    EntryError(`Invalid ${horiaxisname} in ${fieldname}: ${Xvalue}`, horiaxis);return;}
                if (veriaxisname=== "Rut Depth")
                {if (isNaN(parseFloat(Yvalue)) || parseFloat(Yvalue) < 0 || !/^\d+(\.\d+)?$/.test(Yvalue)) {
                        EntryError(`Invalid ${veriaxisname} in ${fieldname}: ${Yvalue}`, veriaxis);return;}
                }else{
                    if (isNaN(parseFloat(Yvalue)) || parseFloat(Yvalue) < 0 || parseFloat(Yvalue) > 100 || !/^\d+(\.\d+)?$/.test(Yvalue)) {
                        EntryError(`Invalid ${veriaxisname} in ${fieldname}: ${Yvalue}`, veriaxis);return;} 
                }
            }
            var sortedData = X.map((value, index) => {
                return { x: parseFloat(value), y: parseFloat(Y[index]) };
            }).sort((a, b) => a.x - b.x);
            var sortedX = sortedData.map(point => point.x);
            var sortedY = sortedData.map(point => point.y);
            var data = {
                labels: sortedX,
                datasets: [{
                    data: sortedY,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            };
            var chartDiv = document.createElement('div');
            chartDiv.id = fieldId + '_chart';
            document.getElementById(fieldId).appendChild(chartDiv);
            var canvas = document.createElement('canvas');
            canvas.id = fieldId + '_myChart';
            canvas.classList.add('linegraph-canvas');
            chartDiv.appendChild(canvas);

            var ctx = canvas.getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    scales:
                    {   
                        x: {
                            type: 'linear',
                            ticks: {
                                beginAtZero: true
                            },
                            title: {
                                display: true,
                                text: horiaxisname
                            },
                            grid: {
                                display: false
                            },
                        },
                        y: {
                            type: 'linear',
                            ticks: {
                                beginAtZero: true
                            },
                            title: {
                                display: true,
                                text: veriaxisname
                            },
                            grid: {
                                display: false
                            },
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            return false;
        }


        function generateXML() {
            // Basic form data validation
            let hasErrors = false;
            const requiredFields = ['measurementCampaignID', 'organizationName', 'locationCountry', 'year', 'NominalThickness','ResultsSelection'];
            let selectedDataRecordType = document.getElementById("completerecordType").value;  
            let visibleForm = document.getElementById(selectedDataRecordType);
            if (visibleForm) {
                let specificFormRequiredFields = Array.from(visibleForm.querySelectorAll('[required]')).map(field => field.id); 
                requiredFields.push(...specificFormRequiredFields);
                requiredFields.forEach(field => {
                    if (!document.getElementById(field).value) { hasErrors = true;alert(`Please fill in the required field: ${field}`);}
                });
            }
            if (hasErrors) {return false;}
        
            //////////////////////////
            //////////////////////////
            
            // Create XML document object
            let xmlDoc = document.implementation.createDocument("", "RuttingExp", null);
        
            // Populate DataSource element
            let dataSource = xmlDoc.createElement("DataSource");
            dataSource.appendChild(createTextElement(xmlDoc, "MeasurementCampaignID", document.getElementById("measurementCampaignID").value));
            dataSource.appendChild(createTextElement(xmlDoc, "OrganizationName", document.getElementById("organizationName").value));
            dataSource.appendChild(createTextElement(xmlDoc, "LocationCountry", document.getElementById("locationCountry").value));
            dataSource.appendChild(createTextElement(xmlDoc, "Year", document.getElementById("year").value));
        
            // Populate DataRecord element
            let dataRecord = xmlDoc.createElement("DataRecord");
            dataSource.appendChild(dataRecord);

            let selectedRecordMainType = document.getElementById("RecordType").value;
            if (selectedRecordMainType === "doiOnly") { 
                dataRecord.appendChild(createTextElement(xmlDoc, "DOIdentifier", document.getElementById("doiOnly").value));
            } else if (selectedRecordMainType === "completeForm") {
                let completeDataRecord = xmlDoc.createElement("CompleteDataRecord");
                dataRecord.appendChild(completeDataRecord);
                let selectedRecordType = document.getElementById("completerecordType").value;
                // Populate CompleteDataRecord element
                if (selectedRecordType === "ArticleInJournal") {
                let articleInJournal = xmlDoc.createElement("ArticleInJournal");
                completeDataRecord.appendChild(articleInJournal);
                articleInJournal.appendChild(createTextElement(xmlDoc, "FirstAuthor", document.getElementById("firstAuthor").value));
                let coAuthors = document.getElementById("coAuthors").value.split(";");
                coAuthors.forEach(author => articleInJournal.appendChild(createTextElement(xmlDoc, "Co-Authors", author.trim())));
                articleInJournal.appendChild(createTextElement(xmlDoc, "ArticleTitle", document.getElementById("articleTitle").value));
                articleInJournal.appendChild(createTextElement(xmlDoc, "JournalTitle", document.getElementById("journalTitle").value));
                articleInJournal.appendChild(createTextElement(xmlDoc, "JournalVolumeNumber", document.getElementById("journalVolumeNumber").value));
                articleInJournal.appendChild(createTextElement(xmlDoc, "JournalIssueNumber", document.getElementById("journalIssueNumber").value));
                articleInJournal.appendChild(createTextElement(xmlDoc, "ArticleStartingPage", document.getElementById("articleStartingPage").value));
                articleInJournal.appendChild(createTextElement(xmlDoc, "ArticleEndingPage", document.getElementById("articleEndingPage").value));
                articleInJournal.appendChild(createTextElement(xmlDoc, "ArticleNumber", document.getElementById("articleNumber").value || ""));
                articleInJournal.appendChild(createTextElement(xmlDoc, "Year", document.getElementById("Artyear").value || ""))
                articleInJournal.appendChild(createTextElement(xmlDoc, "Publisher", document.getElementById("publisher").value || "")); 
                articleInJournal.appendChild(createTextElement(xmlDoc, "DOI", document.getElementById("doi").value || "")); 
                articleInJournal.appendChild(createTextElement(xmlDoc, "ISSN", document.getElementById("issn").value || ""));
                } else if (selectedRecordType === "ArticleInConferenceProceedings") {
                let articleInConferenceProceedings = xmlDoc.createElement("ArticleInConferenceProceedings");
                completeDataRecord.appendChild(articleInConferenceProceedings);
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "FirstAuthor", document.getElementById("confFirstAuthor").value));
                let coAuthorsConf = document.getElementById("confCoAuthors").value.split(";");
                coAuthorsConf.forEach(author => articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "Co-Authors", author.trim())));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ArticleTitle", document.getElementById("confArticleTitle").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceTitle", document.getElementById("confConferenceTitle").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceCity", document.getElementById("confConferenceCity").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceCountry", document.getElementById("confConferenceCountry").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceProceedingsTitle", document.getElementById("confProceedingsTitle").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceProceedingsVolumeNumber", document.getElementById("confProceedingsVolumeNumber").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceProceedingsStartingPage", document.getElementById("confProceedingsStartingPage").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "ConferenceProceedingsEndingPage", document.getElementById("confProceedingsEndingPage").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "Year", document.getElementById("confYear").value));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "Publisher", document.getElementById("confPublisher").value || ""));
                articleInConferenceProceedings.appendChild(createTextElement(xmlDoc, "DOI", document.getElementById("confDOI").value || ""));
                } else if (selectedRecordType === "BookPublication") {
                let bookPublication = xmlDoc.createElement("BookPublication");
                completeDataRecord.appendChild(bookPublication);
                bookPublication.appendChild(createTextElement(xmlDoc, "FirstAuthor", document.getElementById("bookFirstAuthor").value));
                let coAuthorsBook = document.getElementById("bookCoAuthors").value.split(";");
                coAuthorsBook.forEach(author => bookPublication.appendChild(createTextElement(xmlDoc, "Co-Authors", author.trim())));
                bookPublication.appendChild(createTextElement(xmlDoc, "BookTitle", document.getElementById("bookTitle").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "BookChapterTitle", document.getElementById("bookChapterTitle").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "ChapterNumber", document.getElementById("bookChapterNumber").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "Editors", document.getElementById("bookEditors").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "EditionNumber", document.getElementById("bookEditionNumber").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "ChapterStartingPage", document.getElementById("bookChapterStartingPage").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "ChapterEndingPage", document.getElementById("bookChapterEndingPage").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "Year", document.getElementById("bookYear").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "Publisher", document.getElementById("bookPublisher").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "DOI", document.getElementById("bookDOI").value));
                bookPublication.appendChild(createTextElement(xmlDoc, "ISBN", document.getElementById("bookISBN").value));
                } else if (selectedRecordType === "PublishedReport") {
                let publishedReport = xmlDoc.createElement("PublishedReport");
                completeDataRecord.appendChild(publishedReport);
                publishedReport.appendChild(createTextElement(xmlDoc, "FirstAuthor", document.getElementById("reportFirstAuthor").value));
                let CoAuthorsPreport = document.getElementById("reportCoAuthors").value.split(";");
                CoAuthorsPreport.forEach(author => publishedReport.appendChild(createTextElement(xmlDoc, "Co-Authors", author.trim())));
                publishedReport.appendChild(createTextElement(xmlDoc, "ReportTitle", document.getElementById("reportTitle").value));
                publishedReport.appendChild(createTextElement(xmlDoc, "ReportNumber", document.getElementById("reportNumber").value));
                publishedReport.appendChild(createTextElement(xmlDoc, "Year", document.getElementById("reportYear").value));
                publishedReport.appendChild(createTextElement(xmlDoc, "Publisher", document.getElementById("reportPublisher").value));
                publishedReport.appendChild(createTextElement(xmlDoc, "DOI", document.getElementById("reportDOI").value));
                publishedReport.appendChild(createTextElement(xmlDoc, "URL", document.getElementById("reportURL").value));
                }  else if (selectedRecordType === "UnpublishedReport") {
                let unpublishedReport = xmlDoc.createElement("UnpublishedReport");
                completeDataRecord.appendChild(unpublishedReport);
                unpublishedReport.appendChild(createTextElement(xmlDoc, "FirstAuthor", document.getElementById("unreportFirstAuthor").value));
                let CoAuthorsUnreport = document.getElementById("unreportCoAuthors").value.split(";");
                CoAuthorsUnreport.forEach(author => unpublishedReport.appendChild(createTextElement(xmlDoc, "Co-Authors", author.trim())));
                unpublishedReport.appendChild(createTextElement(xmlDoc, "ReportTitle", document.getElementById("unreportTitle").value));
                unpublishedReport.appendChild(createTextElement(xmlDoc, "Year", document.getElementById("unreportYear").value));
                unpublishedReport.appendChild(createTextElement(xmlDoc, "URL", document.getElementById("unreportURL").value));
                } else if (selectedRecordType === "OtherBibliographic") {
                let otherBibliographic = xmlDoc.createElement("OtherBibliographic");
                completeDataRecord.appendChild(otherBibliographic);
                otherBibliographic.appendChild(createTextElement(xmlDoc, "Information", document.getElementById("otherBibInformation").value));
                }
            }
            // Populate Notes element
            dataSource.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesSourceContent").value));

            //////////////////////////
            //////////////////////////

            // Populate Mixture element
            let mixture = xmlDoc.createElement("Mixture");
  
            // Populate MixtureIdentifiers element
            let mixtureIdentifiers = xmlDoc.createElement("MixtureIdentifiers");
            mixture.appendChild(mixtureIdentifiers);
            mixtureIdentifiers.appendChild(createTextElement(xmlDoc, "MixtureID", document.getElementById("MixtureID").value));
            mixtureIdentifiers.appendChild(createTextElement(xmlDoc, "MixtureType", document.getElementById("MixtureType").value));
  
            // Populate MixtureRecipe element
            let mixturecomposition = xmlDoc.createElement("MixtureRecipe");
            mixture.appendChild(mixturecomposition);
            let composition = xmlDoc.createElement("Composition");
            mixturecomposition.appendChild(composition);
            composition.appendChild(createTextElement(xmlDoc, "CoarseAggregates", document.getElementById("CoarseAggregates").value));
            composition.appendChild(createTextElement(xmlDoc, "FineAggregates", document.getElementById("FineAggregates").value));
            composition.appendChild(createTextElement(xmlDoc, "AddedFiller", document.getElementById("AddedFiller").value));
            composition.appendChild(createTextElement(xmlDoc, "ReclaimedAsphalt", document.getElementById("ReclaimedAsphalt").value));
            composition.appendChild(createTextElement(xmlDoc, "Rejuvenator", document.getElementById("Rejuvenator").value));
            let bindercomposition = xmlDoc.createElement("Binder");
            composition.appendChild(bindercomposition);
            bindercomposition.appendChild(createTextElement(xmlDoc, "TargetBinderGrade", document.getElementById("TargetBinderGrade").value));
            bindercomposition.appendChild(createTextElement(xmlDoc, "BinderContent", document.getElementById("Binder").value));

            let grainsizedistributionMain = xmlDoc.createElement("GrainSizeDistribution");
            mixturecomposition.appendChild(grainsizedistributionMain);
            let virginagg = xmlDoc.createElement("VirginAggregates");
            grainsizedistributionMain.appendChild(virginagg);
            let sizeV = document.getElementById("SizeVirgin").value.split(";").map(v => v.trim()).filter(Boolean);
            let percentageV = document.getElementById("PercentageVirgin").value.split(";").map(v => v.trim()).filter(Boolean);
            if (sizeV.length !== percentageV.length) 
            { EntryError("Virgin Aggregates distribution mismatch: Size and Proportion values must have the same count.","field7-1");return false;}
            for (let i = 0; i < sizeV.length; i++) {
                let point = xmlDoc.createElement("Point");
                let sizeVvalue = sizeV[i];
                if (isNaN(parseFloat(sizeVvalue)) || parseFloat(sizeVvalue) < 0 || !/^\d+(\.\d+)?$/.test(sizeVvalue)) 
                { EntryError(`Invalid Size in Virgin Aggregates: ${sizeVvalue}`,"SizeVirgin");return false;}
                point.appendChild(createTextElement(xmlDoc, "Size", parseFloat(sizeVvalue)));
                let percentageVvalue = percentageV[i];
                if (isNaN(parseFloat(percentageVvalue)) || parseFloat(percentageVvalue) < 0 || parseFloat(percentageVvalue) > 100 || !/^\d+(\.\d+)?$/.test(percentageVvalue))
                { EntryError(`Invalid Proportion in Virgin Aggregates: ${percentageVvalue}`,"PercentageVirgin");return false;}
                point.appendChild(createTextElement(xmlDoc, "PercentageDistribution", parseFloat(percentageVvalue)));
                virginagg.appendChild(point);
            }
            let reclaimedagg = xmlDoc.createElement("ReclaimedAggregates");
            grainsizedistributionMain.appendChild(reclaimedagg);
            let sizeR = document.getElementById("SizeReclaimed").value.split(";").map(v => v.trim()).filter(Boolean);
            let percentageR = document.getElementById("PercentageReclaimed").value.split(";").map(v => v.trim()).filter(Boolean);
            if (sizeR.length !== percentageR.length) 
            { EntryError("Reclaimed Aggregates distribution mismatch: Size and Proportion values must have the same count.","field7-2");return false;}
            for (let i = 0; i < sizeR.length; i++) {
                let point = xmlDoc.createElement("Point");
                let sizeRvalue = sizeR[i];
                if (isNaN(parseFloat(sizeRvalue)) || parseFloat(sizeRvalue) < 0 || !/^\d+(\.\d+)?$/.test(sizeRvalue)) 
                { EntryError(`Invalid Size in Reclaimed Aggregates: ${sizeRvalue}`,"SizeReclaimed");return false;}
                point.appendChild(createTextElement(xmlDoc, "Size", parseFloat(sizeRvalue)));
                let percentageRvalue = percentageR[i];
                if (isNaN(parseFloat(percentageRvalue)) || parseFloat(percentageRvalue) < 0 || parseFloat(percentageRvalue) > 100 || !/^\d+(\.\d+)?$/.test(percentageRvalue))
                { EntryError(`Invalid Proportion in Reclaimed Aggregates: ${percentageRvalue}`,"PercentageReclaimed");return false;}
                point.appendChild(createTextElement(xmlDoc, "PercentageDistribution", parseFloat(percentageRvalue)));
                reclaimedagg.appendChild(point);
            }                       
            
            mixturecomposition.appendChild(createTextElement(xmlDoc, "MixtureMaximumDensity", document.getElementById("MaximumDensityValue").value));

            // Populate MixtureComponentProperties element
            let mixturecomponentsproperties = xmlDoc.createElement("MixtureComponentProperties");
            mixture.appendChild(mixturecomponentsproperties);
            
            // Populate VirginAggregates element
            let virginaggregates = xmlDoc.createElement("VirginAggregates");
            mixturecomponentsproperties.appendChild(virginaggregates);
            virginaggregates.appendChild(createTextElement(xmlDoc, "Nature", document.getElementById("NatureVA").value));
            virginaggregates.appendChild(createTextElement(xmlDoc, "LosAngelesTestResult", document.getElementById("LosAngelesTestResultVA").value));
            virginaggregates.appendChild(createTextElement(xmlDoc, "FlakinessIndex", document.getElementById("FlakinessIndexVA").value));
            virginaggregates.appendChild(createTextElement(xmlDoc, "ShapeIndex", document.getElementById("ShapeIndexVA").value));
            virginaggregates.appendChild(createTextElement(xmlDoc, "FlowCoefficient", document.getElementById("FlowCoefficientVA").value));
            virginaggregates.appendChild(createTextElement(xmlDoc, "NordicAbrasionValue", document.getElementById("NordicAbrasionValueVA").value));
            let roundedcrushed = xmlDoc.createElement("RoundedAndCrushed");
            virginaggregates.appendChild(roundedcrushed);
            roundedcrushed.appendChild(createTextElement(xmlDoc, "SemiCrushedParticles", document.getElementById("SemiCrushedParticlesVA").value));
            roundedcrushed.appendChild(createTextElement(xmlDoc, "TotallyCrushedParticles", document.getElementById("TotallyCrushedParticlesVA").value));
            roundedcrushed.appendChild(createTextElement(xmlDoc, "SemiRoundedParticles", document.getElementById("SemiRoundedParticlesVA").value));
            roundedcrushed.appendChild(createTextElement(xmlDoc, "TotallyRoundedParticles", document.getElementById("TotallyRoundedParticlesVA").value));
            virginaggregates.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegree", document.getElementById("BitumenCoverageDegreeVA").value));
            addAdditionalProperties('VA', xmlDoc, 'field9-2', virginaggregates);
            
            // Populate Filler element
            let filler = xmlDoc.createElement("Filler");
            mixturecomponentsproperties.appendChild(filler);
            filler.appendChild(createTextElement(xmlDoc, "Nature", document.getElementById("NatureFiller").value));
            filler.appendChild(createTextElement(xmlDoc, "StiffeningEffect", document.getElementById("StiffeningEffectFiller").value));
            filler.appendChild(createTextElement(xmlDoc, "ParticleDensity", document.getElementById("ParticleDensityFillerValue").value));
            filler.appendChild(createTextElement(xmlDoc, "WaterSusceptibility", document.getElementById("WaterSusceptibilityFiller").value));
            addAdditionalProperties('Filler', xmlDoc, 'field10-2', filler);
            
            // Populate VirginBinder element
            let virginbinder = xmlDoc.createElement("VirginBinder");
            mixturecomponentsproperties.appendChild(virginbinder);
            virginbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityVB").value));
            let BTSVVB = xmlDoc.createElement("BTSV");
            virginbinder.appendChild(BTSVVB);
            BTSVVB.appendChild(createTextElement(xmlDoc, "Temperature", document.getElementById("TemperatureVB").value));
            BTSVVB.appendChild(createTextElement(xmlDoc, "PhaseAngle", document.getElementById("PhaseAngleVB").value));
            addAdditionalProperties('BTSVVB', xmlDoc, 'field11-1-1', BTSVVB);
            let MSCRTVB = xmlDoc.createElement("MSCRT");
            virginbinder.appendChild(MSCRTVB);
            MSCRTVB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery100Pa", document.getElementById("AveragePercentRecovery100PaVB").value));
            MSCRTVB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery3200Pa", document.getElementById("AveragePercentRecovery3200PaVB").value));
            MSCRTVB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceVB").value));
            MSCRTVB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance100Pa", document.getElementById("NonrecoverableCreepCompliance100PaVB").value));
            MSCRTVB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance3200Pa", document.getElementById("NonrecoverableCreepCompliance3200PaVB").value));
            MSCRTVB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceVB").value));
            let NonstandardstrVB = xmlDoc.createElement("NonstandardStress");
            MSCRTVB.appendChild(NonstandardstrVB);
            NonstandardstrVB.appendChild(createTextElement(xmlDoc, "SpecifiedStress", document.getElementById("SpecifiedStressVB").value));
            NonstandardstrVB.appendChild(createTextElement(xmlDoc, "AveragePercentRecoverySpecifiedStress", document.getElementById("AveragePercentRecoverySpecifiedStressVB").value));
            NonstandardstrVB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceSpecifiedStressVB").value));
            NonstandardstrVB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStress", document.getElementById("NonrecoverableCreepComplianceSpecifiedStressVB").value));
            NonstandardstrVB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "FraassBreakingPoint", document.getElementById("FraassBreakingPointVB").value));
            let agingresistanceVB = xmlDoc.createElement("AgingResistance");
            virginbinder.appendChild(agingresistanceVB);
            agingresistanceVB.appendChild(createTextElement(xmlDoc, "MassChange", document.getElementById("MassChangeVB").value));
            agingresistanceVB.appendChild(createTextElement(xmlDoc, "RetainedPenetration", document.getElementById("PenetrationChangeVB").value));
            agingresistanceVB.appendChild(createTextElement(xmlDoc, "SofteningPointChange", document.getElementById("SofteningPointChangeVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyVB").value));
            virginbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityVB").value));
            addAdditionalProperties('VB', xmlDoc, 'field11-4', virginbinder);

            // Populate ReclaimedAsphalt element including ReclaimedAsphaltBinder child element
            let reclaimedasphalt = xmlDoc.createElement("ReclaimedAsphalt");
            mixturecomponentsproperties.appendChild(reclaimedasphalt);
            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "Nature", document.getElementById("NatureRA").value));
            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "LosAngelesTestResult", document.getElementById("LosAngelesTestResultRA").value));
            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "FlakinessIndex", document.getElementById("FlakinessIndexRA").value));
            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "ShapeIndex", document.getElementById("ShapeIndexRA").value));
            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "FlowCoefficient", document.getElementById("FlowCoefficientRA").value));
            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "NordicAbrasionValue", document.getElementById("NordicAbrasionValueRA").value));
            let roundedcrushedRA = xmlDoc.createElement("RoundedAndCrushed");
            reclaimedasphalt.appendChild(roundedcrushedRA);
            roundedcrushedRA.appendChild(createTextElement(xmlDoc, "SemiCrushedParticles", document.getElementById("SemiCrushedParticlesRA").value));
            roundedcrushedRA.appendChild(createTextElement(xmlDoc, "TotallyCrushedParticles", document.getElementById("TotallyCrushedParticlesRA").value));
            roundedcrushedRA.appendChild(createTextElement(xmlDoc, "SemiRoundedParticles", document.getElementById("SemiRoundedParticlesRA").value));
            roundedcrushedRA.appendChild(createTextElement(xmlDoc, "TotallyRoundedParticles", document.getElementById("TotallyRoundedParticlesRA").value));
            
            let reclaimedbinder = xmlDoc.createElement("ReclaimedAsphaltBinder");
            reclaimedasphalt.appendChild(reclaimedbinder);
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "PercentageContent", document.getElementById("PercentageContentRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityRB").value));
            let BTSVRB = xmlDoc.createElement("BTSV");
            reclaimedbinder.appendChild(BTSVRB);
            BTSVRB.appendChild(createTextElement(xmlDoc, "Temperature", document.getElementById("TemperatureRB").value));
            BTSVRB.appendChild(createTextElement(xmlDoc, "PhaseAngle", document.getElementById("PhaseAngleRB").value));
            addAdditionalProperties('BTSVRB', xmlDoc, 'field13-1-1', BTSVRB);
            let MSCRTRB = xmlDoc.createElement("MSCRT");
            reclaimedbinder.appendChild(MSCRTRB);
            MSCRTRB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery100Pa", document.getElementById("AveragePercentRecovery100PaRB").value));
            MSCRTRB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery3200Pa", document.getElementById("AveragePercentRecovery3200PaRB").value));
            MSCRTRB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceRB").value));
            MSCRTRB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance100Pa", document.getElementById("NonrecoverableCreepCompliance100PaRB").value));
            MSCRTRB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance3200Pa", document.getElementById("NonrecoverableCreepCompliance3200PaRB").value));
            MSCRTRB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceRB").value));
            let NonstandardstrRB = xmlDoc.createElement("NonstandardStress");
            MSCRTRB.appendChild(NonstandardstrRB);
            NonstandardstrRB.appendChild(createTextElement(xmlDoc, "SpecifiedStress", document.getElementById("SpecifiedStressRB").value));
            NonstandardstrRB.appendChild(createTextElement(xmlDoc, "AveragePercentRecoverySpecifiedStress", document.getElementById("AveragePercentRecoverySpecifiedStressRB").value));
            NonstandardstrRB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceSpecifiedStressRB").value));
            NonstandardstrRB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStress", document.getElementById("NonrecoverableCreepComplianceSpecifiedStressRB").value));
            NonstandardstrRB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "FraassBreakingPoint", document.getElementById("FraassBreakingPointRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyRB").value));
            reclaimedbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityRB").value));
            addAdditionalProperties('RB', xmlDoc, 'field13-3', reclaimedbinder);

            reclaimedasphalt.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegree", document.getElementById("BitumenCoverageDegreeRA").value));
            addAdditionalProperties('RA', xmlDoc, 'field12-2', reclaimedasphalt);

            // Populate Additive element
            addAdditionalAdditive("Addtv", xmlDoc, "field14", mixturecomponentsproperties)

            // Populate PreMixingBinderBlend element
            let premixingbinder = xmlDoc.createElement("PreMixingBinderBlend");
            mixturecomponentsproperties.appendChild(premixingbinder);
            premixingbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationPmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointPmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityPmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityPmB").value));
            let BTSVPmB = xmlDoc.createElement("BTSV");
            premixingbinder.appendChild(BTSVPmB);
            BTSVPmB.appendChild(createTextElement(xmlDoc, "Temperature", document.getElementById("TemperaturePmB").value));
            BTSVPmB.appendChild(createTextElement(xmlDoc, "PhaseAngle", document.getElementById("PhaseAnglePmB").value));
            addAdditionalProperties('BTSVPmB', xmlDoc, 'field15-1-1', BTSVPmB);
            let MSCRTPmB = xmlDoc.createElement("MSCRT");
            premixingbinder.appendChild(MSCRTPmB);
            MSCRTPmB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery100Pa", document.getElementById("AveragePercentRecovery100PaPmB").value));
            MSCRTPmB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery3200Pa", document.getElementById("AveragePercentRecovery3200PaPmB").value));
            MSCRTPmB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferencePmB").value));
            MSCRTPmB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance100Pa", document.getElementById("NonrecoverableCreepCompliance100PaPmB").value));
            MSCRTPmB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance3200Pa", document.getElementById("NonrecoverableCreepCompliance3200PaPmB").value));
            MSCRTPmB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferencePmB").value));
            let NonstandardstrPmB = xmlDoc.createElement("NonstandardStress");
            MSCRTPmB.appendChild(NonstandardstrPmB);
            NonstandardstrPmB.appendChild(createTextElement(xmlDoc, "SpecifiedStress", document.getElementById("SpecifiedStressPmB").value));
            NonstandardstrPmB.appendChild(createTextElement(xmlDoc, "AveragePercentRecoverySpecifiedStress", document.getElementById("AveragePercentRecoverySpecifiedStressPmB").value));
            NonstandardstrPmB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceSpecifiedStressPmB").value));
            NonstandardstrPmB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStress", document.getElementById("NonrecoverableCreepComplianceSpecifiedStressPmB").value));
            NonstandardstrPmB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressPmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "FraassBreakingPoint", document.getElementById("FraassBreakingPointPmB").value));
            let agingresistancePmB = xmlDoc.createElement("AgingResistance");
            premixingbinder.appendChild(agingresistancePmB);
            agingresistancePmB.appendChild(createTextElement(xmlDoc, "MassChange", document.getElementById("MassChangePmB").value));
            agingresistancePmB.appendChild(createTextElement(xmlDoc, "RetainedPenetration", document.getElementById("PenetrationChangePmB").value));
            agingresistancePmB.appendChild(createTextElement(xmlDoc, "SofteningPointChange", document.getElementById("SofteningPointChangePmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryPmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyPmB").value));
            premixingbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityPmB").value));
            addAdditionalProperties('PmB', xmlDoc, 'field15-4', premixingbinder);

            // Populate Mixing element
            let mixing = xmlDoc.createElement("Mixing");
            mixture.appendChild(mixing);
            mixing.appendChild(createTextElement(xmlDoc, "MixingStandard", document.getElementById("MixingStandard").value));
            let mixingmethod = xmlDoc.createElement("MixingMethod");
            mixing.appendChild(mixingmethod);
            mixingmethod.appendChild(createTextElement(xmlDoc, "Method", document.getElementById("MixingMethod").value));
            mixingmethod.appendChild(createTextElement(xmlDoc, "TypeofMixer", document.getElementById("TypeofMixer").value));
            mixing.appendChild(createTextElement(xmlDoc, "MixingSequence", document.getElementById("MixingSequence").value));
            mixing.appendChild(createTextElement(xmlDoc, "MixtureTemperature", document.getElementById("MixtureTemperature").value));
            mixing.appendChild(createTextElement(xmlDoc, "ReclaimedAsphaltTemperature", document.getElementById("ReclaimedAsphaltTemperature").value));
            let mixingduration = xmlDoc.createElement("MixingDuration");
            mixing.appendChild(mixingduration);
            mixingduration.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("MixingDurationValue").value));
            mixingduration.appendChild(createTextElement(xmlDoc, "Unit", document.getElementById("MixingDurationUnit").value));
            addmixingproperty( xmlDoc, 'field16-3', mixing);
    
            // Populate Aggregates element within RecoveredMaterials element
            let recoveredasphalt = xmlDoc.createElement("RecoveredMaterials");
            mixture.appendChild(recoveredasphalt);
            let recoveredaggregates = xmlDoc.createElement("Aggregates");
            recoveredasphalt.appendChild(recoveredaggregates);
            let recoveredaggregatesprop = xmlDoc.createElement("Properties");
            recoveredaggregates.appendChild(recoveredaggregatesprop);
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "Nature", document.getElementById("NatureCA").value));
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "LosAngelesTestResult", document.getElementById("LosAngelesTestResultCA").value));
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "FlakinessIndex", document.getElementById("FlakinessIndexCA").value));
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "ShapeIndex", document.getElementById("ShapeIndexCA").value));
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "FlowCoefficient", document.getElementById("FlowCoefficientCA").value));
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "NordicAbrasionValue", document.getElementById("NordicAbrasionValueCA").value));
            let roundedcrushedCA = xmlDoc.createElement("RoundedAndCrushed");
            recoveredaggregatesprop.appendChild(roundedcrushedCA);
            roundedcrushedCA.appendChild(createTextElement(xmlDoc, "SemiCrushedParticles", document.getElementById("SemiCrushedParticlesCA").value));
            roundedcrushedCA.appendChild(createTextElement(xmlDoc, "TotallyCrushedParticles", document.getElementById("TotallyCrushedParticlesCA").value));
            roundedcrushedCA.appendChild(createTextElement(xmlDoc, "SemiRoundedParticles", document.getElementById("SemiRoundedParticlesCA").value));
            roundedcrushedCA.appendChild(createTextElement(xmlDoc, "TotallyRoundedParticles", document.getElementById("TotallyRoundedParticlesCA").value));
            recoveredaggregatesprop.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegree", document.getElementById("BitumenCoverageDegreeCA").value));
            addAdditionalProperties('CA', xmlDoc, 'field17-2', recoveredaggregatesprop);
            
            let recoveredaggregatesGZD = xmlDoc.createElement("GrainSizeDistribution");
            recoveredaggregates.appendChild(recoveredaggregatesGZD);
            let sizeCA = document.getElementById("SizeCA").value.split(";").map(v => v.trim()).filter(Boolean);
            let percentageCA = document.getElementById("PercentageCA").value.split(";").map(v => v.trim()).filter(Boolean);

            if (sizeCA.length !== percentageCA.length) 
            { EntryError("Recovered Aggregates distribution mismatch: Size and Proportion values must have the same count.","field17-3");return false;}
            for (let i = 0; i < sizeCA.length; i++) {
                let point = xmlDoc.createElement("Point");
                let sizeCAvalue = sizeCA[i];
                if (isNaN(parseFloat(sizeCAvalue)) || parseFloat(sizeCAvalue) < 0 || !/^\d+(\.\d+)?$/.test(sizeCAvalue)) 
                { EntryError(`Invalid Size in Recovered Aggregates: ${sizeCAvalue}`,"SizeCA");return false;}
                point.appendChild(createTextElement(xmlDoc, "Size", parseFloat(sizeCAvalue)));
                let percentageCAvalue = percentageCA[i];
                if (isNaN(parseFloat(percentageCAvalue)) || parseFloat(percentageCAvalue) < 0 || parseFloat(percentageCAvalue) > 100 || !/^\d+(\.\d+)?$/.test(percentageCAvalue))
                { EntryError(`Invalid Proportion in Recovered Aggregates: ${percentageCAvalue}`,"PercentageCA");return false;}
                point.appendChild(createTextElement(xmlDoc, "PercentageDistribution", parseFloat(percentageCAvalue)));
                recoveredaggregatesGZD.appendChild(point);
            }    

            // Populate Binder element within RecoveredMaterials element
            let recoveredbinder = xmlDoc.createElement("Binder");
            recoveredasphalt.appendChild(recoveredbinder);
            recoveredbinder.appendChild(createTextElement(xmlDoc, "PercentageContent", document.getElementById("PercentageContentCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityCB").value));
            let BTSVCB = xmlDoc.createElement("BTSV");
            recoveredbinder.appendChild(BTSVCB);
            BTSVCB.appendChild(createTextElement(xmlDoc, "Temperature", document.getElementById("TemperatureCB").value));
            BTSVCB.appendChild(createTextElement(xmlDoc, "PhaseAngle", document.getElementById("PhaseAngleCB").value));
            addAdditionalProperties('BTSVCB', xmlDoc, 'field18-1-1', BTSVCB);
            let MSCRTCB = xmlDoc.createElement("MSCRT");
            recoveredbinder.appendChild(MSCRTCB);
            MSCRTCB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery100Pa", document.getElementById("AveragePercentRecovery100PaCB").value));
            MSCRTCB.appendChild(createTextElement(xmlDoc, "AveragePercentRecovery3200Pa", document.getElementById("AveragePercentRecovery3200PaCB").value));
            MSCRTCB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceCB").value));
            MSCRTCB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance100Pa", document.getElementById("NonrecoverableCreepCompliance100PaCB").value));
            MSCRTCB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliance3200Pa", document.getElementById("NonrecoverableCreepCompliance3200PaCB").value));
            MSCRTCB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceCB").value));
            let NonstandardstrCB = xmlDoc.createElement("NonstandardStress");
            MSCRTCB.appendChild(NonstandardstrCB);
            NonstandardstrCB.appendChild(createTextElement(xmlDoc, "SpecifiedStress", document.getElementById("SpecifiedStressCB").value));
            NonstandardstrCB.appendChild(createTextElement(xmlDoc, "AveragePercentRecoverySpecifiedStress", document.getElementById("AveragePercentRecoverySpecifiedStressCB").value));
            NonstandardstrCB.appendChild(createTextElement(xmlDoc, "RecoveryPercentageDifference", document.getElementById("RecoveryPercentageDifferenceSpecifiedStressCB").value));
            NonstandardstrCB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStress", document.getElementById("NonrecoverableCreepComplianceSpecifiedStressCB").value));
            NonstandardstrCB.appendChild(createTextElement(xmlDoc, "NonrecoverableCreepCompliancePercentageDifference", document.getElementById("NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "FraassBreakingPoint", document.getElementById("FraassBreakingPointCB").value));
            let agingresistanceCB = xmlDoc.createElement("AgingResistance");
            recoveredbinder.appendChild(agingresistanceCB);
            agingresistanceCB.appendChild(createTextElement(xmlDoc, "MassChange", document.getElementById("MassChangeCB").value));
            agingresistanceCB.appendChild(createTextElement(xmlDoc, "RetainedPenetration", document.getElementById("PenetrationChangeCB").value));
            agingresistanceCB.appendChild(createTextElement(xmlDoc, "SofteningPointChange", document.getElementById("SofteningPointChangeCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyCB").value));
            recoveredbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityCB").value));
            addAdditionalProperties('CB', xmlDoc, 'field18-4', recoveredbinder);

            // Populate Notes element
            mixture.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesMixtureContent").value));

            //////////////////////////
            //////////////////////////

            // Populate RuttingTestResults element
            let testresults = xmlDoc.createElement("RuttingTestResults");

            // Populate SampleProperties element
            let sampleprop = xmlDoc.createElement("SampleProperties");
            testresults.appendChild(sampleprop);
            let sampledim = xmlDoc.createElement("SampleDimensions");
            sampleprop.appendChild(sampledim);
            sampledim.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("Length").value));
            sampledim.appendChild(createTextElement(xmlDoc, "Width", document.getElementById("Width").value));
            sampledim.appendChild(createTextElement(xmlDoc, "NominalThickness", document.getElementById("NominalThickness").value)); 
            
            let sampleprep = xmlDoc.createElement("SamplePreparation");
            sampleprop.appendChild(sampleprep);
            let  selectionSampling = document.getElementById("Sampling").value;
                if (selectionSampling === "PavementCoring") {
                    let pavcor = xmlDoc.createElement("PavementCoring");
                    sampleprep.appendChild(pavcor);
                    pavcor.appendChild(createTextElement(xmlDoc, "Type", "Pavement Coring"));
                    let coring = xmlDoc.createElement("Coring");
                    pavcor.appendChild(coring);
                    coring.appendChild(createTextElement(xmlDoc, "PavingDate", document.getElementById("PavingDate").value));
                    coring.appendChild(createTextElement(xmlDoc, "CoringDate", document.getElementById("CoringDate").value));
                    coring.appendChild(createTextElement(xmlDoc, "CoringLocation", document.getElementById("CoringLocation").value));
                } else if (selectionSampling === "LooseMixture" ) {
                    let losmix = xmlDoc.createElement("LooseMixture");
                    sampleprep.appendChild(losmix);
                    losmix.appendChild(createTextElement(xmlDoc, "Type", "Loose Mixture"));
                    let compaction = xmlDoc.createElement("Compaction");
                    losmix.appendChild(compaction);
                    compaction.appendChild(createTextElement(xmlDoc, "CompactionDate", document.getElementById("CompactionDate").value));
                    compaction.appendChild(createTextElement(xmlDoc, "RollerType", document.getElementById("RollerType").value));
                    compaction.appendChild(createTextElement(xmlDoc, "CompactionTarget", document.getElementById("CompactionTarget").value));
                    compaction.appendChild(createTextElement(xmlDoc, "CompactionTemperature", document.getElementById("CompactionTemperature").value));
                }

            let sampleage = xmlDoc.createElement("SampleAge");
            sampleprop.appendChild(sampleage);
            sampleage.appendChild(createTextElement(xmlDoc, "LooseSample", document.getElementById("LooseSample").value));
            sampleage.appendChild(createTextElement(xmlDoc, "CompactedSample", document.getElementById("CompactedSample").value));
            sampleprop.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditions").value));

            // Populate Results element
            let ruttingresults = xmlDoc.createElement("Results");
            testresults.appendChild(ruttingresults);
            ruttingresults.appendChild(createTextElement(xmlDoc, "TestTemperature", document.getElementById("TestTemperature").value));
            let procedure = xmlDoc.createElement("Procedure");
            ruttingresults.appendChild(procedure);

            let selectedMethod = document.getElementById("ResultsSelection").value;
            if (selectedMethod === "LargeOrExtraLargeDevices") {
                let largedev = xmlDoc.createElement("LargeOrExtraLargeDevices");
                procedure.appendChild(largedev);
                let Meanlargedev = xmlDoc.createElement("Mean");
                largedev.appendChild(Meanlargedev);
                Meanlargedev.appendChild(createTextElement(xmlDoc, "CyclesNumber", document.getElementById("CyclesNumberL").value));
                Meanlargedev.appendChild(createTextElement(xmlDoc, "MeanProportionalRutDepth", document.getElementById("MeanProportionalRutDepthL").value));
                let bulkdensityL = xmlDoc.createElement("BulkDensity");
                Meanlargedev.appendChild(bulkdensityL);
                bulkdensityL.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueL").value));
                bulkdensityL.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodL").value));
                let voidspercL = xmlDoc.createElement("Voids");
                Meanlargedev.appendChild(voidspercL);
                voidspercL.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsL").value));
                voidspercL.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsL").value));
                voidspercL.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenL").value));
                let graphL = xmlDoc.createElement("ProportionalRutDepthVersusCyclesGraph");
                Meanlargedev.appendChild(graphL);
                let cycleL = document.getElementById("CycleLg").value.split(";").map(v => v.trim()).filter(Boolean);
                let propL = document.getElementById("ProportionalRutDepthLg").value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleL.length !== propL.length) 
                { EntryError('"Large or Extra-large Devices - Mean Results" graph mismatch: Proportional Rut Depths and Cycles values must have the same count.',"field21-1-3");return false;}
                for (let i = 0; i < cycleL.length; i++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleLvalue = cycleL[i];
                    if (isNaN(parseFloat(cycleLvalue)) || parseInt(cycleLvalue) < 0 || !/^\d+$/.test(cycleLvalue)) 
                    { EntryError(`Invalid Cycle in the "Large or Extra-large Devices - Mean Results" graph: ${cycleLvalue}`,"CycleLg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleLvalue)));
                    let propLvalue = propL[i];
                    if (isNaN(parseFloat(propLvalue)) || parseFloat(propLvalue) < 0 || parseFloat(propLvalue) > 100 || !/^\d+(\.\d+)?$/.test(propLvalue))
                    { EntryError(`Invalid Proportional Rut Depth in the "Large or Extra-large Devices - Mean Results" graph: ${propLvalue}`,"ProportionalRutDepthLg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "ProportionalRutDepth", parseFloat(propLvalue)));
                    graphL.appendChild(point);
                }
                if (!addReplicationsL(xmlDoc, "field21-1-S", largedev)) {return false;}

            } else if (selectedMethod === "SmallSizeDeviceMethod_A_Air") {
                let smalldevAair = xmlDoc.createElement("SmallSizeDeviceMethod_A_Air");
                procedure.appendChild(smalldevAair);
                let MeansmalldevAair = xmlDoc.createElement("Mean");
                smalldevAair.appendChild(MeansmalldevAair);
                MeansmalldevAair.appendChild(createTextElement(xmlDoc, "MeanWheelTrackingRate", document.getElementById("MeanWheelTrackingRateSA").value));
                MeansmalldevAair.appendChild(createTextElement(xmlDoc, "CyclesNumber", document.getElementById("CyclesNumberSA").value));
                MeansmalldevAair.appendChild(createTextElement(xmlDoc, "MeanRutDepth", document.getElementById("MeanRutDepthSA").value));
                let bulkdensitySA = xmlDoc.createElement("BulkDensity");
                MeansmalldevAair.appendChild(bulkdensitySA);
                bulkdensitySA.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueSA").value));
                bulkdensitySA.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodSA").value));
                let voidspercSA = xmlDoc.createElement("Voids");
                MeansmalldevAair.appendChild(voidspercSA);
                voidspercSA.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsSA").value));
                voidspercSA.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsSA").value));
                voidspercSA.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenSA").value)); 
                let graphSA = xmlDoc.createElement("RutDepthVersusCyclesGraph");
                MeansmalldevAair.appendChild(graphSA);
                let cycleSA = document.getElementById("CycleSAg").value.split(";").map(v => v.trim()).filter(Boolean);
                let rutgraphSA = document.getElementById("RutDepthSAg").value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleSA.length !== rutgraphSA.length) 
                { EntryError('"Small Size Device Method A in Air - Mean Results" graph mismatch: Rut Depths and Cycles values must have the same count.',"field21-2-3");return false;}
                for (let i = 0; i < cycleSA.length; i++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleSAvalue = cycleSA[i];
                    if (isNaN(parseFloat(cycleSAvalue)) || parseInt(cycleSAvalue) < 0 || !/^\d+$/.test(cycleSAvalue)) 
                    { EntryError(`Invalid Cycle in the "Small Size Device Method A in Air - Mean Results" graph: ${cycleSAvalue}`,"CycleSAg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleSAvalue)));
                    let rutgraphSAvalue = rutgraphSA[i];
                    if (isNaN(parseFloat(rutgraphSAvalue)) || parseFloat(rutgraphSAvalue) < 0 || !/^\d+(\.\d+)?$/.test(rutgraphSAvalue))
                    { EntryError(`Invalid Rut Depth in the "Small Size Device Method A in Air - Mean Results" graph: ${rutgraphSAvalue}`,"RutDepthSAg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "RutDepth", parseFloat(rutgraphSAvalue)));
                    graphSA.appendChild(point);
                }
                if (!addReplicationsSA(xmlDoc, "field21-2-S", smalldevAair)) {return false;}

            } else if (selectedMethod === "SmallSizeDeviceMethod_B_Air") {
                let smalldevBair = xmlDoc.createElement("SmallSizeDeviceMethod_B_Air");
                procedure.appendChild(smalldevBair);
                let MeansmalldevBair = xmlDoc.createElement("Mean");
                smalldevBair.appendChild(MeansmalldevBair);
                MeansmalldevBair.appendChild(createTextElement(xmlDoc, "MeanWheelTrackingSlope", document.getElementById("MeanWheelTrackingSlopeSBA").value));
                MeansmalldevBair.appendChild(createTextElement(xmlDoc, "CyclesNumber", document.getElementById("CyclesNumberSBA").value));
                MeansmalldevBair.appendChild(createTextElement(xmlDoc, "MeanProportionalRutDepth", document.getElementById("MeanProportionalRutDepthSBA").value));
                MeansmalldevBair.appendChild(createTextElement(xmlDoc, "MeanRutDepth", document.getElementById("MeanRutDepthSBA").value));  
                let bulkdensitySBA = xmlDoc.createElement("BulkDensity");
                MeansmalldevBair.appendChild(bulkdensitySBA);
                bulkdensitySBA.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueSBA").value));
                bulkdensitySBA.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodSBA").value));
                let voidspercSBA = xmlDoc.createElement("Voids");
                MeansmalldevBair.appendChild(voidspercSBA);
                voidspercSBA.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsSBA").value));
                voidspercSBA.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsSBA").value));
                voidspercSBA.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenSBA").value));   
                let graphSBA = xmlDoc.createElement("RutDepthVersusCyclesGraph");
                MeansmalldevBair.appendChild(graphSBA);
                let cycleSBA = document.getElementById("CycleSBAg").value.split(";").map(v => v.trim()).filter(Boolean);
                let rutgraphSBA = document.getElementById("RutDepthSBAg").value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleSBA.length !== rutgraphSBA.length) 
                { EntryError('"Small Size Device Method B in Air - Mean Results" graph mismatch: Rut Depths and Cycles values must have the same count.',"field21-3-3");return false;}
                for (let i = 0; i < cycleSBA.length; i++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleSBAvalue = cycleSBA[i];
                    if (isNaN(parseFloat(cycleSBAvalue)) || parseInt(cycleSBAvalue) < 0 || !/^\d+$/.test(cycleSBAvalue)) 
                    { EntryError(`Invalid Cycle in the "Small Size Device Method B in Air - Mean Results" graph: ${cycleSBAvalue}`,"CycleSBAg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleSBAvalue)));
                    let rutgraphSBAvalue = rutgraphSBA[i];
                    if (isNaN(parseFloat(rutgraphSBAvalue)) || parseFloat(rutgraphSBAvalue) < 0 || !/^\d+(\.\d+)?$/.test(rutgraphSBAvalue))
                    { EntryError(`Invalid Rut Depth in the "Small Size Device Method B in Air - Mean Results" graph: ${rutgraphSBAvalue}`,"RutDepthSBAg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "RutDepth", parseFloat(rutgraphSBAvalue)));
                    graphSBA.appendChild(point);
                }
                if (!addReplicationsSB(xmlDoc, "SBA", "field21-3-S", smalldevBair)) {return false;}

            } else if (selectedMethod === "SmallSizeDeviceMethod_B_Water") {
                let smalldevBwater = xmlDoc.createElement("SmallSizeDeviceMethod_B_Water");
                procedure.appendChild(smalldevBwater);
                let MeansmalldevBwater = xmlDoc.createElement("Mean");
                smalldevBwater.appendChild(MeansmalldevBwater);
                MeansmalldevBwater.appendChild(createTextElement(xmlDoc, "MeanWheelTrackingSlope", document.getElementById("MeanWheelTrackingSlopeSBW").value));
                MeansmalldevBwater.appendChild(createTextElement(xmlDoc, "CyclesNumber", document.getElementById("CyclesNumberSBW").value));
                MeansmalldevBwater.appendChild(createTextElement(xmlDoc, "MeanProportionalRutDepth", document.getElementById("MeanProportionalRutDepthSBW").value));
                MeansmalldevBwater.appendChild(createTextElement(xmlDoc, "MeanRutDepth", document.getElementById("MeanRutDepthSBW").value));  
                let bulkdensitySBW = xmlDoc.createElement("BulkDensity");
                MeansmalldevBwater.appendChild(bulkdensitySBW);
                bulkdensitySBW.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueSBW").value));
                bulkdensitySBW.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodSBW").value));
                let voidspercSBW = xmlDoc.createElement("Voids");
                MeansmalldevBwater.appendChild(voidspercSBW);
                voidspercSBW.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsSBW").value));
                voidspercSBW.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsSBW").value));
                voidspercSBW.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenSBW").value));   
                let graphSBW = xmlDoc.createElement("RutDepthVersusCyclesGraph");
                MeansmalldevBwater.appendChild(graphSBW);
                let cycleSBW = document.getElementById("CycleSBWg").value.split(";").map(v => v.trim()).filter(Boolean);
                let rutgraphSBW = document.getElementById("RutDepthSBWg").value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleSBW.length !== rutgraphSBW.length) 
                { EntryError('"Small Size Device Method B in Water - Mean Results" graph mismatch: Rut Depths and Cycles values must have the same count.',"field21-4-3");return false;}
                for (let i = 0; i < cycleSBW.length; i++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleSBWvalue = cycleSBW[i];
                    if (isNaN(parseFloat(cycleSBWvalue)) || parseInt(cycleSBWvalue) < 0 || !/^\d+$/.test(cycleSBWvalue)) 
                    { EntryError(`Invalid Cycle in the "Small Size Device Method B in Water - Mean Results" graph: ${cycleSBWvalue}`,"CycleSBWg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleSBWvalue)));
                    let rutgraphSBWvalue = rutgraphSBW[i];
                    if (isNaN(parseFloat(rutgraphSBWvalue)) || parseFloat(rutgraphSBWvalue) < 0 || !/^\d+(\.\d+)?$/.test(rutgraphSBWvalue))
                    { EntryError(`Invalid Rut Depth in the "Small Size Device Method B in Water - Mean Results" graph: ${rutgraphSBWvalue}`,"RutDepthSBWg");return false;}
                    point.appendChild(createTextElement(xmlDoc, "RutDepth", parseFloat(rutgraphSBWvalue)));
                    graphSBW.appendChild(point);
                }
                if (!addReplicationsSB(xmlDoc, "SBW", "field21-4-S", smalldevBwater)) {return false;}
            }

            // Populate Notes element
            testresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContent").value));

            //////////////////////////
            //////////////////////////

             // Populate Notes element
             let notes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)

            //////////////////////////
            ////////////////////////// 

            // Append Main nodes to the root element
            xmlDoc.documentElement.appendChild(dataSource);
            xmlDoc.documentElement.appendChild(mixture);
            xmlDoc.documentElement.appendChild(testresults);
            xmlDoc.documentElement.appendChild(notes);

            //  Process the XML data and remove empty elements
            let xmlString = new XMLSerializer().serializeToString(xmlDoc);
            //console.log(xmlString); 
            let parser = new DOMParser();
            let XmlDocument = parser.parseFromString(xmlString, 'application/xml');
            removeEmptyElements(XmlDocument.documentElement); 
            let FinalXmlString = new XMLSerializer().serializeToString(XmlDocument); // Serialize the final XML document back to string
            console.log(FinalXmlString);

            // Download as XML file
            let blob = new Blob([FinalXmlString], { type: "text/xml" });
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "data.xml";
            link.click();
        
            return false; // Prevent default form submission
        }

        // Helper function to create text elements
        function createTextElement(xmlDoc, elementName, textContent) {
            let element = xmlDoc.createElement(elementName);
            let textNode = xmlDoc.createTextNode(textContent);
            element.appendChild(textNode);
            return element;
        }

        // Helper fucntion to add AdditionalProperties
        function addAdditionalProperties(type, xmlDoc, containerId, parentElement) {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id '${containerId}' not found.`);
                return; }
            for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
                let additionalproperties = xmlDoc.createElement('AdditionalProperties');
                additionalproperties.appendChild(createTextElement(xmlDoc, 'TestMethod', document.getElementById(`TestMethod${type}_${i}`).value));
                additionalproperties.appendChild(createTextElement(xmlDoc, 'Value', document.getElementById(`Value${type}_${i}`).value));
                additionalproperties.appendChild(createTextElement(xmlDoc, 'Unit', document.getElementById(`Unit${type}_${i}`).value));
                parentElement.appendChild(additionalproperties);
            }
        }

        // Helper fucntion to add Additional Additives
        function addAdditionalAdditive(type, xmlDoc, containerId, parentElement) {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id '${containerId}' not found.`);
                return; }
            for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
                let additionaladd = xmlDoc.createElement('Additive');
                additionaladd.appendChild(createTextElement(xmlDoc, 'Type', document.getElementById(`Type${type}_${i}`).value));
                additionaladd.appendChild(createTextElement(xmlDoc, 'PercentageMass', document.getElementById(`PercentageMass${type}_${i}`).value));
                addAdditionalProperties(`Addtv_${i}`, xmlDoc, `field14-${i}`, additionaladd);
                parentElement.appendChild(additionaladd);
            }
        }

        // Helper fucntion to add OtherMixingProperty
        function addmixingproperty(xmlDoc, containerId, parentElement) {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id '${containerId}' not found.`);
                return; }
            for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
                let additionalproperties = xmlDoc.createElement('OtherMixingProperty');
                additionalproperties.appendChild(createTextElement(xmlDoc, 'Name', document.getElementById(`OtherMixingPropertyName_${i}`).value));
                additionalproperties.appendChild(createTextElement(xmlDoc, 'Value', document.getElementById(`OtherMixingPropertyValue_${i}`).value));
                additionalproperties.appendChild(createTextElement(xmlDoc, 'Unit', document.getElementById(`OtherMixingPropertyUnit_${i}`).value));
                parentElement.appendChild(additionalproperties);
            }
        }

        // Helper fucntion to add Replications for the Large Case
        function addReplicationsL( xmlDoc, containerId, parentElement) {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id '${containerId}' not found.`);
                return; }
            for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
                let Replargedev = xmlDoc.createElement("Replication");
                parentElement.appendChild(Replargedev);
                Replargedev.appendChild(createTextElement(xmlDoc, "CyclesNumber", document.getElementById(`CyclesNumberL${i}`).value));
                Replargedev.appendChild(createTextElement(xmlDoc, "ProportionalRutDepth", document.getElementById(`ProportionalRutDepthL${i}`).value));
                
                let bulkdensityL = xmlDoc.createElement("BulkDensity");
                Replargedev.appendChild(bulkdensityL);
                bulkdensityL.appendChild(createTextElement(xmlDoc, "Value", document.getElementById(`BulkDensityValueL${i}`).value));
                bulkdensityL.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById(`BulkDensityMethodL${i}`).value));
                let voidspercL = xmlDoc.createElement("Voids");
                Replargedev.appendChild(voidspercL);
                voidspercL.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById(`AirVoidsL${i}`).value));
                voidspercL.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById(`MineralAggregateVoidsL${i}`).value));
                voidspercL.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById(`VoidsFilledWithBitumenL${i}`).value));

                let graphL = xmlDoc.createElement("ProportionalRutDepthVersusCyclesGraph");
                Replargedev.appendChild(graphL);
                let cycleL = document.getElementById(`CycleLg${i}`).value.split(";").map(v => v.trim()).filter(Boolean);
                let propL = document.getElementById(`ProportionalRutDepthLg${i}`).value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleL.length !== propL.length) 
                { EntryError('"Large or Extra-large Devices - Replications Results" graph mismatch: Proportional Rut Depths and Cycles values must have the same count.',`field21-1-3-${i}`);return false;}
                for (let j = 0; j < cycleL.length; j++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleLvalue = cycleL[j];
                    if (isNaN(parseFloat(cycleLvalue)) || parseInt(cycleLvalue) < 0 || !/^\d+$/.test(cycleLvalue)) 
                    { EntryError(`Invalid Cycle in the "Large or Extra-large Devices - Replications Results" graph: ${cycleLvalue}`,`CycleLg${i}`);return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleLvalue)));
                    let propLvalue = propL[j];
                    if (isNaN(parseFloat(propLvalue)) || parseFloat(propLvalue) < 0 || parseFloat(propLvalue) > 100 || !/^\d+(\.\d+)?$/.test(propLvalue))
                    { EntryError(`Invalid Proportional Rut Depth in the "Large or Extra-large Devices - Replications Results" graph: ${propLvalue}`,`ProportionalRutDepthLg${i}`);return false;}
                    point.appendChild(createTextElement(xmlDoc, "ProportionalRutDepth", parseFloat(propLvalue)));
                    graphL.appendChild(point);
                }
            }
            return true;
        }

        // Helper fucntion to add Replications for the Small Method A in Air Case
        function addReplicationsSA( xmlDoc, containerId, parentElement) {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id '${containerId}' not found.`);
                return; }
            for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
                let RepsmalldevAair = xmlDoc.createElement("Replication");
                parentElement.appendChild(RepsmalldevAair);
                RepsmalldevAair.appendChild(createTextElement(xmlDoc, "WheelTrackingRate", document.getElementById(`WheelTrackingRateSA${i}`).value));
                let rutSA = xmlDoc.createElement("Depth");
                RepsmalldevAair.appendChild(rutSA);
                let  selectionSA = document.getElementById(`RutDepthSA${i}`).value;
                if (selectionSA === "ReachedSA") {
                    let cyclesatleast1000 = xmlDoc.createElement("CyclesAtLeast1000");
                    rutSA.appendChild(cyclesatleast1000);
                    cyclesatleast1000.appendChild(createTextElement(xmlDoc, "RutDepth", document.getElementById(`Cycles1000SA${i}`).value));
                } else if (selectionSA === "UnreachedSA") {
                    let cycleslessthan1000 = xmlDoc.createElement("CyclesLessThan1000");
                    rutSA.appendChild(cycleslessthan1000);
                    cycleslessthan1000.appendChild(createTextElement(xmlDoc, "CyclesAt15mmRut", document.getElementById(`RutDepth15mmSA${i}`).value));
                }
                let bulkdensitySA = xmlDoc.createElement("BulkDensity");
                RepsmalldevAair.appendChild(bulkdensitySA);
                bulkdensitySA.appendChild(createTextElement(xmlDoc, "Value", document.getElementById(`BulkDensityValueSA${i}`).value));
                bulkdensitySA.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById(`BulkDensityMethodSA${i}`).value));
                let voidspercSA = xmlDoc.createElement("Voids");
                RepsmalldevAair.appendChild(voidspercSA);
                voidspercSA.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById(`AirVoidsSA${i}`).value));
                voidspercSA.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById(`MineralAggregateVoidsSA${i}`).value));
                voidspercSA.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById(`VoidsFilledWithBitumenSA${i}`).value));
                let graphSA = xmlDoc.createElement("RutDepthVersusCyclesGraph");
                RepsmalldevAair.appendChild(graphSA);
                let cycleSA = document.getElementById(`CycleSAg${i}`).value.split(";").map(v => v.trim()).filter(Boolean);
                let rutgraphSA = document.getElementById(`RutDepthSAg${i}`).value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleSA.length !== rutgraphSA.length) 
                { EntryError('"Small Size Device Method A in Air - Replications Results" graph mismatch: Rut Depths and Cycles values must have the same count.',`field21-2-3-${i}`);return false;}
                for (let j = 0; j < cycleSA.length; j++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleSAvalue = cycleSA[j];
                    if (isNaN(parseFloat(cycleSAvalue)) || parseInt(cycleSAvalue) < 0 || !/^\d+$/.test(cycleSAvalue)) 
                    { EntryError(`Invalid Cycle in the "Small Size Device Method A in Air - Replications Results" graph: ${cycleSAvalue}`,`CycleSAg${i}`);return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleSAvalue)));
                    let rutgraphSAvalue = rutgraphSA[j];
                    if (isNaN(parseFloat(rutgraphSAvalue)) || parseFloat(rutgraphSAvalue) < 0 || !/^\d+(\.\d+)?$/.test(rutgraphSAvalue))
                    { EntryError(`Invalid Rut Depth in the "Small Size Device Method A in Air - Replications Results" graph: ${rutgraphSAvalue}`,`RutDepthSAg${i}`);return false;}
                    point.appendChild(createTextElement(xmlDoc, "RutDepth", parseFloat(rutgraphSAvalue)));
                    graphSA.appendChild(point);
                }
            }
            return true;
        }

        // Helper fucntion to add Replications for the Small Method B in Air and Water Cases
        function addReplicationsSB( xmlDoc, type, containerId, parentElement) {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id '${containerId}' not found.`);
                return; }
            for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
                let RepsmalldevB = xmlDoc.createElement("Replication");
                parentElement.appendChild(RepsmalldevB);
                RepsmalldevB.appendChild(createTextElement(xmlDoc, "WheelTrackingSlope", document.getElementById(`WheelTrackingSlope${type}${i}`).value));
                let depthsSB = xmlDoc.createElement("Depths");
                RepsmalldevB.appendChild(depthsSB);
                let  selectionSB = document.getElementById(`ProportionalAndRutDepth${type}${i}`).value;
                if (selectionSB === `Reached${type}`) {
                    let cyclesatleast10000 = xmlDoc.createElement("CyclesAtLeast10000");
                    depthsSB.appendChild(cyclesatleast10000);
                    cyclesatleast10000.appendChild(createTextElement(xmlDoc, "FinalCyclesNumber", document.getElementById(`Cycles10000ValueCyclesNumber${type}${i}`).value));
                    cyclesatleast10000.appendChild(createTextElement(xmlDoc, "ProportionalRutDepth", document.getElementById(`Cycles10000Value${type}prop${i}`).value));
                    cyclesatleast10000.appendChild(createTextElement(xmlDoc, "RutDepth", document.getElementById(`Cycles10000Value${type}${i}`).value));
                } else if (selectionSB === `Unreached${type}`) {
                    let cycleslessthan10000 = xmlDoc.createElement("CyclesLessThan10000");
                    depthsSB.appendChild(cycleslessthan10000);
                    cycleslessthan10000.appendChild(createTextElement(xmlDoc, "FinalCyclesNumber", document.getElementById(`CyclesNumber${type}${i}`).value));
                    cycleslessthan10000.appendChild(createTextElement(xmlDoc, "ProportionalRutDepth", document.getElementById(`Value${type}prop${i}`).value));
                    cycleslessthan10000.appendChild(createTextElement(xmlDoc, "RutDepth", document.getElementById(`Value${type}${i}`).value));
                }
                let bulkdensitySB = xmlDoc.createElement("BulkDensity");
                RepsmalldevB.appendChild(bulkdensitySB);
                bulkdensitySB.appendChild(createTextElement(xmlDoc, "Value", document.getElementById(`BulkDensityValue${type}${i}`).value));
                bulkdensitySB.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById(`BulkDensityMethod${type}${i}`).value));
                let voidspercSB = xmlDoc.createElement("Voids");
                RepsmalldevB.appendChild(voidspercSB);
                voidspercSB.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById(`AirVoids${type}${i}`).value));
                voidspercSB.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById(`MineralAggregateVoids${type}${i}`).value));
                voidspercSB.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById(`VoidsFilledWithBitumen${type}${i}`).value));
                let name = type === "SBA" ? "Air" : type === "SBW" ? "Water" : "Error";
                let nmbr = type === "SBA" ? "3" : type === "SBW" ? "4" : "Error";
                let graphSB = xmlDoc.createElement("RutDepthVersusCyclesGraph");
                RepsmalldevB.appendChild(graphSB);
                let cycleSB = document.getElementById(`Cycle${type}g${i}`).value.split(";").map(v => v.trim()).filter(Boolean);
                let rutgraphSB = document.getElementById(`RutDepth${type}g${i}`).value.split(";").map(v => v.trim()).filter(Boolean);
                if (cycleSB.length !== rutgraphSB.length) 
                { EntryError(`"Small Size Device Method B in ${name} - Replications Results" graph mismatch: Rut Depths and Cycles values must have the same count.`,`field21-${nmbr}-3-${i}`);return false;}
                for (let j = 0; j < cycleSB.length; j++) {
                    let point = xmlDoc.createElement("Point");
                    let cycleSBvalue = cycleSB[j];
                    if (isNaN(parseFloat(cycleSBvalue)) || parseInt(cycleSBvalue) < 0 || !/^\d+$/.test(cycleSBvalue)) 
                    { EntryError(`Invalid Cycle in the "Small Size Device Method B in ${name} - Replications Results" graph: ${cycleSBvalue}`,`Cycle${type}g${i}`);return false;}
                    point.appendChild(createTextElement(xmlDoc, "Cycle", parseFloat(cycleSBvalue)));
                    let rutgraphSBvalue = rutgraphSB[j];
                    if (isNaN(parseFloat(rutgraphSBvalue)) || parseFloat(rutgraphSBvalue) < 0 || !/^\d+(\.\d+)?$/.test(rutgraphSBvalue))
                    { EntryError(`Invalid Rut Depth in the "Small Size Device Method B in ${name} - Replications Results" graph: ${rutgraphSBvalue}`,`RutDepth${type}g${i}`);return false;}
                    point.appendChild(createTextElement(xmlDoc, "RutDepth", parseFloat(rutgraphSBvalue)));
                    graphSB.appendChild(point);
                }
            }
            return true;
        }
                
        // Fucntion to remove all empty elements form XML string
        function removeEmptyElements(node) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                if (child.nodeType === 1 && child.childNodes.length > 0) {
                    removeEmptyElements(child);}
                if (child.nodeType === 1 && child.childNodes.length === 0 && child.innerHTML.trim() === '') {
                    node.removeChild(child);
                    i--;}
            }
        }


        function uploadXML() {
            const fileInput = document.getElementById('xmlFile');
            const file = fileInput.files[0];

            var CheckedElement= document.querySelectorAll('#field-U input[type="checkbox"]:not(#select-all)')
            var CheckedElementsID = [];
            CheckedElement.forEach(function(checkbox) {if (checkbox.checked) {CheckedElementsID.push(checkbox.id);}});
            console.log(CheckedElementsID);

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                const xmlDoc = new DOMParser().parseFromString(e.target.result, 'text/xml');

                //////////////////////////
                ////////////////////////// 

                if(CheckedElementsID.includes("select-source")) {

                    // Populate DataSource element
                    const dataSource = xmlDoc.querySelector('DataSource');
                    document.getElementById('measurementCampaignID').value = dataSource.querySelector('MeasurementCampaignID').textContent;
                    document.getElementById('organizationName').value = dataSource.querySelector('OrganizationName').textContent;
                    document.getElementById('locationCountry').value = dataSource.querySelector('LocationCountry').textContent;
                    document.getElementById('year').value = dataSource.querySelector('Year').textContent;

                    // Populate DataRecord element
                    const dataRecordElement= dataSource.querySelector('DataRecord');
                    if (dataRecordElement) {
                        const doiIdentifierElement = dataRecordElement.querySelector('DOIdentifier');
                        if (doiIdentifierElement) {
                            document.getElementById('RecordType').value = 'doiOnly';
                        } else {
                            document.getElementById('RecordType').value = 'completeForm';
                        }
                        document.getElementById('RecordType').onchange();
                    }

                    const selectedRecordMainType = document.getElementById('RecordType').value;
                    if (selectedRecordMainType === 'doiOnly') {
                        document.getElementById('doiOnly').value = dataRecordElement.querySelector('DOIdentifier').textContent;
                    } else if (selectedRecordMainType === 'completeForm') {
                        const completeDataRecord = dataRecordElement.querySelector('CompleteDataRecord');
                        if (completeDataRecord) {
                            const completeDataRecordUp = dataRecordElement.querySelector('CompleteDataRecord').firstElementChild.nodeName;
                            if (completeDataRecordUp==="ArticleInJournal"){
                                document.getElementById('completerecordType').value = 'ArticleInJournal';
                                populateFieldIfExists(xmlDoc, "firstAuthor", "ArticleInJournal FirstAuthor");
                                const coAuthors = xmlDoc.querySelectorAll("ArticleInJournal Co-Authors");
                                const coAuthorsText = Array.from(coAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                                document.getElementById("coAuthors").value = coAuthorsText;
                                populateFieldIfExists(xmlDoc, "articleTitle", "ArticleInJournal ArticleTitle");
                                populateFieldIfExists(xmlDoc, "journalTitle", "JournalTitle");
                                populateFieldIfExists(xmlDoc, "journalVolumeNumber", "JournalVolumeNumber");
                                populateFieldIfExists(xmlDoc, "journalIssueNumber", "JournalIssueNumber");
                                populateFieldIfExists(xmlDoc, "articleStartingPage", "ArticleStartingPage");
                                populateFieldIfExists(xmlDoc, "articleEndingPage", "ArticleEndingPage");
                                populateFieldIfExists(xmlDoc, "articleNumber", "ArticleNumber");
                                populateFieldIfExists(xmlDoc, "Artyear", "ArticleInJournal Year");
                                populateFieldIfExists(xmlDoc, "publisher", "ArticleInJournal Publisher");
                                populateFieldIfExists(xmlDoc, "doi", "ArticleInJournal DOI");
                                populateFieldIfExists(xmlDoc, "issn", "ArticleInJournal ISSN");

                            }if (completeDataRecordUp==="ArticleInConferenceProceedings"){
                                document.getElementById('completerecordType').value = 'ArticleInConferenceProceedings';
                                populateFieldIfExists(xmlDoc, "confFirstAuthor", "ArticleInConferenceProceedings FirstAuthor");
                                const coAuthors = xmlDoc.querySelectorAll("ArticleInConferenceProceedings Co-Authors");
                                const coAuthorsText = Array.from(coAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                                document.getElementById("confCoAuthors").value = coAuthorsText;
                                populateFieldIfExists(xmlDoc, "confArticleTitle", "ArticleInConferenceProceedings ArticleTitle");
                                populateFieldIfExists(xmlDoc, "confConferenceTitle", "ConferenceTitle");
                                populateFieldIfExists(xmlDoc, "confConferenceCity", "ConferenceCity");
                                populateFieldIfExists(xmlDoc, "confConferenceCountry", "ConferenceCountry");
                                populateFieldIfExists(xmlDoc, "confProceedingsTitle", "ConferenceProceedingsTitle");
                                populateFieldIfExists(xmlDoc, "confProceedingsVolumeNumber", "ConferenceProceedingsVolumeNumber");
                                populateFieldIfExists(xmlDoc, "confProceedingsStartingPage", "ConferenceProceedingsStartingPage");
                                populateFieldIfExists(xmlDoc, "confProceedingsEndingPage", "ConferenceProceedingsEndingPage");
                                populateFieldIfExists(xmlDoc, "confYear", "ArticleInConferenceProceedings Year");
                                populateFieldIfExists(xmlDoc, "confPublisher", "ArticleInConferenceProceedings Publisher");
                                populateFieldIfExists(xmlDoc, "confDOI", "ArticleInConferenceProceedings DOI");

                            }if (completeDataRecordUp==="BookPublication"){
                                document.getElementById('completerecordType').value = 'BookPublication';
                                populateFieldIfExists(xmlDoc, "bookFirstAuthor", "BookPublication FirstAuthor");
                                const bookCoAuthors = xmlDoc.querySelectorAll("BookPublication Co-Authors");
                                const bookCoAuthorsText = Array.from(bookCoAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                                document.getElementById("bookCoAuthors").value = bookCoAuthorsText;
                                populateFieldIfExists(xmlDoc, "bookTitle", "BookTitle");
                                populateFieldIfExists(xmlDoc, "bookChapterTitle", "BookChapterTitle");
                                populateFieldIfExists(xmlDoc, "bookChapterNumber", "ChapterNumber");
                                populateFieldIfExists(xmlDoc, "bookEditors", "Editors");
                                populateFieldIfExists(xmlDoc, "bookEditionNumber", "EditionNumber");
                                populateFieldIfExists(xmlDoc, "bookChapterStartingPage", "ChapterStartingPage");
                                populateFieldIfExists(xmlDoc, "bookChapterEndingPage", "ChapterEndingPage");
                                populateFieldIfExists(xmlDoc, "bookYear", "BookPublication Year");
                                populateFieldIfExists(xmlDoc, "bookPublisher", "BookPublication Publisher");
                                populateFieldIfExists(xmlDoc, "bookDOI", "BookPublication DOI");
                                populateFieldIfExists(xmlDoc, "bookISBN", "ISBN");

                            }if (completeDataRecordUp==="PublishedReport"){
                                document.getElementById('completerecordType').value = 'PublishedReport';
                                populateFieldIfExists(xmlDoc, "reportFirstAuthor", "PublishedReport FirstAuthor");
                                const reportCoAuthors = xmlDoc.querySelectorAll("PublishedReport Co-Authors");
                                const reportCoAuthorsText = Array.from(reportCoAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                                document.getElementById("reportCoAuthors").value = reportCoAuthorsText;
                                populateFieldIfExists(xmlDoc, "reportTitle", "PublishedReport ReportTitle");
                                populateFieldIfExists(xmlDoc, "reportNumber", "PublishedReport ReportNumber");
                                populateFieldIfExists(xmlDoc, "reportYear", "PublishedReport Year");
                                populateFieldIfExists(xmlDoc, "reportPublisher", "PublishedReport Publisher");
                                populateFieldIfExists(xmlDoc, "reportDOI", "PublishedReport DOI");
                                populateFieldIfExists(xmlDoc, "reportURL", "PublishedReport URL");

                            }if (completeDataRecordUp==="UnpublishedReport"){
                                document.getElementById('completerecordType').value = 'UnpublishedReport';
                                populateFieldIfExists(xmlDoc, "unreportFirstAuthor", "UnpublishedReport FirstAuthor");
                                const unreportCoAuthors = xmlDoc.querySelectorAll("UnpublishedReport Co-Authors");
                                const unreportCoAuthorsText = Array.from(unreportCoAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                                document.getElementById("unreportCoAuthors").value = unreportCoAuthorsText;
                                populateFieldIfExists(xmlDoc, "unreportTitle", "UnpublishedReport ReportTitle");
                                populateFieldIfExists(xmlDoc, "unreportYear", "UnpublishedReport Year");
                                populateFieldIfExists(xmlDoc, "unreportURL", "UnpublishedReport URL");                            

                            }if (completeDataRecordUp==="OtherBibliographic"){
                                document.getElementById('completerecordType').value = 'OtherBibliographic';
                                populateFieldIfExists(xmlDoc, "otherBibInformation", "OtherBibliographic Information");

                            }
                            document.getElementById('completerecordType').onchange();
                        }
                    }

                    // Populate Notes element
                    populateFieldIfExists(xmlDoc, 'NotesSourceContent', 'Notes');
                }

                //////////////////////////
                ////////////////////////// 
                
                if(CheckedElementsID.includes("select-mixture")) {

                    // Populate MixtureIdentifiers element
                    populateFieldIfExists(xmlDoc, "MixtureID", "MixtureIdentifiers MixtureID");
                    populateFieldIfExists(xmlDoc, "MixtureType", "MixtureIdentifiers MixtureType");

                    // Populate MixtureRecipe element
                    populateFieldIfExists(xmlDoc, "CoarseAggregates", "Composition CoarseAggregates");
                    populateFieldIfExists(xmlDoc, "FineAggregates", "Composition FineAggregates");
                    populateFieldIfExists(xmlDoc, "AddedFiller", "Composition AddedFiller");
                    populateFieldIfExists(xmlDoc, "ReclaimedAsphalt", "Composition ReclaimedAsphalt");
                    populateFieldIfExists(xmlDoc, "Rejuvenator", "Composition Rejuvenator");
                    populateFieldIfExists(xmlDoc, "TargetBinderGrade", "Composition Binder TargetBinderGrade");
                    populateFieldIfExists(xmlDoc, "Binder", "Composition Binder BinderContent");

                    const VApoints = Array.from(xmlDoc.querySelectorAll("GrainSizeDistribution VirginAggregates Point")).map(point => {
                        const size = point.querySelector("Size").textContent.trim();
                        const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                        return `${size},${percentageDistribution}`;
                    }).join("; ");
                    document.getElementById("SizeVirgin").value = VApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                    document.getElementById("PercentageVirgin").value = VApoints.split(';').map(pair => pair.split(',')[1]).join('; ');
                    const RApoints = Array.from(xmlDoc.querySelectorAll("GrainSizeDistribution ReclaimedAggregates Point")).map(point => {
                        const size = point.querySelector("Size").textContent.trim();
                        const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                        return `${size},${percentageDistribution}`;
                    }).join("; ");
                    document.getElementById("SizeReclaimed").value = RApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                    document.getElementById("PercentageReclaimed").value = RApoints.split(';').map(pair => pair.split(',')[1]).join('; ');

                    populateFieldIfExists(xmlDoc, "MaximumDensityValue", "MixtureMaximumDensity");               

                    // Populate VirginAggregates element within MixtureComponentProperties element
                    populateFieldIfExists(xmlDoc, "NatureVA", "MixtureComponentProperties VirginAggregates Nature");
                    populateFieldIfExists(xmlDoc, "LosAngelesTestResultVA", "MixtureComponentProperties VirginAggregates LosAngelesTestResult");
                    populateFieldIfExists(xmlDoc, "FlakinessIndexVA", "MixtureComponentProperties VirginAggregates FlakinessIndex");
                    populateFieldIfExists(xmlDoc, "ShapeIndexVA", "MixtureComponentProperties VirginAggregates ShapeIndex");
                    populateFieldIfExists(xmlDoc, "FlowCoefficientVA", "MixtureComponentProperties VirginAggregates FlowCoefficient");
                    populateFieldIfExists(xmlDoc, "NordicAbrasionValueVA", "MixtureComponentProperties VirginAggregates NordicAbrasionValue");
                    populateFieldIfExists(xmlDoc, "SemiCrushedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed SemiCrushedParticles");
                    populateFieldIfExists(xmlDoc, "TotallyCrushedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed TotallyCrushedParticles");
                    populateFieldIfExists(xmlDoc, "SemiRoundedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed SemiRoundedParticles");
                    populateFieldIfExists(xmlDoc, "TotallyRoundedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed TotallyRoundedParticles");
                    populateFieldIfExists(xmlDoc, "BitumenCoverageDegreeVA", "MixtureComponentProperties VirginAggregates BitumenCoverageDegree");
                    XMLaddProperties(xmlDoc,'field9-2','VA','form-group TwoColumn dynamicPro','MixtureComponentProperties VirginAggregates');

                    // Populate Filler element within MixtureComponentProperties element
                    populateFieldIfExists(xmlDoc, "NatureFiller", "MixtureComponentProperties Filler Nature");
                    populateFieldIfExists(xmlDoc, "StiffeningEffectFiller", "MixtureComponentProperties Filler StiffeningEffect");
                    populateFieldIfExists(xmlDoc, "ParticleDensityFillerValue", "MixtureComponentProperties Filler ParticleDensity");
                    populateFieldIfExists(xmlDoc, "WaterSusceptibilityFiller", "MixtureComponentProperties Filler WaterSusceptibility");
                    XMLaddProperties(xmlDoc,'field10-2','Filler','form-group TwoColumn dynamicPro','MixtureComponentProperties Filler');

                    // Populate VirginBinder elemen
                    populateFieldIfExists(xmlDoc, "PenetrationVB", "MixtureComponentProperties VirginBinder Penetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointVB", "MixtureComponentProperties VirginBinder SofteningPoint");
                    populateFieldIfExists(xmlDoc, "KinematicViscosityVB", "MixtureComponentProperties VirginBinder KinematicViscosity");
                    populateFieldIfExists(xmlDoc, "DynamicViscosityVB", "MixtureComponentProperties VirginBinder DynamicViscosity");
                    populateFieldIfExists(xmlDoc, "TemperatureVB", "MixtureComponentProperties VirginBinder BTSV Temperature");
                    populateFieldIfExists(xmlDoc, "PhaseAngleVB", "MixtureComponentProperties VirginBinder BTSV PhaseAngle");
                    XMLaddProperties(xmlDoc,'field11-1-1','BTSVVB','form-group TwoColumn dynamicPro','MixtureComponentProperties VirginBinder BTSV');
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery100PaVB", "MixtureComponentProperties VirginBinder MSCRT AveragePercentRecovery100Pa");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery3200PaVB", "MixtureComponentProperties VirginBinder MSCRT AveragePercentRecovery3200Pa");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceVB", "MixtureComponentProperties VirginBinder MSCRT RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance100PaVB", "MixtureComponentProperties VirginBinder MSCRT NonrecoverableCreepCompliance100Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance3200PaVB", "MixtureComponentProperties VirginBinder MSCRT NonrecoverableCreepCompliance3200Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceVB", "MixtureComponentProperties VirginBinder MSCRT NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "SpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress SpecifiedStress");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecoverySpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "FraassBreakingPointVB", "MixtureComponentProperties VirginBinder FraassBreakingPoint");
                    populateFieldIfExists(xmlDoc, "MassChangeVB", "MixtureComponentProperties VirginBinder AgingResistance MassChange");
                    populateFieldIfExists(xmlDoc, "PenetrationChangeVB", "MixtureComponentProperties VirginBinder AgingResistance RetainedPenetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointChangeVB", "MixtureComponentProperties VirginBinder AgingResistance SofteningPointChange");
                    populateFieldIfExists(xmlDoc, "ElasticRecoveryVB", "MixtureComponentProperties VirginBinder ElasticRecovery");
                    populateFieldIfExists(xmlDoc, "CohesionEnergyVB", "MixtureComponentProperties VirginBinder CohesionEnergy");
                    populateFieldIfExists(xmlDoc, "SolubilityVB", "MixtureComponentProperties VirginBinder Solubility");
                    XMLaddProperties(xmlDoc,'field11-4','VB','form-group TwoColumn dynamicPro','MixtureComponentProperties VirginBinder');

                    // Populate ReclaimedAsphalt element including ReclaimedAsphaltBinder child element
                    populateFieldIfExists(xmlDoc, "NatureRA", "MixtureComponentProperties ReclaimedAsphalt Nature");
                    populateFieldIfExists(xmlDoc, "LosAngelesTestResultRA", "MixtureComponentProperties ReclaimedAsphalt LosAngelesTestResult");
                    populateFieldIfExists(xmlDoc, "FlakinessIndexRA", "MixtureComponentProperties ReclaimedAsphalt FlakinessIndex");
                    populateFieldIfExists(xmlDoc, "ShapeIndexRA", "MixtureComponentProperties ReclaimedAsphalt ShapeIndex");
                    populateFieldIfExists(xmlDoc, "FlowCoefficientRA", "MixtureComponentProperties ReclaimedAsphalt FlowCoefficient");
                    populateFieldIfExists(xmlDoc, "NordicAbrasionValueRA", "MixtureComponentProperties ReclaimedAsphalt NordicAbrasionValue");
                    populateFieldIfExists(xmlDoc, "SemiCrushedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed SemiCrushedParticles");
                    populateFieldIfExists(xmlDoc, "TotallyCrushedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed TotallyCrushedParticles");
                    populateFieldIfExists(xmlDoc, "SemiRoundedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed SemiRoundedParticles");
                    populateFieldIfExists(xmlDoc, "TotallyRoundedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed TotallyRoundedParticles");

                    populateFieldIfExists(xmlDoc, "PercentageContentRB", "MixtureComponentProperties ReclaimedAsphaltBinder PercentageContent");
                    populateFieldIfExists(xmlDoc, "PenetrationRB", "MixtureComponentProperties ReclaimedAsphaltBinder Penetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointRB", "MixtureComponentProperties ReclaimedAsphaltBinder SofteningPoint");
                    populateFieldIfExists(xmlDoc, "KinematicViscosityRB", "MixtureComponentProperties ReclaimedAsphaltBinder KinematicViscosity");
                    populateFieldIfExists(xmlDoc, "DynamicViscosityRB", "MixtureComponentProperties ReclaimedAsphaltBinder DynamicViscosity");
                    populateFieldIfExists(xmlDoc, "TemperatureRB", "MixtureComponentProperties ReclaimedAsphaltBinder BTSV Temperature");
                    populateFieldIfExists(xmlDoc, "PhaseAngleRB", "MixtureComponentProperties ReclaimedAsphaltBinder BTSV PhaseAngle");
                    XMLaddProperties(xmlDoc,'field13-1-1','BTSVRB','form-group TwoColumn dynamicPro','MixtureComponentProperties ReclaimedAsphaltBinder BTSV');
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery100PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT AveragePercentRecovery100Pa");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery3200PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT AveragePercentRecovery3200Pa");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance100PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonrecoverableCreepCompliance100Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance3200PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonrecoverableCreepCompliance3200Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "SpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress SpecifiedStress");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecoverySpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "FraassBreakingPointRB", "MixtureComponentProperties ReclaimedAsphaltBinder FraassBreakingPoint");
                    populateFieldIfExists(xmlDoc, "ElasticRecoveryRB", "MixtureComponentProperties ReclaimedAsphaltBinder ElasticRecovery");
                    populateFieldIfExists(xmlDoc, "CohesionEnergyRB", "MixtureComponentProperties ReclaimedAsphaltBinder CohesionEnergy");
                    populateFieldIfExists(xmlDoc, "SolubilityRB", "MixtureComponentProperties ReclaimedAsphaltBinder Solubility");
                    XMLaddProperties(xmlDoc,'field13-3','RB','form-group TwoColumn dynamicPro','MixtureComponentProperties ReclaimedAsphaltBinder');

                    populateFieldIfExists(xmlDoc, "BitumenCoverageDegreeRA", "MixtureComponentProperties ReclaimedAsphalt BitumenCoverageDegree");
                    XMLaddProperties(xmlDoc,'field12-2','RA','form-group TwoColumn dynamicPro','MixtureComponentProperties ReclaimedAsphalt');
    
                    // Populate Additive element
                    XMLaddAdditive(xmlDoc,'field14','form-group TwoColumn dynamicPro')

                    // Populate PreMixingBinderBlend element
                    populateFieldIfExists(xmlDoc, "PenetrationPmB", "MixtureComponentProperties PreMixingBinderBlend Penetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointPmB", "MixtureComponentProperties PreMixingBinderBlend SofteningPoint");
                    populateFieldIfExists(xmlDoc, "KinematicViscosityPmB", "MixtureComponentProperties PreMixingBinderBlend KinematicViscosity");
                    populateFieldIfExists(xmlDoc, "DynamicViscosityPmB", "MixtureComponentProperties PreMixingBinderBlend DynamicViscosity");
                    populateFieldIfExists(xmlDoc, "TemperaturePmB", "MixtureComponentProperties PreMixingBinderBlend BTSV Temperature");
                    populateFieldIfExists(xmlDoc, "PhaseAnglePmB", "MixtureComponentProperties PreMixingBinderBlend BTSV PhaseAngle");
                    XMLaddProperties(xmlDoc,'field15-1-1','BTSVPmB','form-group TwoColumn dynamicPro','MixtureComponentProperties PreMixingBinderBlend BTSV');
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery100PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT AveragePercentRecovery100Pa");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery3200PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT AveragePercentRecovery3200Pa");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferencePmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance100PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonrecoverableCreepCompliance100Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance3200PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonrecoverableCreepCompliance3200Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferencePmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "SpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress SpecifiedStress");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecoverySpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "FraassBreakingPointPmB", "MixtureComponentProperties PreMixingBinderBlend FraassBreakingPoint");
                    populateFieldIfExists(xmlDoc, "MassChangePmB", "MixtureComponentProperties PreMixingBinderBlend AgingResistance MassChange");
                    populateFieldIfExists(xmlDoc, "PenetrationChangePmB", "MixtureComponentProperties PreMixingBinderBlend AgingResistance RetainedPenetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointChangePmB", "MixtureComponentProperties PreMixingBinderBlend AgingResistance SofteningPointChange");
                    populateFieldIfExists(xmlDoc, "ElasticRecoveryPmB", "MixtureComponentProperties PreMixingBinderBlend ElasticRecovery");
                    populateFieldIfExists(xmlDoc, "CohesionEnergyPmB", "MixtureComponentProperties PreMixingBinderBlend CohesionEnergy");
                    populateFieldIfExists(xmlDoc, "SolubilityPmB", "MixtureComponentProperties PreMixingBinderBlend Solubility");
                    XMLaddProperties(xmlDoc,'field15-4','PmB','form-group TwoColumn dynamicPro','MixtureComponentProperties PreMixingBinderBlend');

                    // Populate Mixing element
                    populateFieldIfExists(xmlDoc, "MixingStandard", "Mixing MixingStandard");
                    populateFieldIfExists(xmlDoc, "MixingMethod", "Mixing MixingMethod Method");
                    populateFieldIfExists(xmlDoc, "TypeofMixer", "Mixing MixingMethod TypeofMixer");
                    populateFieldIfExists(xmlDoc, "MixingSequence", "Mixing MixingSequence");
                    populateFieldIfExists(xmlDoc, "MixtureTemperature", "Mixing MixtureTemperature");
                    populateFieldIfExists(xmlDoc, "ReclaimedAsphaltTemperature", "Mixing ReclaimedAsphaltTemperature");
                    populateFieldIfExists(xmlDoc, "MixingDurationValue", "Mixing MixingDuration Value");
                    populateFieldIfExists(xmlDoc, "MixingDurationUnit", "Mixing MixingDuration Unit");
                    XMLaddmixingproperty(xmlDoc,'field16-3', 'form-group TwoColumn dynamicPro');

                    // Populate Aggregates element within RecoveredMaterials element
                    populateFieldIfExists(xmlDoc, "NatureCA", "RecoveredMaterials Aggregates Properties Nature");
                    populateFieldIfExists(xmlDoc, "LosAngelesTestResultCA", "RecoveredMaterials Aggregates Properties LosAngelesTestResult");
                    populateFieldIfExists(xmlDoc, "FlakinessIndexCA", "RecoveredMaterials Aggregates Properties FlakinessIndex");
                    populateFieldIfExists(xmlDoc, "ShapeIndexCA", "RecoveredMaterials Aggregates Properties ShapeIndex");
                    populateFieldIfExists(xmlDoc, "FlowCoefficientCA", "RecoveredMaterials Aggregates Properties FlowCoefficient");
                    populateFieldIfExists(xmlDoc, "NordicAbrasionValueCA", "RecoveredMaterials Aggregates Properties NordicAbrasionValue");
                    populateFieldIfExists(xmlDoc, "SemiCrushedParticlesCA", "RecoveredMaterials Aggregates Properties RoundedAndCrushed SemiCrushedParticles");
                    populateFieldIfExists(xmlDoc, "TotallyCrushedParticlesCA", "RecoveredMaterials Aggregates Properties RoundedAndCrushed TotallyCrushedParticles");
                    populateFieldIfExists(xmlDoc, "SemiRoundedParticlesCA", "RecoveredMaterials Aggregates Properties RoundedAndCrushed SemiRoundedParticles");
                    populateFieldIfExists(xmlDoc, "TotallyRoundedParticlesCA", "RecoveredMaterials Aggregates Properties RoundedAndCrushed TotallyRoundedParticles");
                    populateFieldIfExists(xmlDoc, "BitumenCoverageDegreeCA", "RecoveredMaterials Aggregates Properties BitumenCoverageDegree");
                    XMLaddProperties(xmlDoc,'field17-2','CA','form-group TwoColumn dynamicPro','RecoveredMaterials Aggregates Properties');
                    const CApoints = Array.from(xmlDoc.querySelectorAll("RecoveredMaterials Aggregates GrainSizeDistribution Point")).map(point => {
                        const size = point.querySelector("Size").textContent.trim();
                        const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                        return `${size},${percentageDistribution}`;
                    }).join("; ");
                    document.getElementById("SizeCA").value = CApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                    document.getElementById("PercentageCA").value = CApoints.split(';').map(pair => pair.split(',')[1]).join('; ');                 

                    // Populate Binder element within RecoveredMaterials element
                    populateFieldIfExists(xmlDoc, "PercentageContentCB", "RecoveredMaterials Binder PercentageContent");
                    populateFieldIfExists(xmlDoc, "PenetrationCB", "RecoveredMaterials Binder Penetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointCB", "RecoveredMaterials Binder SofteningPoint");
                    populateFieldIfExists(xmlDoc, "KinematicViscosityCB", "RecoveredMaterials Binder KinematicViscosity");
                    populateFieldIfExists(xmlDoc, "DynamicViscosityCB", "RecoveredMaterials Binder DynamicViscosity");
                    populateFieldIfExists(xmlDoc, "TemperatureCB", "RecoveredMaterials Binder BTSV Temperature");
                    populateFieldIfExists(xmlDoc, "PhaseAngleCB", "RecoveredMaterials Binder BTSV PhaseAngle");
                    XMLaddProperties(xmlDoc,'field18-1-1','BTSVCB','form-group TwoColumn dynamicPro','RecoveredMaterials Binder BTSV');
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery100PaCB", "RecoveredMaterials Binder MSCRT AveragePercentRecovery100Pa");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecovery3200PaCB", "RecoveredMaterials Binder MSCRT AveragePercentRecovery3200Pa");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceCB", "RecoveredMaterials Binder MSCRT RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance100PaCB", "RecoveredMaterials Binder MSCRT NonrecoverableCreepCompliance100Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliance3200PaCB", "RecoveredMaterials Binder MSCRT NonrecoverableCreepCompliance3200Pa");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceCB", "RecoveredMaterials Binder MSCRT NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "SpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress SpecifiedStress");
                    populateFieldIfExists(xmlDoc, "AveragePercentRecoverySpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
                    populateFieldIfExists(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress RecoveryPercentageDifference");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
                    populateFieldIfExists(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
                    populateFieldIfExists(xmlDoc, "FraassBreakingPointCB", "RecoveredMaterials Binder FraassBreakingPoint");
                    populateFieldIfExists(xmlDoc, "MassChangeCB", "RecoveredMaterials Binder AgingResistance MassChange");
                    populateFieldIfExists(xmlDoc, "PenetrationChangeCB", "RecoveredMaterials Binder AgingResistance RetainedPenetration");
                    populateFieldIfExists(xmlDoc, "SofteningPointChangeCB", "RecoveredMaterials Binder AgingResistance SofteningPointChange");
                    populateFieldIfExists(xmlDoc, "ElasticRecoveryCB", "RecoveredMaterials Binder ElasticRecovery");
                    populateFieldIfExists(xmlDoc, "CohesionEnergyCB", "RecoveredMaterials Binder CohesionEnergy");
                    populateFieldIfExists(xmlDoc, "SolubilityCB", "RecoveredMaterials Binder Solubility");
                    XMLaddProperties(xmlDoc,'field18-4','CB','form-group TwoColumn dynamicPro','RecoveredMaterials Binder');

                    // Populate Notes element
                    populateFieldIfExists(xmlDoc, 'NotesMixtureContent', 'Mixture Notes');
      
                }

                //////////////////////////
                //////////////////////////
  
                if(CheckedElementsID.includes("select-sample")) {

                    // Populate SampleProperties element
                    populateFieldIfExists(xmlDoc, "Length", "SampleProperties SampleDimensions Length");
                    populateFieldIfExists(xmlDoc, "Width", "SampleProperties SampleDimensions Width");
                    populateFieldIfExists(xmlDoc, "NominalThickness", "SampleProperties SampleDimensions NominalThickness");
                    const Sampleprep = xmlDoc.querySelector('SamplePreparation');
                    if (Sampleprep) {
                        const selectedprep = Sampleprep.firstElementChild.nodeName;
                        if(selectedprep ==="PavementCoring"){
                            document.getElementById('Sampling').value = 'PavementCoring';
                            populateFieldIfExists(xmlDoc, "PavingDate", "SampleProperties SamplePreparation PavementCoring Coring PavingDate");
                            populateFieldIfExists(xmlDoc, "CoringDate", "SampleProperties SamplePreparation PavementCoring Coring CoringDate");
                            populateFieldIfExists(xmlDoc, "CoringLocation", "SampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                        } else if(selectedprep ==="LooseMixture") {
                            document.getElementById('Sampling').value = 'LooseMixture';
                            populateFieldIfExists(xmlDoc, "CompactionDate", "SampleProperties SamplePreparation LooseMixture Compaction CompactionDate");
                            populateFieldIfExists(xmlDoc, "RollerType", "SampleProperties SamplePreparation LooseMixture Compaction RollerType");
                            populateFieldIfExists(xmlDoc, "CompactionTarget", "SampleProperties SamplePreparation LooseMixture Compaction CompactionTarget");
                            populateFieldIfExists(xmlDoc, "CompactionTemperature", "SampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                        }
                        document.getElementById('Sampling').onchange();
                    }
                    populateFieldIfExists(xmlDoc, "LooseSample", "SampleProperties SampleAge LooseSample");
                    populateFieldIfExists(xmlDoc, "CompactedSample", "SampleProperties SampleAge CompactedSample");
                    populateFieldIfExists(xmlDoc, "StorageConditions", "SampleProperties StorageConditions");

                }

                if(CheckedElementsID.includes("select-results")) {              
                    // Populate Results element
                    populateFieldIfExists(xmlDoc, "TestTemperature", "Results TestTemperature");
                    const resultsselection = xmlDoc.querySelector('Procedure').firstElementChild.nodeName;
                    if(resultsselection){
                        if (resultsselection==="LargeOrExtraLargeDevices"){
                            document.getElementById('ResultsSelection').value = 'LargeOrExtraLargeDevices';
                            populateFieldIfExists(xmlDoc, "CyclesNumberL", "LargeOrExtraLargeDevices Mean CyclesNumber");
                            populateFieldIfExists(xmlDoc, "MeanProportionalRutDepthL", "LargeOrExtraLargeDevices Mean MeanProportionalRutDepth");
                            populateFieldIfExists(xmlDoc, "BulkDensityValueL", "LargeOrExtraLargeDevices Mean BulkDensity Value");
                            populateFieldIfExists(xmlDoc, "BulkDensityMethodL", "LargeOrExtraLargeDevices Mean BulkDensity MethodofMeasurement");
                            populateFieldIfExists(xmlDoc, "AirVoidsL", "LargeOrExtraLargeDevices Mean Voids AirVoids");
                            populateFieldIfExists(xmlDoc, "MineralAggregateVoidsL", "LargeOrExtraLargeDevices Mean Voids MineralAggregateVoids");
                            populateFieldIfExists(xmlDoc, "VoidsFilledWithBitumenL", "LargeOrExtraLargeDevices Mean Voids VoidsFilledWithBitumen");
                            const Lpoints = Array.from(xmlDoc.querySelectorAll("LargeOrExtraLargeDevices Mean ProportionalRutDepthVersusCyclesGraph Point")).map(point => {
                                const cycleLL = point.querySelector("Cycle").textContent.trim();
                                const proprutLL = point.querySelector("ProportionalRutDepth").textContent.trim();
                                return `${cycleLL},${proprutLL}`;
                            }).join("; ");
                            document.getElementById("CycleLg").value = Lpoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                            document.getElementById("ProportionalRutDepthLg").value = Lpoints.split(';').map(pair => pair.split(',')[1]).join('; ');     
                            XMLaddReplicationsL(xmlDoc, "field21-1-S", "form-group");

                        }if (resultsselection==="SmallSizeDeviceMethod_A_Air"){
                            document.getElementById('ResultsSelection').value = 'SmallSizeDeviceMethod_A_Air';
                            populateFieldIfExists(xmlDoc, "MeanWheelTrackingRateSA", "SmallSizeDeviceMethod_A_Air Mean MeanWheelTrackingRate");
                            populateFieldIfExists(xmlDoc, "CyclesNumberSA", "SmallSizeDeviceMethod_A_Air Mean CyclesNumber");
                            populateFieldIfExists(xmlDoc, "MeanRutDepthSA", "SmallSizeDeviceMethod_A_Air Mean MeanRutDepth");
                            populateFieldIfExists(xmlDoc, "BulkDensityValueSA", "SmallSizeDeviceMethod_A_Air Mean BulkDensity Value");
                            populateFieldIfExists(xmlDoc, "BulkDensityMethodSA", "SmallSizeDeviceMethod_A_Air Mean BulkDensity MethodofMeasurement");
                            populateFieldIfExists(xmlDoc, "AirVoidsSA", "SmallSizeDeviceMethod_A_Air Mean Voids AirVoids");
                            populateFieldIfExists(xmlDoc, "MineralAggregateVoidsSA", "SmallSizeDeviceMethod_A_Air Mean Voids MineralAggregateVoids");
                            populateFieldIfExists(xmlDoc, "VoidsFilledWithBitumenSA", "SmallSizeDeviceMethod_A_Air Mean Voids VoidsFilledWithBitumen");
                            const SApoints = Array.from(xmlDoc.querySelectorAll("SmallSizeDeviceMethod_A_Air Mean RutDepthVersusCyclesGraph Point")).map(point => {
                                const cycleSSA = point.querySelector("Cycle").textContent.trim();
                                const rutSSA = point.querySelector("RutDepth").textContent.trim();
                                return `${cycleSSA},${rutSSA}`;
                            }).join("; ");
                            document.getElementById("CycleSAg").value = SApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                            document.getElementById("RutDepthSAg").value = SApoints.split(';').map(pair => pair.split(',')[1]).join('; ');     
                            XMLaddReplicationsSA(xmlDoc, "field21-2-S", "form-group");

                        }if (resultsselection==="SmallSizeDeviceMethod_B_Air"){
                            document.getElementById('ResultsSelection').value = 'SmallSizeDeviceMethod_B_Air';
                            populateFieldIfExists(xmlDoc, "MeanWheelTrackingSlopeSBA", "SmallSizeDeviceMethod_B_Air Mean MeanWheelTrackingSlope");
                            populateFieldIfExists(xmlDoc, "CyclesNumberSBA", "SmallSizeDeviceMethod_B_Air Mean CyclesNumber");
                            populateFieldIfExists(xmlDoc, "MeanProportionalRutDepthSBA", "SmallSizeDeviceMethod_B_Air Mean MeanProportionalRutDepth");
                            populateFieldIfExists(xmlDoc, "MeanRutDepthSBA", "SmallSizeDeviceMethod_B_Air Mean MeanRutDepth");
                            populateFieldIfExists(xmlDoc, "BulkDensityValueSBA", "SmallSizeDeviceMethod_B_Air Mean BulkDensity Value");
                            populateFieldIfExists(xmlDoc, "BulkDensityMethodSBA", "SmallSizeDeviceMethod_B_Air Mean BulkDensity MethodofMeasurement");
                            populateFieldIfExists(xmlDoc, "AirVoidsSBA", "SmallSizeDeviceMethod_B_Air Mean Voids AirVoids");
                            populateFieldIfExists(xmlDoc, "MineralAggregateVoidsSBA", "SmallSizeDeviceMethod_B_Air Mean Voids MineralAggregateVoids");
                            populateFieldIfExists(xmlDoc, "VoidsFilledWithBitumenSBA", "SmallSizeDeviceMethod_B_Air Mean Voids VoidsFilledWithBitumen");
                            const SBApoints = Array.from(xmlDoc.querySelectorAll("SmallSizeDeviceMethod_B_Air Mean RutDepthVersusCyclesGraph Point")).map(point => {
                                const cycleSSBA = point.querySelector("Cycle").textContent.trim();
                                const rutSSBA = point.querySelector("RutDepth").textContent.trim();
                                return `${cycleSSBA},${rutSSBA}`;
                            }).join("; ");
                            document.getElementById("CycleSBAg").value = SBApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                            document.getElementById("RutDepthSBAg").value = SBApoints.split(';').map(pair => pair.split(',')[1]).join('; ');     
                            XMLaddReplicationsSB(xmlDoc, "SBA", "field21-3", "field21-3-S", "form-group");

                        }if (resultsselection==="SmallSizeDeviceMethod_B_Water"){
                            document.getElementById('ResultsSelection').value = 'SmallSizeDeviceMethod_B_Water';
                            populateFieldIfExists(xmlDoc, "MeanWheelTrackingSlopeSBW", "SmallSizeDeviceMethod_B_Water Mean MeanWheelTrackingSlope");
                            populateFieldIfExists(xmlDoc, "CyclesNumberSBW", "SmallSizeDeviceMethod_B_Water Mean CyclesNumber");
                            populateFieldIfExists(xmlDoc, "MeanProportionalRutDepthSBW", "SmallSizeDeviceMethod_B_Water Mean MeanProportionalRutDepth");
                            populateFieldIfExists(xmlDoc, "MeanRutDepthSBW", "SmallSizeDeviceMethod_B_Water Mean MeanRutDepth");
                            populateFieldIfExists(xmlDoc, "BulkDensityValueSBW", "SmallSizeDeviceMethod_B_Water Mean BulkDensity Value");
                            populateFieldIfExists(xmlDoc, "BulkDensityMethodSBW", "SmallSizeDeviceMethod_B_Water Mean BulkDensity MethodofMeasurement");
                            populateFieldIfExists(xmlDoc, "AirVoidsSBW", "SmallSizeDeviceMethod_B_Water Mean Voids AirVoids");
                            populateFieldIfExists(xmlDoc, "MineralAggregateVoidsSBW", "SmallSizeDeviceMethod_B_Water Mean Voids MineralAggregateVoids");
                            populateFieldIfExists(xmlDoc, "VoidsFilledWithBitumenSBW", "SmallSizeDeviceMethod_B_Water Mean Voids VoidsFilledWithBitumen");
                            const SBWpoints = Array.from(xmlDoc.querySelectorAll("SmallSizeDeviceMethod_B_Water Mean RutDepthVersusCyclesGraph Point")).map(point => {
                                const cycleSSBW = point.querySelector("Cycle").textContent.trim();
                                const rutSSBW = point.querySelector("RutDepth").textContent.trim();
                                return `${cycleSSBW},${rutSSBW}`;
                            }).join("; ");
                            document.getElementById("CycleSBWg").value = SBWpoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                            document.getElementById("RutDepthSBWg").value = SBWpoints.split(';').map(pair => pair.split(',')[1]).join('; ');     
                            XMLaddReplicationsSB(xmlDoc, "SBW", "field21-4", "field21-4-S", "form-group");
                        }
                        document.getElementById('ResultsSelection').onchange();
                    }

                }

                if(CheckedElementsID.includes("select-sample") || CheckedElementsID.includes("select-result")) {

                    // Populate Notes element
                    populateFieldIfExists(xmlDoc, 'NotesResultsContent', 'RuttingTestResults Notes');

                }

                //////////////////////////
                //////////////////////////

                if(CheckedElementsID.includes("select-notes")) {

                    // Populate Notes element
                    populateFieldIfExists(xmlDoc, 'NotesGeneralContent', 'RuttingExp > Notes');

                }

                //////////////////////////
                //////////////////////////

                console.log('XML file successfully parsed and form fields populated.');
                };
                reader.readAsText(file);
            } else {console.error('No XML file selected.');}
        }

        function populateFieldIfExists(xmlDoc, fieldId, xmlElementName) {
            const xmlElement = xmlDoc.querySelector(xmlElementName);
            if (xmlElement) {document.getElementById(fieldId).value = xmlElement.textContent;}
        }

        function XMLaddProperties(xmlDoc,containerId, type, theclass, path) {
            const properties = xmlDoc.querySelectorAll(`${path} > AdditionalProperties`);              
            for (let i = 0; i < properties.length; i++) {
                populateFieldIfExists(properties[i], `TestMethod${type}_${i+1}`, "TestMethod");
                populateFieldIfExists(properties[i], `Value${type}_${i+1}`, "Value");
                populateFieldIfExists(properties[i], `Unit${type}_${i+1}`, "Unit");
                if (i+1 < properties.length){addadditional(containerId, type, theclass);}              
            }
        }

        function XMLaddAdditive(xmlDoc, containerId, theclass) {
            const additives = xmlDoc.querySelectorAll(`MixtureComponentProperties Additive`);
            for (let i = 0; i < additives.length; i++) {
                populateFieldIfExists(additives[i], `TypeAddtv_${i+1}`, "Type");
                populateFieldIfExists(additives[i], `PercentageMassAddtv_${i+1}`, "PercentageMass");
                const addprop = additives[i].querySelectorAll("AdditionalProperties");
                for (let j = 0; j < addprop.length; j++) {
                    populateFieldIfExists(addprop[j], `TestMethodAddtv_${i+1}_${j+1}`, "TestMethod");
                    populateFieldIfExists(addprop[j], `ValueAddtv_${i+1}_${j+1}`, "Value");
                    populateFieldIfExists(addprop[j], `UnitAddtv_${i+1}_${j+1}`, "Unit");
                    if (j + 1 < addprop.length) {addadditional(`${containerId}-${i+1}`, `Addtv_${i+1}`, theclass);}
                }
                if (i + 1 < additives.length) {addAdditive(containerId, theclass);}
            }
        }

        function XMLaddmixingproperty(xmlDoc,containerId, theclass) {
            const properties = xmlDoc.querySelectorAll(`Mixing OtherMixingProperty`);              
            for (let i = 0; i < properties.length; i++) {
                populateFieldIfExists(properties[i], `OtherMixingPropertyName_${i+1}`, "Name");
                populateFieldIfExists(properties[i], `OtherMixingPropertyValue_${i+1}`, "Value");
                populateFieldIfExists(properties[i], `OtherMixingPropertyUnit_${i+1}`, "Unit");
                if (i+1 < properties.length){addmixdesign(containerId, theclass);}              
            }
        }

        function XMLaddReplicationsL(xmlDoc, containerId, theclass) {
            const repls = xmlDoc.querySelectorAll(`Results Procedure LargeOrExtraLargeDevices Replication`);     
            for (let i = 0; i < repls.length; i++) {
                addLarge(containerId, theclass);
                populateFieldIfExists(repls[i], `CyclesNumberL${i+1}`, "CyclesNumber");
                populateFieldIfExists(repls[i], `ProportionalRutDepthL${i+1}`, ":scope > ProportionalRutDepth");
                populateFieldIfExists(repls[i], `BulkDensityValueL${i+1}`, "Value");
                populateFieldIfExists(repls[i], `BulkDensityMethodL${i+1}`, "MethodofMeasurement");
                populateFieldIfExists(repls[i], `AirVoidsL${i+1}`, "AirVoids");
                populateFieldIfExists(repls[i], `MineralAggregateVoidsL${i+1}`, "MineralAggregateVoids");
                populateFieldIfExists(repls[i], `VoidsFilledWithBitumenL${i+1}`, "VoidsFilledWithBitumen");
                const Lpoints = Array.from(repls[i].querySelectorAll("ProportionalRutDepthVersusCyclesGraph Point")).map(point => {
                    const cycle = point.querySelector("Cycle").textContent.trim();
                    const proprut = point.querySelector("ProportionalRutDepth").textContent.trim();
                    return `${cycle},${proprut}`;
                }).join("; ");
                document.getElementById(`CycleLg${i+1}`).value = Lpoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                document.getElementById(`ProportionalRutDepthLg${i+1}`).value = Lpoints.split(';').map(pair => pair.split(',')[1]).join('; '); 
            }
        } 
        
        function XMLaddReplicationsSA(xmlDoc, containerId, theclass) {
            const repls = xmlDoc.querySelectorAll(`Results Procedure SmallSizeDeviceMethod_A_Air Replication`);     
            for (let i = 0; i < repls.length; i++) {
                addSAAir(containerId, theclass);
                populateFieldIfExists(repls[i], `WheelTrackingRateSA${i+1}`, "WheelTrackingRate");
                if(repls[i].querySelector("Depth")){
                    const  selectionSAV = repls[i].querySelector("Depth").firstElementChild.nodeName;
                    if(selectionSAV){
                        if (selectionSAV==="CyclesAtLeast1000"){
                            document.getElementById(`RutDepthSA${i+1}`).value = 'ReachedSA';
                            populateFieldIfExists(repls[i], `Cycles1000SA${i+1}`, "Depth CyclesAtLeast1000 RutDepth");
                        } else if (selectionSAV==="CyclesLessThan1000"){
                            document.getElementById(`RutDepthSA${i+1}`).value = 'UnreachedSA';
                            populateFieldIfExists(xmlDoc, `RutDepth15mmSA${i+1}`, "Depth CyclesLessThan1000 CyclesAt15mmRut");
                        }
                        document.getElementById(`RutDepthSA${i+1}`).onchange(); 
                    } 
                }
                populateFieldIfExists(repls[i], `BulkDensityValueSA${i+1}`, "Value");
                populateFieldIfExists(repls[i], `BulkDensityMethodSA${i+1}`, "MethodofMeasurement");
                populateFieldIfExists(repls[i], `AirVoidsSA${i+1}`, "AirVoids");
                populateFieldIfExists(repls[i], `MineralAggregateVoidsSA${i+1}`, "MineralAggregateVoids");
                populateFieldIfExists(repls[i], `VoidsFilledWithBitumenSA${i+1}`, "VoidsFilledWithBitumen");

                const SApoints = Array.from(repls[i].querySelectorAll("RutDepthVersusCyclesGraph Point")).map(point => {
                    const cycleSSA = point.querySelector("Cycle").textContent.trim();
                    const rutSSA = point.querySelector("RutDepth").textContent.trim();
                    return `${cycleSSA},${rutSSA}`;
                }).join("; ");
                document.getElementById(`CycleSAg${i+1}`).value = SApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                document.getElementById(`RutDepthSAg${i+1}`).value = SApoints.split(';').map(pair => pair.split(',')[1]).join('; '); 
            }
        }   

        function XMLaddReplicationsSB(xmlDoc, type, maincontainerId, containerId, theclass) {
            let name = type === "SBA" ? "Air" : type === "SBW" ? "Water" : "Error";
            const repls = xmlDoc.querySelectorAll(`Results Procedure SmallSizeDeviceMethod_B_${name} Replication`);     
            for (let i = 0; i < repls.length; i++) {
                addSB(maincontainerId,containerId, type, theclass);
                populateFieldIfExists(repls[i], `WheelTrackingSlope${type}${i+1}`, "WheelTrackingSlope");
                if(repls[i].querySelector("Depths")){
                    const  selectionSBV = repls[i].querySelector("Depths").firstElementChild.nodeName;
                    if(selectionSBV){
                        if (selectionSBV==="CyclesAtLeast10000"){
                            document.getElementById(`ProportionalAndRutDepth${type}${i+1}`).value = `Reached${type}`;
                            populateFieldIfExists(repls[i], `Cycles10000ValueCyclesNumber${type}${i+1}`, "Depths CyclesAtLeast10000 FinalCyclesNumber");
                            populateFieldIfExists(repls[i], `Cycles10000Value${type}prop${i+1}`, "Depths CyclesAtLeast10000 ProportionalRutDepth");
                            populateFieldIfExists(repls[i], `Cycles10000Value${type}${i+1}`, "Depths CyclesAtLeast10000 RutDepth");
                        } else if (selectionSBV==="CyclesLessThan10000"){
                            document.getElementById(`ProportionalAndRutDepth${type}${i+1}`).value = `Unreached${type}`;
                            populateFieldIfExists(repls[i], `CyclesNumber${type}${i+1}`, "Depths CyclesLessThan10000 FinalCyclesNumber");
                            populateFieldIfExists(repls[i], `Value${type}prop${i+1}`, "Depths CyclesLessThan10000 ProportionalRutDepth");
                            populateFieldIfExists(repls[i], `Value${type}${i+1}`, "Depths CyclesLessThan10000 RutDepth");
                        }
                        document.getElementById(`ProportionalAndRutDepth${type}${i+1}`).onchange(); 
                    } 
                }
                populateFieldIfExists(repls[i], `BulkDensityValue${type}${i+1}`, "Value");
                populateFieldIfExists(repls[i], `BulkDensityMethod${type}${i+1}`, "MethodofMeasurement");
                populateFieldIfExists(repls[i], `AirVoids${type}${i+1}`, "AirVoids");
                populateFieldIfExists(repls[i], `MineralAggregateVoids${type}${i+1}`, "MineralAggregateVoids");
                populateFieldIfExists(repls[i], `VoidsFilledWithBitumen${type}${i+1}`, "VoidsFilledWithBitumen");

                const SBpoints = Array.from(repls[i].querySelectorAll("RutDepthVersusCyclesGraph Point")).map(point => {
                    const cycleSSB = point.querySelector("Cycle").textContent.trim();
                    const rutSSB = point.querySelector("RutDepth").textContent.trim();
                    return `${cycleSSB},${rutSSB}`;
                }).join("; ");
                document.getElementById(`Cycle${type}g${i+1}`).value = SBpoints.split(';').map(pair => pair.split(',')[0]).join('; ');
                document.getElementById(`RutDepth${type}g${i+1}`).value = SBpoints.split(';').map(pair => pair.split(',')[1]).join('; '); 
            }
        }   



        var modal = document.getElementById("modal");
        var span = document.getElementsByClassName("close")[0];
    
        function closeModal() {modal.style.display = "none";}

        span.onclick = closeModal;
        window.onclick = function(event) {if (event.target == modal) {closeModal();}}

        function EntryError(message, elementId) {
            var errorMessage = document.getElementById("error-message");
            errorMessage.textContent = message;
            modal.style.display = "block";
            var errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function() {errorElement.focus();}, 1000);
            }
        }
