// Functions concerning upload
function updateFileName() {
    var fileInput = document.getElementById('xmlFileExt');
    var fileNameSpan = document.getElementById('FileExtName');
    fileNameSpan.innerHTML = '<b>' + fileInput.files[0].name + '</b>';
}

document.addEventListener('DOMContentLoaded', function() {   
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
});

function uploadXML(uploadType) {

    if (uploadType === 'UE') {
        const fileInput = document.getElementById('xmlFileExt');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const xmlDoc = new DOMParser().parseFromString(e.target.result, 'text/xml');
                TestSelectionFromId(Testid(xmlDoc.documentElement.nodeName));
                processXML(xmlDoc);
                document.getElementById('FileDbName').innerHTML = `<b>Choose Record from AsphaltMine Database</b>`;
            };
            reader.readAsText(file);
        } else {
            console.error('No XML file selected.');
            EntryError(`Please select a record to upload`,`xmlFileExt`);
            return false;}
    } else if (uploadType === 'UD') {
        if (dt_content) {
           dt_content = dt_content.trim();
           if (dt_content.startsWith('"') && dt_content.endsWith('"')) {dt_content = dt_content.slice(1, -1);}
            const xmlDoc = new DOMParser().parseFromString(dt_content, 'text/xml');
            processXML(xmlDoc);
            document.getElementById('FileExtName').innerHTML = `<b>Choose Record from your own Device</b>`;
        } else {
            console.error('No XML file selected.');
            EntryError(`Please select a record to upload`,`xmlFileExt`);
            return false;
        }
    }  else if (uploadType === 'E') {
        if (dataContent) {
            const xmlDoc = new DOMParser().parseFromString(dataContent, 'text/xml');
            processXML(xmlDoc);
        } else {
            console.error('No XML file selected.');
            EntryError(`Please select a record to edit`,`xmlFileExt`);
            return false;
        }
    }

    function processXML(xmlDoc) {

        document.getElementById('myForm').reset();

        var CheckedElement= document.querySelectorAll('#field-U input[type="checkbox"]:not(#select-all)')
        var CheckedElementsID = [];
        CheckedElement.forEach(function(checkbox) {if (checkbox.checked) {CheckedElementsID.push(checkbox.id);}});

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
                        populateField(xmlDoc, "firstAuthor", "ArticleInJournal FirstAuthor");
                        const coAuthors = xmlDoc.querySelectorAll("ArticleInJournal Co-Authors");
                        const coAuthorsText = Array.from(coAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                        document.getElementById("coAuthors").value = coAuthorsText;
                        populateField(xmlDoc, "articleTitle", "ArticleInJournal ArticleTitle");
                        populateField(xmlDoc, "journalTitle", "JournalTitle");
                        populateField(xmlDoc, "journalVolumeNumber", "JournalVolumeNumber");
                        populateField(xmlDoc, "journalIssueNumber", "JournalIssueNumber");
                        populateField(xmlDoc, "articleStartingPage", "ArticleStartingPage");
                        populateField(xmlDoc, "articleEndingPage", "ArticleEndingPage");
                        populateField(xmlDoc, "articleNumber", "ArticleNumber");
                        populateField(xmlDoc, "Artyear", "ArticleInJournal Year");
                        populateField(xmlDoc, "publisher", "ArticleInJournal Publisher");
                        populateField(xmlDoc, "doi", "ArticleInJournal DOI");
                        populateField(xmlDoc, "issn", "ArticleInJournal ISSN");

                    }if (completeDataRecordUp==="ArticleInConferenceProceedings"){
                        document.getElementById('completerecordType').value = 'ArticleInConferenceProceedings';
                        populateField(xmlDoc, "confFirstAuthor", "ArticleInConferenceProceedings FirstAuthor");
                        const coAuthors = xmlDoc.querySelectorAll("ArticleInConferenceProceedings Co-Authors");
                        const coAuthorsText = Array.from(coAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                        document.getElementById("confCoAuthors").value = coAuthorsText;
                        populateField(xmlDoc, "confArticleTitle", "ArticleInConferenceProceedings ArticleTitle");
                        populateField(xmlDoc, "confConferenceTitle", "ConferenceTitle");
                        populateField(xmlDoc, "confConferenceCity", "ConferenceCity");
                        populateField(xmlDoc, "confConferenceCountry", "ConferenceCountry");
                        populateField(xmlDoc, "confProceedingsTitle", "ConferenceProceedingsTitle");
                        populateField(xmlDoc, "confProceedingsVolumeNumber", "ConferenceProceedingsVolumeNumber");
                        populateField(xmlDoc, "confProceedingsStartingPage", "ConferenceProceedingsStartingPage");
                        populateField(xmlDoc, "confProceedingsEndingPage", "ConferenceProceedingsEndingPage");
                        populateField(xmlDoc, "confYear", "ArticleInConferenceProceedings Year");
                        populateField(xmlDoc, "confPublisher", "ArticleInConferenceProceedings Publisher");
                        populateField(xmlDoc, "confDOI", "ArticleInConferenceProceedings DOI");

                    }if (completeDataRecordUp==="BookPublication"){
                        document.getElementById('completerecordType').value = 'BookPublication';
                        populateField(xmlDoc, "bookFirstAuthor", "BookPublication FirstAuthor");
                        const bookCoAuthors = xmlDoc.querySelectorAll("BookPublication Co-Authors");
                        const bookCoAuthorsText = Array.from(bookCoAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                        document.getElementById("bookCoAuthors").value = bookCoAuthorsText;
                        populateField(xmlDoc, "bookTitle", "BookTitle");
                        populateField(xmlDoc, "bookChapterTitle", "BookChapterTitle");
                        populateField(xmlDoc, "bookChapterNumber", "ChapterNumber");
                        populateField(xmlDoc, "bookEditors", "Editors");
                        populateField(xmlDoc, "bookEditionNumber", "EditionNumber");
                        populateField(xmlDoc, "bookChapterStartingPage", "ChapterStartingPage");
                        populateField(xmlDoc, "bookChapterEndingPage", "ChapterEndingPage");
                        populateField(xmlDoc, "bookYear", "BookPublication Year");
                        populateField(xmlDoc, "bookPublisher", "BookPublication Publisher");
                        populateField(xmlDoc, "bookDOI", "BookPublication DOI");
                        populateField(xmlDoc, "bookISBN", "ISBN");

                    }if (completeDataRecordUp==="PublishedReport"){
                        document.getElementById('completerecordType').value = 'PublishedReport';
                        populateField(xmlDoc, "reportFirstAuthor", "PublishedReport FirstAuthor");
                        const reportCoAuthors = xmlDoc.querySelectorAll("PublishedReport Co-Authors");
                        const reportCoAuthorsText = Array.from(reportCoAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                        document.getElementById("reportCoAuthors").value = reportCoAuthorsText;
                        populateField(xmlDoc, "reportTitle", "PublishedReport ReportTitle");
                        populateField(xmlDoc, "reportNumber", "PublishedReport ReportNumber");
                        populateField(xmlDoc, "reportYear", "PublishedReport Year");
                        populateField(xmlDoc, "reportPublisher", "PublishedReport Publisher");
                        populateField(xmlDoc, "reportDOI", "PublishedReport DOI");
                        populateField(xmlDoc, "reportURL", "PublishedReport URL");

                    }if (completeDataRecordUp==="UnpublishedReport"){
                        document.getElementById('completerecordType').value = 'UnpublishedReport';
                        populateField(xmlDoc, "unreportFirstAuthor", "UnpublishedReport FirstAuthor");
                        const unreportCoAuthors = xmlDoc.querySelectorAll("UnpublishedReport Co-Authors");
                        const unreportCoAuthorsText = Array.from(unreportCoAuthors).map(coAuthor => coAuthor.textContent.trim()).join("; ");
                        document.getElementById("unreportCoAuthors").value = unreportCoAuthorsText;
                        populateField(xmlDoc, "unreportTitle", "UnpublishedReport ReportTitle");
                        populateField(xmlDoc, "unreportYear", "UnpublishedReport Year");
                        populateField(xmlDoc, "unreportURL", "UnpublishedReport URL");                            

                    }if (completeDataRecordUp==="OtherBibliographic"){
                        document.getElementById('completerecordType').value = 'OtherBibliographic';
                        populateField(xmlDoc, "otherBibInformation", "OtherBibliographic Information");

                    }
                    document.getElementById('completerecordType').onchange();
                }
            }

            // Populate Notes element
            populateField(xmlDoc, 'NotesSourceContent', 'DataSource Notes');
        }

        //////////////////////////
        ////////////////////////// 
        
        if(CheckedElementsID.includes("select-mixture")) {

            // Populate MixtureIdentifiers element
            populateField(xmlDoc, "MixtureID", "MixtureIdentifiers MixtureID");
            populateField(xmlDoc, "MixtureType", "MixtureIdentifiers MixtureType");

            // Populate MixtureRecipe element
            const Apoints = Array.from(xmlDoc.querySelectorAll("Composition AggregatesDistribution Point")).map(point => {
                const size = point.querySelector("Size").textContent.trim();
                const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                return `${size},${percentageDistribution}`;
            }).join("; ");
            document.getElementById("SizeAgg").value = Apoints.split(';').map(pair => pair.split(',')[0]).join('; ');
            document.getElementById("PercentageAgg").value = Apoints.split(';').map(pair => pair.split(',')[1]).join('; ');

            populateField(xmlDoc, "AggregatesComposition", "Composition Aggregates");
            populateField(xmlDoc, "VirginFiller", "Composition VirginFiller");
            populateField(xmlDoc, "RecoveredFiller", "Composition RecoveredFiller");
            populateField(xmlDoc, "ReclaimedAsphalt", "Composition ReclaimedAsphalt");
            populateField(xmlDoc, "TargetBinderGrade", "Composition Binder TargetBinderGrade");
            populateField(xmlDoc, "Binder", "Composition Binder BinderContent");

            populateField(xmlDoc, "MaximumDensityValue", "MixtureMaximumDensity");               

            // Populate VirginAggregates element within MixtureComponentProperties element
            const VApoints = Array.from(xmlDoc.querySelectorAll("MixtureComponentProperties VirginAggregates GrainSizeDistribution Point")).map(point => {
                const size = point.querySelector("Size").textContent.trim();
                const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                return `${size},${percentageDistribution}`;
            }).join("; ");
            document.getElementById("SizeVirgin").value = VApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
            document.getElementById("PercentageVirgin").value = VApoints.split(';').map(pair => pair.split(',')[1]).join('; ');
            populateField(xmlDoc, "NatureVA", "MixtureComponentProperties VirginAggregates Nature");
            populateField(xmlDoc, "LosAngelesTestResultVA", "MixtureComponentProperties VirginAggregates LosAngelesTestResult");
            populateField(xmlDoc, "FlakinessIndexVA", "MixtureComponentProperties VirginAggregates FlakinessIndex");
            populateField(xmlDoc, "ShapeIndexVA", "MixtureComponentProperties VirginAggregates ShapeIndex");
            populateField(xmlDoc, "FlowCoefficientVA", "MixtureComponentProperties VirginAggregates FlowCoefficient");
            populateField(xmlDoc, "NordicAbrasionValueVA", "MixtureComponentProperties VirginAggregates NordicAbrasionValue");
            populateField(xmlDoc, "SemiCrushedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed SemiCrushedParticles");
            populateField(xmlDoc, "TotallyCrushedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed TotallyCrushedParticles");
            populateField(xmlDoc, "SemiRoundedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed SemiRoundedParticles");
            populateField(xmlDoc, "TotallyRoundedParticlesVA", "MixtureComponentProperties VirginAggregates RoundedAndCrushed TotallyRoundedParticles");
            populateField(xmlDoc, "BitumenCoverageDegreeValueVA", "MixtureComponentProperties VirginAggregates BitumenCoverageDegree BitumenCoverageDegreeValue");
            populateField(xmlDoc, "BitumenCoverageDegreeMethodVA", "MixtureComponentProperties VirginAggregates BitumenCoverageDegree BitumenCoverageDegreeMethod");
            XMLaddProperties(xmlDoc,'field9-2','VA','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties VirginAggregates');

            // Populate Filler element within MixtureComponentProperties element
            populateField(xmlDoc, "NatureFiller", "MixtureComponentProperties Filler Nature");
            populateField(xmlDoc, "StiffeningEffectFiller", "MixtureComponentProperties Filler StiffeningEffect");
            populateField(xmlDoc, "ParticleDensityFillerValue", "MixtureComponentProperties Filler ParticleDensity");
            populateField(xmlDoc, "WaterSusceptibilityFiller", "MixtureComponentProperties Filler WaterSusceptibility");
            XMLaddProperties(xmlDoc,'field10-2','Filler','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties Filler');

            // Populate VirginBinder elemen
            populateField(xmlDoc, "PenetrationVB", "MixtureComponentProperties VirginBinder Penetration");
            populateField(xmlDoc, "SofteningPointVB", "MixtureComponentProperties VirginBinder SofteningPoint");
            populateField(xmlDoc, "KinematicViscosityVB", "MixtureComponentProperties VirginBinder Viscosities KinematicViscosity");
            populateField(xmlDoc, "DynamicViscosityVB", "MixtureComponentProperties VirginBinder Viscosities DynamicViscosity");
            populateField(xmlDoc, "RotationalDynamicViscosityVB", "MixtureComponentProperties VirginBinder Viscosities RotationalDynamicViscosity");
            populateField(xmlDoc, "TemperatureVB", "MixtureComponentProperties VirginBinder BTSV Temperature");
            populateField(xmlDoc, "PhaseAngleVB", "MixtureComponentProperties VirginBinder BTSV PhaseAngle");
            XMLaddProperties(xmlDoc,'field11-1-1','BTSVVB','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties VirginBinder BTSV');
            populateField(xmlDoc, "AveragePercentRecovery100PaVB", "MixtureComponentProperties VirginBinder MSCRT AveragePercentRecovery100Pa");
            populateField(xmlDoc, "AveragePercentRecovery3200PaVB", "MixtureComponentProperties VirginBinder MSCRT AveragePercentRecovery3200Pa");
            populateField(xmlDoc, "RecoveryPercentageDifferenceVB", "MixtureComponentProperties VirginBinder MSCRT RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepCompliance100PaVB", "MixtureComponentProperties VirginBinder MSCRT NonrecoverableCreepCompliance100Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliance3200PaVB", "MixtureComponentProperties VirginBinder MSCRT NonrecoverableCreepCompliance3200Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceVB", "MixtureComponentProperties VirginBinder MSCRT NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "SpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress SpecifiedStress");
            populateField(xmlDoc, "AveragePercentRecoverySpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
            populateField(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressVB", "MixtureComponentProperties VirginBinder MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "FraassBreakingPointVB", "MixtureComponentProperties VirginBinder FraassBreakingPoint");
            populateField(xmlDoc, "MassLossVB", "MixtureComponentProperties VirginBinder AgingResistance MassLoss");
            populateField(xmlDoc, "PenetrationChangeVB", "MixtureComponentProperties VirginBinder AgingResistance RetainedPenetration");
            populateField(xmlDoc, "SofteningPointIncreaseVB", "MixtureComponentProperties VirginBinder AgingResistance SofteningPointIncrease");
            populateField(xmlDoc, "ElasticRecoveryVB", "MixtureComponentProperties VirginBinder ElasticRecovery");
            populateField(xmlDoc, "CohesionEnergyVB", "MixtureComponentProperties VirginBinder CohesionEnergy");
            populateField(xmlDoc, "SolubilityVB", "MixtureComponentProperties VirginBinder Solubility");
            XMLaddProperties(xmlDoc,'field11-4','VB','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties VirginBinder');

            // Populate Additive element
            XMLaddAdditive(xmlDoc,'fld14','form-group TwoColumn dynamicPro','form-group grid-wrap-one-row TwoColumn dynamicPro')

            // Populate ReclaimedAsphalt element including ReclaimedAsphaltBinder child element
            const RApoints = Array.from(xmlDoc.querySelectorAll("MixtureComponentProperties ReclaimedAsphalt GrainSizeDistribution Point")).map(point => {
                const size = point.querySelector("Size").textContent.trim();
                const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                return `${size},${percentageDistribution}`;
            }).join("; ");
            document.getElementById("SizeReclaimed").value = RApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
            document.getElementById("PercentageReclaimed").value = RApoints.split(';').map(pair => pair.split(',')[1]).join('; ');
            populateField(xmlDoc, "NatureRA", "MixtureComponentProperties ReclaimedAsphalt Nature");
            populateField(xmlDoc, "LosAngelesTestResultRA", "MixtureComponentProperties ReclaimedAsphalt LosAngelesTestResult");
            populateField(xmlDoc, "FlakinessIndexRA", "MixtureComponentProperties ReclaimedAsphalt FlakinessIndex");
            populateField(xmlDoc, "ShapeIndexRA", "MixtureComponentProperties ReclaimedAsphalt ShapeIndex");
            populateField(xmlDoc, "FlowCoefficientRA", "MixtureComponentProperties ReclaimedAsphalt FlowCoefficient");
            populateField(xmlDoc, "NordicAbrasionValueRA", "MixtureComponentProperties ReclaimedAsphalt NordicAbrasionValue");
            populateField(xmlDoc, "SemiCrushedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed SemiCrushedParticles");
            populateField(xmlDoc, "TotallyCrushedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed TotallyCrushedParticles");
            populateField(xmlDoc, "SemiRoundedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed SemiRoundedParticles");
            populateField(xmlDoc, "TotallyRoundedParticlesRA", "MixtureComponentProperties ReclaimedAsphalt RoundedAndCrushed TotallyRoundedParticles");

            populateField(xmlDoc, "PercentageContentRB", "MixtureComponentProperties ReclaimedAsphaltBinder BinderContent");
            populateField(xmlDoc, "PenetrationRB", "MixtureComponentProperties ReclaimedAsphaltBinder Penetration");
            populateField(xmlDoc, "SofteningPointRB", "MixtureComponentProperties ReclaimedAsphaltBinder SofteningPoint");
            populateField(xmlDoc, "KinematicViscosityRB", "MixtureComponentProperties ReclaimedAsphaltBinder Viscosities KinematicViscosity");
            populateField(xmlDoc, "DynamicViscosityRB", "MixtureComponentProperties ReclaimedAsphaltBinder Viscosities DynamicViscosity");
            populateField(xmlDoc, "RotationalDynamicViscosityRB", "MixtureComponentProperties ReclaimedAsphaltBinder Viscosities RotationalDynamicViscosity");
            populateField(xmlDoc, "TemperatureRB", "MixtureComponentProperties ReclaimedAsphaltBinder BTSV Temperature");
            populateField(xmlDoc, "PhaseAngleRB", "MixtureComponentProperties ReclaimedAsphaltBinder BTSV PhaseAngle");
            XMLaddProperties(xmlDoc,'field13-1-1','BTSVRB','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties ReclaimedAsphaltBinder BTSV');
            populateField(xmlDoc, "AveragePercentRecovery100PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT AveragePercentRecovery100Pa");
            populateField(xmlDoc, "AveragePercentRecovery3200PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT AveragePercentRecovery3200Pa");
            populateField(xmlDoc, "RecoveryPercentageDifferenceRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepCompliance100PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonrecoverableCreepCompliance100Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliance3200PaRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonrecoverableCreepCompliance3200Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "SpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress SpecifiedStress");
            populateField(xmlDoc, "AveragePercentRecoverySpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
            populateField(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressRB", "MixtureComponentProperties ReclaimedAsphaltBinder MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "FraassBreakingPointRB", "MixtureComponentProperties ReclaimedAsphaltBinder FraassBreakingPoint");
            populateField(xmlDoc, "ElasticRecoveryRB", "MixtureComponentProperties ReclaimedAsphaltBinder ElasticRecovery");
            populateField(xmlDoc, "CohesionEnergyRB", "MixtureComponentProperties ReclaimedAsphaltBinder CohesionEnergy");
            populateField(xmlDoc, "SolubilityRB", "MixtureComponentProperties ReclaimedAsphaltBinder Solubility");
            XMLaddProperties(xmlDoc,'field13-3','RB','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties ReclaimedAsphaltBinder');

            populateField(xmlDoc, "BitumenCoverageDegreeValueRA", "MixtureComponentProperties ReclaimedAsphalt BitumenCoverageDegree BitumenCoverageDegreeValue");
            populateField(xmlDoc, "BitumenCoverageDegreeMethodRA", "MixtureComponentProperties ReclaimedAsphalt BitumenCoverageDegree BitumenCoverageDegreeMethod");
            XMLaddProperties(xmlDoc,'field12-2','RA','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties ReclaimedAsphalt');

            // Populate PreMixingBinderBlend element
            populateField(xmlDoc, "PenetrationPmB", "MixtureComponentProperties PreMixingBinderBlend Penetration");
            populateField(xmlDoc, "SofteningPointPmB", "MixtureComponentProperties PreMixingBinderBlend SofteningPoint");
            populateField(xmlDoc, "KinematicViscosityPmB", "MixtureComponentProperties PreMixingBinderBlend Viscosities KinematicViscosity");
            populateField(xmlDoc, "DynamicViscosityPmB", "MixtureComponentProperties PreMixingBinderBlend Viscosities DynamicViscosity");
            populateField(xmlDoc, "RotationalDynamicViscosityPmB", "MixtureComponentProperties PreMixingBinderBlend Viscosities RotationalDynamicViscosity");
            populateField(xmlDoc, "TemperaturePmB", "MixtureComponentProperties PreMixingBinderBlend BTSV Temperature");
            populateField(xmlDoc, "PhaseAnglePmB", "MixtureComponentProperties PreMixingBinderBlend BTSV PhaseAngle");
            XMLaddProperties(xmlDoc,'field15-1-1','BTSVPmB','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties PreMixingBinderBlend BTSV');
            populateField(xmlDoc, "AveragePercentRecovery100PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT AveragePercentRecovery100Pa");
            populateField(xmlDoc, "AveragePercentRecovery3200PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT AveragePercentRecovery3200Pa");
            populateField(xmlDoc, "RecoveryPercentageDifferencePmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepCompliance100PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonrecoverableCreepCompliance100Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliance3200PaPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonrecoverableCreepCompliance3200Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferencePmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "SpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress SpecifiedStress");
            populateField(xmlDoc, "AveragePercentRecoverySpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
            populateField(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressPmB", "MixtureComponentProperties PreMixingBinderBlend MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "FraassBreakingPointPmB", "MixtureComponentProperties PreMixingBinderBlend FraassBreakingPoint");
            populateField(xmlDoc, "MassLossPmB", "MixtureComponentProperties PreMixingBinderBlend AgingResistance MassLoss");
            populateField(xmlDoc, "PenetrationChangePmB", "MixtureComponentProperties PreMixingBinderBlend AgingResistance RetainedPenetration");
            populateField(xmlDoc, "SofteningPointIncreasePmB", "MixtureComponentProperties PreMixingBinderBlend AgingResistance SofteningPointIncrease");
            populateField(xmlDoc, "ElasticRecoveryPmB", "MixtureComponentProperties PreMixingBinderBlend ElasticRecovery");
            populateField(xmlDoc, "CohesionEnergyPmB", "MixtureComponentProperties PreMixingBinderBlend CohesionEnergy");
            populateField(xmlDoc, "SolubilityPmB", "MixtureComponentProperties PreMixingBinderBlend Solubility");
            XMLaddProperties(xmlDoc,'field15-4','PmB','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties PreMixingBinderBlend');

            // Populate OtherMaterials element within MixtureComponentProperties element
            populateField(xmlDoc, "NameOtherMaterials", "MixtureComponentProperties OtherMaterials Name");
            XMLaddProperties(xmlDoc,'fieldN-1','OtherMaterials','form-group grid-wrap-one-row TwoColumn dynamicPro','MixtureComponentProperties OtherMaterials');

            // Populate Aggregates element within RecoveredMaterials element
            const CApoints = Array.from(xmlDoc.querySelectorAll("RecoveredMaterials Aggregates GrainSizeDistribution Point")).map(point => {
                const size = point.querySelector("Size").textContent.trim();
                const percentageDistribution = point.querySelector("PercentageDistribution").textContent.trim();
                return `${size},${percentageDistribution}`;
            }).join("; ");
            document.getElementById("SizeCA").value = CApoints.split(';').map(pair => pair.split(',')[0]).join('; ');
            document.getElementById("PercentageCA").value = CApoints.split(';').map(pair => pair.split(',')[1]).join('; ');    
            populateField(xmlDoc, "NatureCA", "RecoveredMaterials Aggregates Nature");
            populateField(xmlDoc, "LosAngelesTestResultCA", "RecoveredMaterials Aggregates LosAngelesTestResult");
            populateField(xmlDoc, "FlakinessIndexCA", "RecoveredMaterials Aggregates FlakinessIndex");
            populateField(xmlDoc, "ShapeIndexCA", "RecoveredMaterials Aggregates ShapeIndex");
            populateField(xmlDoc, "FlowCoefficientCA", "RecoveredMaterials Aggregates FlowCoefficient");
            populateField(xmlDoc, "NordicAbrasionValueCA", "RecoveredMaterials Aggregates NordicAbrasionValue");
            populateField(xmlDoc, "SemiCrushedParticlesCA", "RecoveredMaterials Aggregates RoundedAndCrushed SemiCrushedParticles");
            populateField(xmlDoc, "TotallyCrushedParticlesCA", "RecoveredMaterials Aggregates RoundedAndCrushed TotallyCrushedParticles");
            populateField(xmlDoc, "SemiRoundedParticlesCA", "RecoveredMaterials Aggregates RoundedAndCrushed SemiRoundedParticles");
            populateField(xmlDoc, "TotallyRoundedParticlesCA", "RecoveredMaterials Aggregates RoundedAndCrushed TotallyRoundedParticles");
            populateField(xmlDoc, "BitumenCoverageDegreeValueCA", "RecoveredMaterials Aggregates BitumenCoverageDegree BitumenCoverageDegreeValue");
            populateField(xmlDoc, "BitumenCoverageDegreeMethodCA", "RecoveredMaterials Aggregates BitumenCoverageDegree BitumenCoverageDegreeMethod");
            XMLaddProperties(xmlDoc,'field17-2','CA','form-group grid-wrap-one-row TwoColumn dynamicPro','RecoveredMaterials Aggregates');             

            // Populate Binder element within RecoveredMaterials element
            populateField(xmlDoc, "PercentageContentCB", "RecoveredMaterials Binder BinderContent");
            populateField(xmlDoc, "PenetrationCB", "RecoveredMaterials Binder Penetration");
            populateField(xmlDoc, "SofteningPointCB", "RecoveredMaterials Binder SofteningPoint");
            populateField(xmlDoc, "KinematicViscosityCB", "RecoveredMaterials Binder Viscosities KinematicViscosity");
            populateField(xmlDoc, "DynamicViscosityCB", "RecoveredMaterials Binder Viscosities DynamicViscosity");
            populateField(xmlDoc, "RotationalDynamicViscosityCB", "RecoveredMaterials Binder Viscosities RotationalDynamicViscosity");
            populateField(xmlDoc, "TemperatureCB", "RecoveredMaterials Binder BTSV Temperature");
            populateField(xmlDoc, "PhaseAngleCB", "RecoveredMaterials Binder BTSV PhaseAngle");
            XMLaddProperties(xmlDoc,'field18-1-1','BTSVCB','form-group grid-wrap-one-row TwoColumn dynamicPro','RecoveredMaterials Binder BTSV');
            populateField(xmlDoc, "AveragePercentRecovery100PaCB", "RecoveredMaterials Binder MSCRT AveragePercentRecovery100Pa");
            populateField(xmlDoc, "AveragePercentRecovery3200PaCB", "RecoveredMaterials Binder MSCRT AveragePercentRecovery3200Pa");
            populateField(xmlDoc, "RecoveryPercentageDifferenceCB", "RecoveredMaterials Binder MSCRT RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepCompliance100PaCB", "RecoveredMaterials Binder MSCRT NonrecoverableCreepCompliance100Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliance3200PaCB", "RecoveredMaterials Binder MSCRT NonrecoverableCreepCompliance3200Pa");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceCB", "RecoveredMaterials Binder MSCRT NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "SpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress SpecifiedStress");
            populateField(xmlDoc, "AveragePercentRecoverySpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress AveragePercentRecoverySpecifiedStress");
            populateField(xmlDoc, "RecoveryPercentageDifferenceSpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress RecoveryPercentageDifference");
            populateField(xmlDoc, "NonrecoverableCreepComplianceSpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress NonrecoverableCreepComplianceSpecifiedStress");
            populateField(xmlDoc, "NonrecoverableCreepCompliancePercentageDifferenceSpecifiedStressCB", "RecoveredMaterials Binder MSCRT NonstandardStress NonrecoverableCreepCompliancePercentageDifference");
            populateField(xmlDoc, "FraassBreakingPointCB", "RecoveredMaterials Binder FraassBreakingPoint");
            populateField(xmlDoc, "MassLossCB", "RecoveredMaterials Binder AgingResistance MassLoss");
            populateField(xmlDoc, "PenetrationChangeCB", "RecoveredMaterials Binder AgingResistance RetainedPenetration");
            populateField(xmlDoc, "SofteningPointIncreaseCB", "RecoveredMaterials Binder AgingResistance SofteningPointIncrease");
            populateField(xmlDoc, "ElasticRecoveryCB", "RecoveredMaterials Binder ElasticRecovery");
            populateField(xmlDoc, "CohesionEnergyCB", "RecoveredMaterials Binder CohesionEnergy");
            populateField(xmlDoc, "SolubilityCB", "RecoveredMaterials Binder Solubility");
            XMLaddProperties(xmlDoc,'field18-4','CB','form-group grid-wrap-one-row TwoColumn dynamicPro','RecoveredMaterials Binder');

            // Populate Mixing element
            populateField(xmlDoc, "MixingMethod", "Mixing MixingMethod");
            populateField(xmlDoc, "TypeofMixer", "Mixing TypeofMixer");
            populateField(xmlDoc, "MixingSequence", "Mixing MixingSequence");
            populateField(xmlDoc, "MixtureTemperature", "Mixing MixtureTemperature");
            populateField(xmlDoc, "ReclaimedAsphaltTemperature", "Mixing ReclaimedAsphaltTemperature");
            populateField(xmlDoc, "MixingDurationValue", "Mixing MixingDuration");
            XMLaddmixingproperty(xmlDoc,'field16-3', 'form-group grid-wrap-one-row TwoColumn dynamicPro');

            // Populate Notes element
            populateField(xmlDoc, 'NotesMixtureContent', 'Mixture Notes');

        }

        //////////////////////////
        //////////////////////////

        if(CheckedElementsID.includes("select-sample")) {

            // Populate SampleProperties element
            const Sampleprep = xmlDoc.querySelector('SampleProperties SamplePreparation');
            if (Sampleprep) {
                const selectedprep = Sampleprep.firstElementChild.nodeName;
                if(selectedprep ==="PavementCoring"){
                    document.getElementById('Sampling').value = 'PavementCoring';
                    populateField(xmlDoc, "PavingDate", "SampleProperties SamplePreparation PavementCoring Coring PavingDate");
                    populateField(xmlDoc, "CoringDate", "SampleProperties SamplePreparation PavementCoring Coring CoringDate");
                    populateField(xmlDoc, "CoringLocation", "SampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                } else if(selectedprep ==="LooseMixture") {
                    document.getElementById('Sampling').value = 'LooseMixture';
                    populateField(xmlDoc, "CompactionDate", "SampleProperties SamplePreparation LooseMixture Compaction CompactionDate");
                    populateField(xmlDoc, "RollerType", "SampleProperties SamplePreparation LooseMixture Compaction RollerType");
                    populateField(xmlDoc, "CompactionTarget", "SampleProperties SamplePreparation LooseMixture Compaction CompactionTarget");
                    populateField(xmlDoc, "CompactionTemperature", "SampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                }
                document.getElementById('Sampling').onchange();
            }
            populateField(xmlDoc, "MixtureAgingDurationShort", "SampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureShort", "SampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationLong", "SampleProperties MixtureAging LooseMixture LongTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureLong", "SampleProperties MixtureAging LooseMixture LongTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB1", "SampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB1", "SampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB2", "SampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB2", "SampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingTemperature");
            populateField(xmlDoc, "StorageConditions", "SampleProperties StorageConditions");

            const Sampleprepmar = xmlDoc.querySelector('MarshallSampleProperties SamplePreparation');
            if (Sampleprepmar) {
                const selectedprepmar = Sampleprepmar.firstElementChild.nodeName;
                if(selectedprepmar ==="PavementCoring"){
                    document.getElementById('SamplingMar').value = 'PavementCoring';
                    populateField(xmlDoc, "PavingDateMar", "MarshallSampleProperties SamplePreparation PavementCoring Coring PavingDate");
                    populateField(xmlDoc, "CoringDateMar", "MarshallSampleProperties SamplePreparation PavementCoring Coring CoringDate");
                    populateField(xmlDoc, "CoringLocationMar", "MarshallSampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                } else if(selectedprepmar ==="LooseMixture") {
                    document.getElementById('SamplingMar').value = 'LooseMixture';
                    populateField(xmlDoc, "CompactionTemperatureMar", "MarshallSampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                    populateField(xmlDoc, "BlowsNumberMar", "MarshallSampleProperties SamplePreparation LooseMixture Compaction BlowsNumber");
                }
                document.getElementById('SamplingMar').onchange();
            }
            populateField(xmlDoc, "MixtureAgingDurationShortMar", "MarshallSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureShortMar", "MarshallSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationLongMar", "MarshallSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureLongMar", "MarshallSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB1Mar", "MarshallSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB1Mar", "MarshallSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB2Mar", "MarshallSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB2Mar", "MarshallSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingTemperature");
            populateField(xmlDoc, "StorageConditionsMar", "MarshallSampleProperties StorageConditions");

            const Sampleprepits = xmlDoc.querySelector('ITSSampleProperties SamplePreparation');
            if (Sampleprepits) {
                const selectedprepmar = Sampleprepits.firstElementChild.nodeName;
                if(selectedprepmar ==="PavementCoring"){
                    document.getElementById('SamplingITS').value = 'PavementCoring';
                    populateField(xmlDoc, "PavingDateITS", "ITSSampleProperties SamplePreparation PavementCoring Coring PavingDate");
                    populateField(xmlDoc, "CoringDateITS", "ITSSampleProperties SamplePreparation PavementCoring Coring CoringDate");
                    populateField(xmlDoc, "CoringLocationITS", "ITSSampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                } else if(selectedprepmar ==="LooseMixture") {
                    document.getElementById('SamplingITS').value = 'LooseMixture';
                    populateField(xmlDoc, "CompactionTemperatureITS", "ITSSampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                    populateField(xmlDoc, "BlowsNumberITS", "ITSSampleProperties SamplePreparation LooseMixture Compaction BlowsNumber");
                }
                document.getElementById('SamplingITS').onchange();
            }
            populateField(xmlDoc, "MixtureAgingDurationShortITS", "ITSSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureShortITS", "ITSSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationLongITS", "ITSSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureLongITS", "ITSSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB1ITS", "ITSSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB1ITS", "ITSSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB2ITS", "ITSSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB2ITS", "ITSSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingTemperature");
            populateField(xmlDoc, "StorageConditionsITS", "ITSSampleProperties StorageConditions");

            // Populate TSRSTSampleProperties element
            const Samplepreptsrst = xmlDoc.querySelector('TSRSTSampleProperties SamplePreparation');
            if (Samplepreptsrst) {
                const selectedprep = Samplepreptsrst.firstElementChild.nodeName;
                if(selectedprep ==="PavementCoring"){
                    document.getElementById('SamplingTSRST').value = 'PavementCoring';
                    populateField(xmlDoc, "PavingDateTSRST", "TSRSTSampleProperties SamplePreparation PavementCoring Coring PavingDate");
                    populateField(xmlDoc, "CoringDateTSRST", "TSRSTSampleProperties SamplePreparation PavementCoring Coring CoringDate");
                    populateField(xmlDoc, "CoringLocationTSRST", "TSRSTSampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                } else if(selectedprep ==="LooseMixture") {
                    document.getElementById('SamplingTSRST').value = 'LooseMixture';
                    populateField(xmlDoc, "CompactionDateTSRST", "TSRSTSampleProperties SamplePreparation LooseMixture Compaction CompactionDate");
                    populateField(xmlDoc, "RollerTypeTSRST", "TSRSTSampleProperties SamplePreparation LooseMixture Compaction RollerType");
                    populateField(xmlDoc, "CompactionTargetTSRST", "TSRSTSampleProperties SamplePreparation LooseMixture Compaction CompactionTarget");
                    populateField(xmlDoc, "CompactionTemperatureTSRST", "TSRSTSampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                }
                document.getElementById('SamplingTSRST').onchange();
            }
            populateField(xmlDoc, "MixtureAgingDurationShortTSRST", "TSRSTSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureShortTSRST", "TSRSTSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationLongTSRST", "TSRSTSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureLongTSRST", "TSRSTSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB1TSRST", "TSRSTSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB1TSRST", "TSRSTSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB2TSRST", "TSRSTSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB2TSRST", "TSRSTSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingTemperature");
            populateField(xmlDoc, "StorageConditionsTSRST", "TSRSTSampleProperties StorageConditions");

            // Populate UTSTSampleProperties element
            const Samplepreputst = xmlDoc.querySelector('UTSTSampleProperties SamplePreparation');
            if (Samplepreputst) {
                const selectedprep = Samplepreputst.firstElementChild.nodeName;
                if(selectedprep ==="PavementCoring"){
                    document.getElementById('SamplingUTST').value = 'PavementCoring';
                    populateField(xmlDoc, "PavingDateUTST", "UTSTSampleProperties SamplePreparation PavementCoring Coring PavingDate");
                    populateField(xmlDoc, "CoringDateUTST", "UTSTSampleProperties SamplePreparation PavementCoring Coring CoringDate");
                    populateField(xmlDoc, "CoringLocationUTST", "UTSTSampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                } else if(selectedprep ==="LooseMixture") {
                    document.getElementById('SamplingUTST').value = 'LooseMixture';
                    populateField(xmlDoc, "CompactionDateUTST", "UTSTSampleProperties SamplePreparation LooseMixture Compaction CompactionDate");
                    populateField(xmlDoc, "RollerTypeUTST", "UTSTSampleProperties SamplePreparation LooseMixture Compaction RollerType");
                    populateField(xmlDoc, "CompactionTargetUTST", "UTSTSampleProperties SamplePreparation LooseMixture Compaction CompactionTarget");
                    populateField(xmlDoc, "CompactionTemperatureUTST", "UTSTSampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                }
                document.getElementById('SamplingUTST').onchange();
            }
            populateField(xmlDoc, "MixtureAgingDurationShortUTST", "UTSTSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureShortUTST", "UTSTSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationLongUTST", "UTSTSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureLongUTST", "UTSTSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB1UTST", "UTSTSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB1UTST", "UTSTSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB2UTST", "UTSTSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB2UTST", "UTSTSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingTemperature");
            populateField(xmlDoc, "StorageConditionsUTST", "UTSTSampleProperties StorageConditions");

            // Populate StiffnessSampleProperties element
            const Sampleprepstiff = xmlDoc.querySelector('StiffnessSampleProperties SamplePreparation');
            if (Sampleprepstiff) {
                const selectedprep = Sampleprepstiff.firstElementChild.nodeName;
                if(selectedprep ==="PavementCoring"){
                    document.getElementById('SamplingStiff').value = 'PavementCoring';
                    populateField(xmlDoc, "PavingDateStiff", "StiffnessSampleProperties SamplePreparation PavementCoring Coring PavingDate");
                    populateField(xmlDoc, "CoringDateStiff", "StiffnessSampleProperties SamplePreparation PavementCoring Coring CoringDate");
                    populateField(xmlDoc, "CoringLocationStiff", "StiffnessSampleProperties SamplePreparation PavementCoring Coring CoringLocation");
                } else if(selectedprep ==="LooseMixture") {
                    document.getElementById('SamplingStiff').value = 'LooseMixture';
                    populateField(xmlDoc, "CompactionDateStiff", "StiffnessSampleProperties SamplePreparation LooseMixture Compaction CompactionDate");
                    populateField(xmlDoc, "CompactorTypeStiff", "StiffnessSampleProperties SamplePreparation LooseMixture Compaction CompactorType");
                    populateField(xmlDoc, "CompactionTargetStiff", "StiffnessSampleProperties SamplePreparation LooseMixture Compaction CompactionTarget");
                    populateField(xmlDoc, "CompactionTemperatureStiff", "StiffnessSampleProperties SamplePreparation LooseMixture Compaction CompactionTemperature");
                    document.getElementById('CompactorTypeStiff').onchange();  
                }
                document.getElementById('SamplingStiff').onchange();
            }
            populateField(xmlDoc, "MixtureAgingDurationShortStiff", "StiffnessSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureShortStiff", "StiffnessSampleProperties MixtureAging LooseMixture ShortTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationLongStiff", "StiffnessSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureLongStiff", "StiffnessSampleProperties MixtureAging LooseMixture LongTerm MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB1Stiff", "StiffnessSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB1Stiff", "StiffnessSampleProperties MixtureAging CompactedSpecimen ProcedureB1 MixtureAgingTemperature");
            populateField(xmlDoc, "MixtureAgingDurationB2Stiff", "StiffnessSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingDuration");
            populateField(xmlDoc, "MixtureAgingTemperatureB2Stiff", "StiffnessSampleProperties MixtureAging CompactedSpecimen ProcedureB2 MixtureAgingTemperature");
            populateField(xmlDoc, "StorageConditionsStiff", "StiffnessSampleProperties StorageConditions");
        }

        if(CheckedElementsID.includes("select-results")) {              
            // Populate Results element
            populateField(xmlDoc, "TestTemperature", "Results TestTemperature");
            const resultsselection = xmlDoc.querySelector('Procedure') ? xmlDoc.querySelector('Procedure').firstElementChild.nodeName : '';
            if(resultsselection){
                if (resultsselection==="LargeOrExtraLargeDevices"){
                    document.getElementById('ResultsSelection').value = 'LargeOrExtraLargeDevices';
                    populateField(xmlDoc, "MeanThicknessL", "LargeOrExtraLargeDevices Mean MeanThickness");
                    populateField(xmlDoc, "CyclesNumberL", "LargeOrExtraLargeDevices Mean CyclesNumber");
                    populateField(xmlDoc, "MeanProportionalRutDepthL", "LargeOrExtraLargeDevices Mean MeanProportionalRutDepth");
                    populateField(xmlDoc, "BulkDensityValueL", "LargeOrExtraLargeDevices Mean BulkDensity Value");
                    populateField(xmlDoc, "BulkDensityMethodL", "LargeOrExtraLargeDevices Mean BulkDensity MethodofMeasurement");
                    populateField(xmlDoc, "AirVoidsL", "LargeOrExtraLargeDevices Mean Voids AirVoids");
                    populateField(xmlDoc, "MineralAggregateVoidsL", "LargeOrExtraLargeDevices Mean Voids MineralAggregateVoids");
                    populateField(xmlDoc, "VoidsFilledWithBitumenL", "LargeOrExtraLargeDevices Mean Voids VoidsFilledWithBitumen");
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
                    populateField(xmlDoc, "MeanThicknessSA", "SmallSizeDeviceMethod_A_Air Mean MeanThickness");
                    populateField(xmlDoc, "MeanWheelTrackingRateSA", "SmallSizeDeviceMethod_A_Air Mean MeanWheelTrackingRate");
                    populateField(xmlDoc, "CyclesNumberSA", "SmallSizeDeviceMethod_A_Air Mean CyclesNumber");
                    populateField(xmlDoc, "MeanRutDepthSA", "SmallSizeDeviceMethod_A_Air Mean MeanRutDepth");
                    populateField(xmlDoc, "BulkDensityValueSA", "SmallSizeDeviceMethod_A_Air Mean BulkDensity Value");
                    populateField(xmlDoc, "BulkDensityMethodSA", "SmallSizeDeviceMethod_A_Air Mean BulkDensity MethodofMeasurement");
                    populateField(xmlDoc, "AirVoidsSA", "SmallSizeDeviceMethod_A_Air Mean Voids AirVoids");
                    populateField(xmlDoc, "MineralAggregateVoidsSA", "SmallSizeDeviceMethod_A_Air Mean Voids MineralAggregateVoids");
                    populateField(xmlDoc, "VoidsFilledWithBitumenSA", "SmallSizeDeviceMethod_A_Air Mean Voids VoidsFilledWithBitumen");
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
                    populateField(xmlDoc, "MeanThicknessSBA", "SmallSizeDeviceMethod_B_Air Mean MeanThickness");
                    populateField(xmlDoc, "MeanWheelTrackingSlopeSBA", "SmallSizeDeviceMethod_B_Air Mean MeanWheelTrackingSlope");
                    populateField(xmlDoc, "CyclesNumberSBA", "SmallSizeDeviceMethod_B_Air Mean CyclesNumber");
                    populateField(xmlDoc, "MeanProportionalRutDepthSBA", "SmallSizeDeviceMethod_B_Air Mean MeanProportionalRutDepth");
                    populateField(xmlDoc, "MeanRutDepthSBA", "SmallSizeDeviceMethod_B_Air Mean MeanRutDepth");
                    populateField(xmlDoc, "BulkDensityValueSBA", "SmallSizeDeviceMethod_B_Air Mean BulkDensity Value");
                    populateField(xmlDoc, "BulkDensityMethodSBA", "SmallSizeDeviceMethod_B_Air Mean BulkDensity MethodofMeasurement");
                    populateField(xmlDoc, "AirVoidsSBA", "SmallSizeDeviceMethod_B_Air Mean Voids AirVoids");
                    populateField(xmlDoc, "MineralAggregateVoidsSBA", "SmallSizeDeviceMethod_B_Air Mean Voids MineralAggregateVoids");
                    populateField(xmlDoc, "VoidsFilledWithBitumenSBA", "SmallSizeDeviceMethod_B_Air Mean Voids VoidsFilledWithBitumen");
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
                    populateField(xmlDoc, "MeanThicknessSBW", "SmallSizeDeviceMethod_B_Water Mean MeanThickness");
                    populateField(xmlDoc, "MeanWheelTrackingSlopeSBW", "SmallSizeDeviceMethod_B_Water Mean MeanWheelTrackingSlope");
                    populateField(xmlDoc, "CyclesNumberSBW", "SmallSizeDeviceMethod_B_Water Mean CyclesNumber");
                    populateField(xmlDoc, "MeanProportionalRutDepthSBW", "SmallSizeDeviceMethod_B_Water Mean MeanProportionalRutDepth");
                    populateField(xmlDoc, "MeanRutDepthSBW", "SmallSizeDeviceMethod_B_Water Mean MeanRutDepth");
                    populateField(xmlDoc, "BulkDensityValueSBW", "SmallSizeDeviceMethod_B_Water Mean BulkDensity Value");
                    populateField(xmlDoc, "BulkDensityMethodSBW", "SmallSizeDeviceMethod_B_Water Mean BulkDensity MethodofMeasurement");
                    populateField(xmlDoc, "AirVoidsSBW", "SmallSizeDeviceMethod_B_Water Mean Voids AirVoids");
                    populateField(xmlDoc, "MineralAggregateVoidsSBW", "SmallSizeDeviceMethod_B_Water Mean Voids MineralAggregateVoids");
                    populateField(xmlDoc, "VoidsFilledWithBitumenSBW", "SmallSizeDeviceMethod_B_Water Mean Voids VoidsFilledWithBitumen");
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

            // Populate MarshallResults element
            populateField(xmlDoc, "StabilityMar", "MarshallResults Stability");
            populateField(xmlDoc, "FlowMar", "MarshallResults Flow");
            populateField(xmlDoc, "TangentialFlowMar", "MarshallResults TangentialFlow");
            populateField(xmlDoc, "TotalFlowMar", "MarshallResults TotalFlow");
            populateField(xmlDoc, "MarshallQuotientMar", "MarshallResults MarshallQuotient");
            populateField(xmlDoc, "BulkDensityValueMar", "MarshallResults BulkDensity Value");
            populateField(xmlDoc, "BulkDensityMethodMar", "MarshallResults BulkDensity MethodofMeasurement");
            populateField(xmlDoc, "AirVoidsMar", "MarshallResults Voids AirVoids");
            populateField(xmlDoc, "MineralAggregateVoidsMar", "MarshallResults Voids MineralAggregateVoids");
            populateField(xmlDoc, "VoidsFilledWithBitumenMar", "MarshallResults Voids VoidsFilledWithBitumen");

            // Populate ITSResults element
            populateField(xmlDoc, "TestTemperatureITS", "ITSResults TestTemperature");
            populateField(xmlDoc, "IndirectTensileStrengthRatioITS", "ITSResults IndirectTensileStrengthRatio");
            populateField(xmlDoc, "IndirectTensileStrengthITSDry", "ITSResults Dry Mean IndirectTensileStrength");
            populateField(xmlDoc, "HeightITSDry", "ITSResults Dry Mean SampleDimensions Height");
            populateField(xmlDoc, "DiameterITSDry", "ITSResults Dry Mean SampleDimensions Diameter");
            populateField(xmlDoc, "BulkDensityValueITSDry", "ITSResults Dry Mean BulkDensity Value");
            populateField(xmlDoc, "BulkDensityMethodITSDry", "ITSResults Dry Mean BulkDensity MethodofMeasurement");
            populateField(xmlDoc, "AirVoidsITSDry", "ITSResults Dry Mean Voids AirVoids");
            populateField(xmlDoc, "MineralAggregateVoidsITSDry", "ITSResults Dry Mean Voids MineralAggregateVoids");
            populateField(xmlDoc, "VoidsFilledWithBitumenITSDry", "ITSResults Dry Mean Voids VoidsFilledWithBitumen");
            XMLaddReplicationsITS(xmlDoc,"ITSDry", "field21-12", "field21-12","form-group");
            populateField(xmlDoc, "IndirectTensileStrengthITSWet", "ITSResults Wet Mean IndirectTensileStrength");
            populateField(xmlDoc, "HeightITSWet", "ITSResults Wet Mean SampleDimensions Height");
            populateField(xmlDoc, "DiameterITSWet", "ITSResults Wet Mean SampleDimensions Diameter");
            populateField(xmlDoc, "BulkDensityValueITSWet", "ITSResults Wet Mean BulkDensity Value");
            populateField(xmlDoc, "BulkDensityMethodITSWet", "ITSResults Wet Mean BulkDensity MethodofMeasurement");
            populateField(xmlDoc, "AirVoidsITSWet", "ITSResults Wet Mean Voids AirVoids");
            populateField(xmlDoc, "MineralAggregateVoidsITSWet", "ITSResults Wet Mean Voids MineralAggregateVoids");
            populateField(xmlDoc, "VoidsFilledWithBitumenITSWet", "ITSResults Wet Mean Voids VoidsFilledWithBitumen");
            XMLaddReplicationsITS(xmlDoc,"ITSWet", "field21-14", "field21-14","form-group");

            // Populate TSRSTResults element
            populateField(xmlDoc, "StartTemperatureTSRST", "TSRSTResults StartTemperature");
            populateField(xmlDoc, "TemperatureRateTSRST", "TSRSTResults TemperatureRate");
            populateField(xmlDoc, "FailureStressTSRST", "TSRSTResults FailureStress");
            populateField(xmlDoc, "FailureTemperatureTSRST", "TSRSTResults FailureTemperature");
            const sampledimtsrst= xmlDoc.querySelector('TSRSTResults SampleDimensions');
            if (sampledimtsrst) {
                const sampleshptsrst = sampledimtsrst.firstElementChild.nodeName;
                if(sampleshptsrst ==="Prismatic"){
                    document.getElementById('SampleDimensionsTSRST').value = 'Prismatic';
                    populateField(xmlDoc, "LengthpTSRST", "TSRSTResults SampleDimensions Prismatic Length");
                    populateField(xmlDoc, "HeightpTSRST", "TSRSTResults SampleDimensions Prismatic Height");
                    populateField(xmlDoc, "WidthpTSRST", "TSRSTResults SampleDimensions Prismatic Width");
                } else if(sampleshptsrst ==="Cylindrical") {
                    document.getElementById('SampleDimensionsTSRST').value = 'Cylindrical';
                    populateField(xmlDoc, "LengthcTSRST", "TSRSTResults SampleDimensions Cylindrical Length");
                    populateField(xmlDoc, "DiametercTSRST", "TSRSTResults SampleDimensions Cylindrical Diameter");
                }
                document.getElementById('SampleDimensionsTSRST').onchange();
            }
            populateField(xmlDoc, "BulkDensityValueTSRST", "TSRSTResults BulkDensity Value");
            populateField(xmlDoc, "BulkDensityMethodTSRST", "TSRSTResults BulkDensity MethodofMeasurement");
            populateField(xmlDoc, "AirVoidsTSRST", "TSRSTResults Voids AirVoids");
            populateField(xmlDoc, "MineralAggregateVoidsTSRST", "TSRSTResults Voids MineralAggregateVoids");
            populateField(xmlDoc, "VoidsFilledWithBitumenTSRST", "TSRSTResults Voids VoidsFilledWithBitumen");
            const TSRSTpoints = Array.from(xmlDoc.querySelectorAll("TSRSTResults CryogenicStressVersusTemperatureGraph Point")).map(point => {
                const temptsrstg = point.querySelector("Temperature").textContent.trim();
                const stresstsrstg = point.querySelector("Stress").textContent.trim();
                return `${temptsrstg},${stresstsrstg}`;
            }).join("; ");
            document.getElementById("TemperatureTSRSTg").value = TSRSTpoints.split(';').map(pair => pair.split(',')[0]).join('; ');
            document.getElementById("StressTSRSTg").value = TSRSTpoints.split(';').map(pair => pair.split(',')[1]).join('; ');     

            // Populate UTSTResults element
            populateField(xmlDoc, "TestTemperatureUTST", "UTSTResults TestTemperature");
            populateField(xmlDoc, "AppliedDeformationRateUTST", "UTSTResults AppliedDeformationRate");
            populateField(xmlDoc, "TensileStrengthUTST", "UTSTResults TensileStrength");
            populateField(xmlDoc, "FailureStrainUTST", "UTSTResults FailureStrain");
            const sampledimutst= xmlDoc.querySelector('UTSTResults SampleDimensions');
            if (sampledimutst) {
                const sampleshputst = sampledimutst.firstElementChild.nodeName;
                if(sampleshputst ==="Prismatic"){
                    document.getElementById('SampleDimensionsUTST').value = 'Prismatic';
                    populateField(xmlDoc, "LengthpUTST", "UTSTResults SampleDimensions Prismatic Length");
                    populateField(xmlDoc, "HeightpUTST", "UTSTResults SampleDimensions Prismatic Height");
                    populateField(xmlDoc, "WidthpUTST", "UTSTResults SampleDimensions Prismatic Width");
                } else if(sampleshputst ==="Cylindrical") {
                    document.getElementById('SampleDimensionsUTST').value = 'Cylindrical';
                    populateField(xmlDoc, "LengthcUTST", "UTSTResults SampleDimensions Cylindrical Length");
                    populateField(xmlDoc, "DiametercUTST", "UTSTResults SampleDimensions Cylindrical Diameter");
                }
                document.getElementById('SampleDimensionsUTST').onchange();
            }
            populateField(xmlDoc, "BulkDensityValueUTST", "UTSTResults BulkDensity Value");
            populateField(xmlDoc, "BulkDensityMethodUTST", "UTSTResults BulkDensity MethodofMeasurement");
            populateField(xmlDoc, "AirVoidsUTST", "UTSTResults Voids AirVoids");
            populateField(xmlDoc, "MineralAggregateVoidsUTST", "UTSTResults Voids MineralAggregateVoids");
            populateField(xmlDoc, "VoidsFilledWithBitumenUTST", "UTSTResults Voids VoidsFilledWithBitumen");

            // Populate StiffnessResults element
            populateField(xmlDoc, "TestTypeStiff", "StiffnessResults TestType");
            ReadStiffnessCases(xmlDoc, "field21-19-0","form-group");
            const sampledimstiff= xmlDoc.querySelector('StiffnessResults SampleDimensions');
            if (sampledimstiff) {
                const sampleshpstiff = sampledimstiff.firstElementChild.nodeName;
                if(sampleshpstiff ==="Prismatic"){
                    populateField(xmlDoc, "LengthpStiff", "StiffnessResults SampleDimensions Prismatic Length");
                    populateField(xmlDoc, "HeightpStiff", "StiffnessResults SampleDimensions Prismatic Height");
                    populateField(xmlDoc, "WidthpStiff", "StiffnessResults SampleDimensions Prismatic Width");
                } else if(sampleshpstiff ==="Cylindrical") {
                    populateField(xmlDoc, "LengthcStiff", "StiffnessResults SampleDimensions Cylindrical Length");
                    populateField(xmlDoc, "DiametercStiff", "StiffnessResults SampleDimensions Cylindrical Diameter");
                } else if(sampleshpstiff ==="Trapezoidal") {
                    populateField(xmlDoc, "LengthtStiff", "StiffnessResults SampleDimensions Trapezoidal Length");
                    populateField(xmlDoc, "BigbasetStiff", "StiffnessResults SampleDimensions Trapezoidal Bigbase");
                    populateField(xmlDoc, "SmallbasetStiff", "StiffnessResults SampleDimensions Trapezoidal Smallbase");
                    populateField(xmlDoc, "WidthtStiff", "StiffnessResults SampleDimensions Trapezoidal Width");
                }
                document.getElementById('TestTypeStiff').onchange();
            }
            populateField(xmlDoc, "BulkDensityValueStiff", "StiffnessResults BulkDensity Value");
            populateField(xmlDoc, "BulkDensityMethodStiff", "StiffnessResults BulkDensity MethodofMeasurement");
            populateField(xmlDoc, "AirVoidsStiff", "StiffnessResults Voids AirVoids");
            populateField(xmlDoc, "MineralAggregateVoidsStiff", "StiffnessResults Voids MineralAggregateVoids");
            populateField(xmlDoc, "VoidsFilledWithBitumenStiff", "StiffnessResults Voids VoidsFilledWithBitumen");
        }

        if(CheckedElementsID.includes("select-sample") || CheckedElementsID.includes("select-result")) {

            // Populate Notes element
            populateField(xmlDoc, 'NotesResultsContent', 'RuttingTestResults Notes');
            populateField(xmlDoc, 'NotesResultsContentMar', 'MarshallTestResults Notes');
            populateField(xmlDoc, 'NotesResultsContentITS', 'ITSTestResults Notes');
            populateField(xmlDoc, 'NotesResultsContentTSRST', 'TSRSTestResults Notes');
            populateField(xmlDoc, 'NotesResultsContentUTST', 'UTSTestResults Notes');
            populateField(xmlDoc, 'NotesResultsContentStiff', 'StiffnessTestResults Notes');
        }

        //////////////////////////
        //////////////////////////

        if(CheckedElementsID.includes("select-notes")) {

            // Populate Notes element
            populateField(xmlDoc, 'NotesGeneralContent', 'RuttingExp > Notes');
            populateField(xmlDoc, 'NotesGeneralContent', 'MarshallExp > Notes');
            populateField(xmlDoc, 'NotesGeneralContent', 'ITSExp > Notes');
            populateField(xmlDoc, 'NotesGeneralContent', 'TSRSTExp > Notes');
            populateField(xmlDoc, 'NotesGeneralContent', 'UTSTExp > Notes');
            populateField(xmlDoc, 'NotesGeneralContent', 'StiffnessExp > Notes');

        }

        //////////////////////////
        //////////////////////////

        //  Close Empty fields
        CloseEmptyFields();

        };
}


function populateField(xmlDoc, fieldId, xmlElementName) {
    const xmlElement = xmlDoc.querySelector(xmlElementName);
    if (xmlElement) {document.getElementById(fieldId).value = xmlElement.textContent;}
}

function XMLaddProperties(xmlDoc,containerId, type, theclass, path) {
    const properties = xmlDoc.querySelectorAll(`${path} > AdditionalProperties`);              
    for (let i = 0; i < properties.length; i++) {
        populateField(properties[i], `TestMethod${type}_${i+1}`, "Property");
        populateField(properties[i], `Value${type}_${i+1}`, "Value");
        populateField(properties[i], `Unit${type}_${i+1}`, "Unit");
        if (i+1 < properties.length){addadditional(containerId, type, theclass);}              
    }
}

function XMLaddAdditive(xmlDoc, containerId, theclass, theaddclass) {
    const additives = xmlDoc.querySelectorAll(`MixtureComponentProperties Additive`);
    for (let i = 0; i < additives.length; i++) {
        populateField(additives[i], `TypeAddtv_${i+1}`, "Type");
        populateField(additives[i], `PercentageMassAddtv_${i+1}`, "PercentageMass");
        const addprop = additives[i].querySelectorAll("AdditionalProperties");
        for (let j = 0; j < addprop.length; j++) {
            populateField(addprop[j], `TestMethodAddtv_${i+1}_${j+1}`, "Property");
            populateField(addprop[j], `ValueAddtv_${i+1}_${j+1}`, "Value");
            populateField(addprop[j], `UnitAddtv_${i+1}_${j+1}`, "Unit");
            if (j + 1 < addprop.length) {addadditional(`${containerId}-${i+1}`, `Addtv_${i+1}`, theaddclass);}
        }
        if (i + 1 < additives.length) {addAdditive(containerId, theclass);
            const viewable = document.getElementById(`adtvtab-${i+2}`);
            if (viewable) {viewable.click();}
        }
    }
}

function XMLaddmixingproperty(xmlDoc,containerId, theclass) {
    const properties = xmlDoc.querySelectorAll(`Mixing OtherMixingProperty`);              
    for (let i = 0; i < properties.length; i++) {
        populateField(properties[i], `OtherMixingPropertyName_${i+1}`, "Name");
        populateField(properties[i], `OtherMixingPropertyValue_${i+1}`, "Value");
        populateField(properties[i], `OtherMixingPropertyUnit_${i+1}`, "Unit");
        if (i+1 < properties.length){addmixdesign(containerId, theclass);}              
    }
}

function XMLaddReplicationsL(xmlDoc, containerId, theclass) {
    const repls = xmlDoc.querySelectorAll(`Results Procedure LargeOrExtraLargeDevices Replication`);     
    for (let i = 0; i < repls.length; i++) {
        addLarge(containerId, theclass);
        populateField(repls[i], `ThicknessL${i+1}`, "Thickness");
        populateField(repls[i], `CyclesNumberL${i+1}`, "CyclesNumber");
        populateField(repls[i], `ProportionalRutDepthL${i+1}`, ":scope > ProportionalRutDepth");
        populateField(repls[i], `BulkDensityValueL${i+1}`, "Value");
        populateField(repls[i], `BulkDensityMethodL${i+1}`, "MethodofMeasurement");
        populateField(repls[i], `AirVoidsL${i+1}`, "AirVoids");
        populateField(repls[i], `MineralAggregateVoidsL${i+1}`, "MineralAggregateVoids");
        populateField(repls[i], `VoidsFilledWithBitumenL${i+1}`, "VoidsFilledWithBitumen");
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
        populateField(repls[i], `ThicknessSA${i+1}`, "Thickness");
        populateField(repls[i], `WheelTrackingRateSA${i+1}`, "WheelTrackingRate");
        populateField(repls[i], `CyclesNumberSA${i+1}`, "FinalCyclesNumber");
        populateField(repls[i], `RutDepthSA${i+1}`, "RutDepth");
        populateField(repls[i], `BulkDensityValueSA${i+1}`, "Value");
        populateField(repls[i], `BulkDensityMethodSA${i+1}`, "MethodofMeasurement");
        populateField(repls[i], `AirVoidsSA${i+1}`, "AirVoids");
        populateField(repls[i], `MineralAggregateVoidsSA${i+1}`, "MineralAggregateVoids");
        populateField(repls[i], `VoidsFilledWithBitumenSA${i+1}`, "VoidsFilledWithBitumen");

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
        populateField(repls[i], `Thickness${type}${i+1}`, "Thickness");
        populateField(repls[i], `WheelTrackingSlope${type}${i+1}`, "WheelTrackingSlope");
        populateField(repls[i], `CyclesNumber${type}${i+1}`, "FinalCyclesNumber");
        populateField(repls[i], `Value${type}prop${i+1}`, "ProportionalRutDepth");
        populateField(repls[i], `Value${type}${i+1}`, "RutDepth");
        populateField(repls[i], `BulkDensityValue${type}${i+1}`, "Value");
        populateField(repls[i], `BulkDensityMethod${type}${i+1}`, "MethodofMeasurement");
        populateField(repls[i], `AirVoids${type}${i+1}`, "AirVoids");
        populateField(repls[i], `MineralAggregateVoids${type}${i+1}`, "MineralAggregateVoids");
        populateField(repls[i], `VoidsFilledWithBitumen${type}${i+1}`, "VoidsFilledWithBitumen");

        const SBpoints = Array.from(repls[i].querySelectorAll("RutDepthVersusCyclesGraph Point")).map(point => {
            const cycleSSB = point.querySelector("Cycle").textContent.trim();
            const rutSSB = point.querySelector("RutDepth").textContent.trim();
            return `${cycleSSB},${rutSSB}`;
        }).join("; ");
        document.getElementById(`Cycle${type}g${i+1}`).value = SBpoints.split(';').map(pair => pair.split(',')[0]).join('; ');
        document.getElementById(`RutDepth${type}g${i+1}`).value = SBpoints.split(';').map(pair => pair.split(',')[1]).join('; '); 
    }
}     

function XMLaddReplicationsITS(xmlDoc, type, maincontainerId, containerId, theclass) {
    let name = type === "ITSDry" ? "Dry" : type === "ITSWet" ? "Wet" : "Error";
    const repls = xmlDoc.querySelectorAll(`ITSResults ${name} Replication`);     
    for (let i = 0; i < repls.length; i++) {
        addITSReplication(maincontainerId,containerId, type, theclass);
        populateField(repls[i], `IndirectTensileStrength${type}${i+1}`, "IndirectTensileStrength");
        populateField(repls[i], `Height${type}${i+1}`, "Height");
        populateField(repls[i], `Diameter${type}${i+1}`, "Diameter");
        populateField(repls[i], `BulkDensityValue${type}${i+1}`, "Value");
        populateField(repls[i], `BulkDensityMethod${type}${i+1}`, "MethodofMeasurement");
        populateField(repls[i], `AirVoids${type}${i+1}`, "AirVoids");
        populateField(repls[i], `MineralAggregateVoids${type}${i+1}`, "MineralAggregateVoids");
        populateField(repls[i], `VoidsFilledWithBitumen${type}${i+1}`, "VoidsFilledWithBitumen");
    }
}     

function ReadStiffnessCases(xmlDoc, containerId, theclass) {
    const rsltstf = xmlDoc.querySelectorAll(`StiffnessResults Results`);     
    for (let i = 0; i < rsltstf.length; i++) {
        populateField(rsltstf[i], `TestTemperatureStiff${i+1}`, "TestTemperature");
        const rsltstfcase = rsltstf[i].querySelectorAll(`Case`);
        document.getElementById(`changefrequencytimeStiff${i+1}`).click();
        if (rsltstf[i].querySelector('Case LoadingTime')){freqtimecase = "LoadingTime";
        } else {freqtimecase = "Frequency";}  
        document.getElementById(`SelectFrequencyTimeStiff${i+1}`).value=freqtimecase;
        document.getElementById(`changestraindisplacementStiff${i+1}`).click();
        if (rsltstf[i].querySelector('Case Displacement')){strndisplcase = "Displacement";
        } else {strndisplcase = "Strain";}   
        document.getElementById(`SelectStrainDisplacementStiff${i+1}`).value=strndisplcase;
        for (let j = 0; j < 4; j++) {
            if(rsltstfcase[j]){
                populateField(rsltstfcase[j], `FrequencyTimeStiff${i+1}_${j+1}`, freqtimecase);
                populateField(rsltstfcase[j], `StiffnessModulusStiff${i+1}_${j+1}`, "StiffnessModulus");
                populateField(rsltstfcase[j], `StrainDisplacementStiff${i+1}_${j+1}`, strndisplcase);
            }
        }
        if(i+1 < rsltstf.length){addStiffReplication(containerId, theclass);}
    }
    if(document.getElementById(`SelectStrainDisplacementStiff${rsltstf.length}`)){
        document.getElementById(`SelectStrainDisplacementStiff${rsltstf.length}`).blur();
    }
}  

// Upload Form Functionality
var selectedSource = 'N';
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('xmlFileDb').addEventListener('click', function() {selectedSource = 'D';});
    document.getElementById('xmlFileExt').addEventListener('change', function() {selectedSource = 'E';});
});

function Load() {
    if (selectedSource === 'D') {
        OpenTabs("UD");
    } else if (selectedSource === 'E') {
        OpenTabs("UE");
    } else {
        console.error('No XML file selected.');
        EntryError(`Please select a record to upload`,`xmlFileExt`);
        return false;
    }
}
