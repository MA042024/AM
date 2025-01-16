function generateXML(gentype, workspaceId, workspaceLabel) {

    //////////////////////////
    //////////////////////////

    // Create XML document object
    testcasevalue = RetrieveTestsList();

    // A single form submission can produce more than one record (one per
    // selected test), so the "all records saved" toast and the workspace
    // move both wait until every save request has come back.
    const gvSavedIds = [];
    let gvSavedCount = 0;
    let gvFailedCount = 0;
    let gvSaveDenied = false;
    const gvTotalRecords = RootNodes(testcasevalue).length;

    function checkAllGVSaved() {
        if (gvSavedCount + gvFailedCount !== gvTotalRecords) return;
        if (gvFailedCount > 0) {
            if (gvSavedCount === 0) {
                ShowPopMsg(gvSaveDenied ? 'Den' : 'SaveError');
            } else {
                ShowPopMsg('SaveError', `${gvSavedCount} of ${gvTotalRecords} records saved, ${gvFailedCount} failed.`);
            }
            return;
        }
        if (workspaceId && gvSavedIds.length) {
            $.ajax({
                url: '/bulkupload/assign-workspace/',
                type: 'POST',
                headers: { 'X-CSRFToken': csrftoken },
                traditional: false,
                data: { workspace_id: workspaceId, 'data_ids[]': gvSavedIds },
                success: function(response) {
                    const notAssigned = gvSavedIds.length - (response.assigned || 0);
                    if (notAssigned) {
                        ShowPopMsg('SaveWarning', `${notAssigned} of ${gvSavedIds.length} records could not be moved into ${workspaceLabel}.`);
                    } else {
                        ShowPopMsg('S', `Assigned to ${workspaceLabel}`);
                    }
                },
                error: function() {
                    ShowPopMsg('SaveWarning', `Saved, but could not be moved into ${workspaceLabel}.`);
                }
            });
        } else {
            ShowPopMsg('S');
        }
    }

    let xmlDoc = document.implementation.createDocument("", "PlaceHolder", null);

    if (CheckSelectedTest(testcasevalue ,"allcases")){  
        // Populate DataSource element
        var dataSource = xmlDoc.createElement("DataSource");
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
    }

    //////////////////////////
    //////////////////////////

    if (CheckSelectedTest(testcasevalue ,"grpRutMarIts")){
        // Populate Mixture element
        var mixture = xmlDoc.createElement("Mixture");

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

        let aggdist = xmlDoc.createElement("AggregatesDistribution");
        composition.appendChild(aggdist);
        let sizeA = document.getElementById("SizeAgg").value.split(";").map(v => v.trim()).filter(Boolean);
        let percentageA = document.getElementById("PercentageAgg").value.split(";").map(v => v.trim()).filter(Boolean);
        if (sizeA.length !== percentageA.length) 
        { EntryError("Aggregates distribution mismatch: Size and Proportion values must have the same count.","field6-0");return false;}
        for (let i = 0; i < sizeA.length; i++) {
            let point = xmlDoc.createElement("Point");
            let sizeAvalue = sizeA[i];
            if (isNaN(parseFloat(sizeAvalue)) || parseFloat(sizeAvalue) < 0 || !/^\d+(\.\d+)?$/.test(sizeAvalue)) 
            { EntryError(`Invalid Size in Aggregates: ${sizeAvalue}`,"SizeAgg");return false;}
            point.appendChild(createTextElement(xmlDoc, "Size", parseFloat(sizeAvalue)));
            let percentageAvalue = percentageA[i];
            if (isNaN(parseFloat(percentageAvalue)) || parseFloat(percentageAvalue) < 0 || parseFloat(percentageAvalue) > 100 || !/^\d+(\.\d+)?$/.test(percentageAvalue))
            { EntryError(`Invalid Proportion in Aggregates: ${percentageAvalue}`,"PercentageAgg");return false;}
            point.appendChild(createTextElement(xmlDoc, "PercentageDistribution", parseFloat(percentageAvalue)));
            aggdist.appendChild(point);
        }
        composition.appendChild(createTextElement(xmlDoc, "VirginFiller", document.getElementById("VirginFiller").value));
        composition.appendChild(createTextElement(xmlDoc, "RecoveredFiller", document.getElementById("RecoveredFiller").value));
        composition.appendChild(createTextElement(xmlDoc, "ReclaimedAsphalt", document.getElementById("ReclaimedAsphalt").value));
        let bindercomposition = xmlDoc.createElement("Binder");
        composition.appendChild(bindercomposition);
        bindercomposition.appendChild(createTextElement(xmlDoc, "TargetBinderGrade", document.getElementById("TargetBinderGrade").value));
        bindercomposition.appendChild(createTextElement(xmlDoc, "BinderContent", document.getElementById("Binder").value));                  
        
        mixturecomposition.appendChild(createTextElement(xmlDoc, "MixtureMaximumDensity", document.getElementById("MaximumDensityValue").value));

        // Populate MixtureComponentProperties element
        let mixturecomponentsproperties = xmlDoc.createElement("MixtureComponentProperties");
        mixture.appendChild(mixturecomponentsproperties);
        
        // Populate VirginAggregates element
        let virginaggregates = xmlDoc.createElement("VirginAggregates");
        mixturecomponentsproperties.appendChild(virginaggregates);
        let grainsizedistributionVA = xmlDoc.createElement("GrainSizeDistribution");
        virginaggregates.appendChild(grainsizedistributionVA);
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
            grainsizedistributionVA.appendChild(point);
        }
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
        let bitumencoverageVA = xmlDoc.createElement("BitumenCoverageDegree");
        virginaggregates.appendChild(bitumencoverageVA);
        bitumencoverageVA.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegreeValue", document.getElementById("BitumenCoverageDegreeValueVA").value));
        bitumencoverageVA.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegreeMethod", document.getElementById("BitumenCoverageDegreeMethodVA").value));
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
        let viscositiesVB = xmlDoc.createElement("Viscosities");
        virginbinder.appendChild(viscositiesVB);
        viscositiesVB.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityVB").value));
        viscositiesVB.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityVB").value));
        viscositiesVB.appendChild(createTextElement(xmlDoc, "RotationalDynamicViscosity", document.getElementById("RotationalDynamicViscosityVB").value));
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
        agingresistanceVB.appendChild(createTextElement(xmlDoc, "MassLoss", document.getElementById("MassLossVB").value));
        agingresistanceVB.appendChild(createTextElement(xmlDoc, "RetainedPenetration", document.getElementById("PenetrationChangeVB").value));
        agingresistanceVB.appendChild(createTextElement(xmlDoc, "SofteningPointIncrease", document.getElementById("SofteningPointIncreaseVB").value));
        virginbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryVB").value));
        virginbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyVB").value));
        virginbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityVB").value));
        addAdditionalProperties('VB', xmlDoc, 'field11-4', virginbinder);

        // Populate Additive element
        addAdditionalAdditive("Addtv", xmlDoc, "fld14", mixturecomponentsproperties);

        // Populate ReclaimedAsphalt element including ReclaimedAsphaltBinder child element
        let reclaimedasphalt = xmlDoc.createElement("ReclaimedAsphalt");
        mixturecomponentsproperties.appendChild(reclaimedasphalt);
        let grainsizedistributionRA = xmlDoc.createElement("GrainSizeDistribution");
        reclaimedasphalt.appendChild(grainsizedistributionRA);
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
            grainsizedistributionRA.appendChild(point);
        }     
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
        reclaimedbinder.appendChild(createTextElement(xmlDoc, "BinderContent", document.getElementById("PercentageContentRB").value));
        reclaimedbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationRB").value));
        reclaimedbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointRB").value));
        let viscositiesRB = xmlDoc.createElement("Viscosities");
        reclaimedbinder.appendChild(viscositiesRB);
        viscositiesRB.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityRB").value));
        viscositiesRB.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityRB").value));
        viscositiesRB.appendChild(createTextElement(xmlDoc, "RotationalDynamicViscosity", document.getElementById("RotationalDynamicViscosityRB").value));
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

        let bitumencoverageRA = xmlDoc.createElement("BitumenCoverageDegree");
        reclaimedasphalt.appendChild(bitumencoverageRA);
        bitumencoverageRA.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegreeValue", document.getElementById("BitumenCoverageDegreeValueRA").value));
        bitumencoverageRA.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegreeMethod", document.getElementById("BitumenCoverageDegreeMethodRA").value));
        addAdditionalProperties('RA', xmlDoc, 'field12-2', reclaimedasphalt);

        // Populate PreMixingBinderBlend element
        let premixingbinder = xmlDoc.createElement("PreMixingBinderBlend");
        mixturecomponentsproperties.appendChild(premixingbinder);
        premixingbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationPmB").value));
        premixingbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointPmB").value));
        let viscositiesPmB = xmlDoc.createElement("Viscosities");
        premixingbinder.appendChild(viscositiesPmB);
        viscositiesPmB.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityPmB").value));
        viscositiesPmB.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityPmB").value));
        viscositiesPmB.appendChild(createTextElement(xmlDoc, "RotationalDynamicViscosity", document.getElementById("RotationalDynamicViscosityPmB").value));
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
        agingresistancePmB.appendChild(createTextElement(xmlDoc, "MassLoss", document.getElementById("MassLossPmB").value));
        agingresistancePmB.appendChild(createTextElement(xmlDoc, "RetainedPenetration", document.getElementById("PenetrationChangePmB").value));
        agingresistancePmB.appendChild(createTextElement(xmlDoc, "SofteningPointIncrease", document.getElementById("SofteningPointIncreasePmB").value));
        premixingbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryPmB").value));
        premixingbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyPmB").value));
        premixingbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityPmB").value));
        addAdditionalProperties('PmB', xmlDoc, 'field15-4', premixingbinder);

        // Populate OtherMaterials element
        let othermat = xmlDoc.createElement("OtherMaterials");
        mixturecomponentsproperties.appendChild(othermat);
        othermat.appendChild(createTextElement(xmlDoc, "Name", document.getElementById("NameOtherMaterials").value));
        addAdditionalProperties('OtherMaterials', xmlDoc, 'fieldN-1', othermat);

        // Populate Aggregates element within RecoveredMaterials element
        let recoveredasphalt = xmlDoc.createElement("RecoveredMaterials");
        mixture.appendChild(recoveredasphalt);
        let recoveredaggregates = xmlDoc.createElement("Aggregates");
        recoveredasphalt.appendChild(recoveredaggregates);
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
        recoveredaggregates.appendChild(createTextElement(xmlDoc, "Nature", document.getElementById("NatureCA").value));
        recoveredaggregates.appendChild(createTextElement(xmlDoc, "LosAngelesTestResult", document.getElementById("LosAngelesTestResultCA").value));
        recoveredaggregates.appendChild(createTextElement(xmlDoc, "FlakinessIndex", document.getElementById("FlakinessIndexCA").value));
        recoveredaggregates.appendChild(createTextElement(xmlDoc, "ShapeIndex", document.getElementById("ShapeIndexCA").value));
        recoveredaggregates.appendChild(createTextElement(xmlDoc, "FlowCoefficient", document.getElementById("FlowCoefficientCA").value));
        recoveredaggregates.appendChild(createTextElement(xmlDoc, "NordicAbrasionValue", document.getElementById("NordicAbrasionValueCA").value));
        let roundedcrushedCA = xmlDoc.createElement("RoundedAndCrushed");
        recoveredaggregates.appendChild(roundedcrushedCA);
        roundedcrushedCA.appendChild(createTextElement(xmlDoc, "SemiCrushedParticles", document.getElementById("SemiCrushedParticlesCA").value));
        roundedcrushedCA.appendChild(createTextElement(xmlDoc, "TotallyCrushedParticles", document.getElementById("TotallyCrushedParticlesCA").value));
        roundedcrushedCA.appendChild(createTextElement(xmlDoc, "SemiRoundedParticles", document.getElementById("SemiRoundedParticlesCA").value));
        roundedcrushedCA.appendChild(createTextElement(xmlDoc, "TotallyRoundedParticles", document.getElementById("TotallyRoundedParticlesCA").value));
        
        let bitumencoverageCA = xmlDoc.createElement("BitumenCoverageDegree");
        recoveredaggregates.appendChild(bitumencoverageCA);
        bitumencoverageCA.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegreeValue", document.getElementById("BitumenCoverageDegreeValueCA").value));
        bitumencoverageCA.appendChild(createTextElement(xmlDoc, "BitumenCoverageDegreeMethod", document.getElementById("BitumenCoverageDegreeMethodCA").value));
        addAdditionalProperties('CA', xmlDoc, 'field17-2', recoveredaggregates);

        // Populate Binder element within RecoveredMaterials element
        let recoveredbinder = xmlDoc.createElement("Binder");
        recoveredasphalt.appendChild(recoveredbinder);
        recoveredbinder.appendChild(createTextElement(xmlDoc, "BinderContent", document.getElementById("PercentageContentCB").value));
        recoveredbinder.appendChild(createTextElement(xmlDoc, "Penetration", document.getElementById("PenetrationCB").value));
        recoveredbinder.appendChild(createTextElement(xmlDoc, "SofteningPoint", document.getElementById("SofteningPointCB").value));
        let viscositiesCB = xmlDoc.createElement("Viscosities");
        recoveredbinder.appendChild(viscositiesCB);
        viscositiesCB.appendChild(createTextElement(xmlDoc, "KinematicViscosity", document.getElementById("KinematicViscosityCB").value));
        viscositiesCB.appendChild(createTextElement(xmlDoc, "DynamicViscosity", document.getElementById("DynamicViscosityCB").value));
        viscositiesCB.appendChild(createTextElement(xmlDoc, "RotationalDynamicViscosity", document.getElementById("RotationalDynamicViscosityCB").value));
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
        agingresistanceCB.appendChild(createTextElement(xmlDoc, "MassLoss", document.getElementById("MassLossCB").value));
        agingresistanceCB.appendChild(createTextElement(xmlDoc, "RetainedPenetration", document.getElementById("PenetrationChangeCB").value));
        agingresistanceCB.appendChild(createTextElement(xmlDoc, "SofteningPointIncrease", document.getElementById("SofteningPointIncreaseCB").value));
        recoveredbinder.appendChild(createTextElement(xmlDoc, "ElasticRecovery", document.getElementById("ElasticRecoveryCB").value));
        recoveredbinder.appendChild(createTextElement(xmlDoc, "CohesionEnergy", document.getElementById("CohesionEnergyCB").value));
        recoveredbinder.appendChild(createTextElement(xmlDoc, "Solubility", document.getElementById("SolubilityCB").value));
        addAdditionalProperties('CB', xmlDoc, 'field18-4', recoveredbinder);

        // Populate Mixing element
        let mixing = xmlDoc.createElement("Mixing");
        mixture.appendChild(mixing);
        mixing.appendChild(createTextElement(xmlDoc, "MixingMethod", document.getElementById("MixingMethod").value));
        mixing.appendChild(createTextElement(xmlDoc, "TypeofMixer", document.getElementById("TypeofMixer").value));
        mixing.appendChild(createTextElement(xmlDoc, "MixingSequence", document.getElementById("MixingSequence").value));
        mixing.appendChild(createTextElement(xmlDoc, "MixtureTemperature", document.getElementById("MixtureTemperature").value));
        mixing.appendChild(createTextElement(xmlDoc, "ReclaimedAsphaltTemperature", document.getElementById("ReclaimedAsphaltTemperature").value));
        mixing.appendChild(createTextElement(xmlDoc, "MixingDuration", document.getElementById("MixingDurationValue").value));
        addmixingproperty( xmlDoc, 'field16-3', mixing);

        // Populate Notes element
        mixture.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesMixtureContent").value));
    }

    //////////////////////////
    //////////////////////////

    if (CheckSelectedTest(testcasevalue ,"ruttingcases")){
        // Populate RuttingTestResults element
        var ruttestresults = xmlDoc.createElement("RuttingTestResults");

        // Populate SampleProperties element
        let sampleprop = xmlDoc.createElement("SampleProperties");
        ruttestresults.appendChild(sampleprop);
        
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

        let mixtureaging = xmlDoc.createElement("MixtureAging");
        sampleprop.appendChild(mixtureaging);
        let loosemixture = xmlDoc.createElement("LooseMixture");
        mixtureaging.appendChild(loosemixture);
        let shortterm = xmlDoc.createElement("ShortTerm");
        loosemixture.appendChild(shortterm);
        shortterm.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationShort").value));
        shortterm.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureShort").value));
        let longterm = xmlDoc.createElement("LongTerm");
        loosemixture.appendChild(longterm);
        longterm.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationLong").value));
        longterm.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureLong").value));
        let compactedmixture = xmlDoc.createElement("CompactedSpecimen");
        mixtureaging.appendChild(compactedmixture);
        let procedureb1 = xmlDoc.createElement("ProcedureB1");
        compactedmixture.appendChild(procedureb1);
        procedureb1.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB1").value));
        procedureb1.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB1").value));
        let procedureb2 = xmlDoc.createElement("ProcedureB2");
        compactedmixture.appendChild(procedureb2);
        procedureb2.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB2").value));
        procedureb2.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB2").value));

        sampleprop.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditions").value));

        // Populate Results element
        let ruttingresults = xmlDoc.createElement("Results");
        ruttestresults.appendChild(ruttingresults);
        ruttingresults.appendChild(createTextElement(xmlDoc, "TestTemperature", document.getElementById("TestTemperature").value));
        let procedure = xmlDoc.createElement("Procedure");
        ruttingresults.appendChild(procedure);

        let selectedMethod = document.getElementById("ResultsSelection").value;
        if (selectedMethod === "LargeOrExtraLargeDevices") {
            let largedev = xmlDoc.createElement("LargeOrExtraLargeDevices");
            procedure.appendChild(largedev);
            let Meanlargedev = xmlDoc.createElement("Mean");
            largedev.appendChild(Meanlargedev);
            Meanlargedev.appendChild(createTextElement(xmlDoc, "MeanThickness", document.getElementById("MeanThicknessL").value)); 
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
            MeansmalldevAair.appendChild(createTextElement(xmlDoc, "MeanThickness", document.getElementById("MeanThicknessSA").value)); 
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
            MeansmalldevBair.appendChild(createTextElement(xmlDoc, "MeanThickness", document.getElementById("MeanThicknessSBA").value)); 
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
            MeansmalldevBwater.appendChild(createTextElement(xmlDoc, "MeanThickness", document.getElementById("MeanThicknessSBW").value));
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
        ruttestresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContent").value));
    }

    if (CheckSelectedTest(testcasevalue ,"marshallcases")){
        // Populate MarshallTestResults element
        var martestresults = xmlDoc.createElement("MarshallTestResults");

        // Populate MarshallSampleProperties element
        let samplepropmar = xmlDoc.createElement("MarshallSampleProperties");
        martestresults.appendChild(samplepropmar);
        
        let sampleprepmar = xmlDoc.createElement("SamplePreparation");
        samplepropmar.appendChild(sampleprepmar);
        let  selectionSamplingmar = document.getElementById("SamplingMar").value;
            if (selectionSamplingmar === "PavementCoring") {
                let pavcor = xmlDoc.createElement("PavementCoring");
                sampleprepmar.appendChild(pavcor);
                pavcor.appendChild(createTextElement(xmlDoc, "Type", "Pavement Coring"));
                let coring = xmlDoc.createElement("Coring");
                pavcor.appendChild(coring);
                coring.appendChild(createTextElement(xmlDoc, "PavingDate", document.getElementById("PavingDateMar").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringDate", document.getElementById("CoringDateMar").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringLocation", document.getElementById("CoringLocationMar").value));
            } else if (selectionSamplingmar === "LooseMixture" ) {
                let losmix = xmlDoc.createElement("LooseMixture");
                sampleprepmar.appendChild(losmix);
                losmix.appendChild(createTextElement(xmlDoc, "Type", "Loose Mixture"));
                let compaction = xmlDoc.createElement("Compaction");
                losmix.appendChild(compaction);
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTemperature", document.getElementById("CompactionTemperatureMar").value));
                compaction.appendChild(createTextElement(xmlDoc, "BlowsNumber", document.getElementById("BlowsNumberMar").value));
            }

        let mixtureagingmar = xmlDoc.createElement("MixtureAging");
        samplepropmar.appendChild(mixtureagingmar);
        let loosemixturemar = xmlDoc.createElement("LooseMixture");
        mixtureagingmar.appendChild(loosemixturemar);
        let shorttermmar = xmlDoc.createElement("ShortTerm");
        loosemixturemar.appendChild(shorttermmar);
        shorttermmar.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationShortMar").value));
        shorttermmar.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureShortMar").value));
        let longtermmar = xmlDoc.createElement("LongTerm");
        loosemixturemar.appendChild(longtermmar);
        longtermmar.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationLongMar").value));
        longtermmar.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureLongMar").value));
        let compactedmixturemar = xmlDoc.createElement("CompactedSpecimen");
        mixtureagingmar.appendChild(compactedmixturemar);
        let procedureb1mar = xmlDoc.createElement("ProcedureB1");
        compactedmixturemar.appendChild(procedureb1mar);
        procedureb1mar.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB1Mar").value));
        procedureb1mar.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB1Mar").value));
        let procedureb2mar = xmlDoc.createElement("ProcedureB2");
        compactedmixturemar.appendChild(procedureb2mar);
        procedureb2mar.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB2Mar").value));
        procedureb2mar.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB2Mar").value));

        samplepropmar.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditionsMar").value));

        // Populate MarshallResults element
        let marshallresults = xmlDoc.createElement("MarshallResults");
        martestresults.appendChild(marshallresults);
        marshallresults.appendChild(createTextElement(xmlDoc, "Stability", document.getElementById("StabilityMar").value));
        marshallresults.appendChild(createTextElement(xmlDoc, "Flow", document.getElementById("FlowMar").value));
        marshallresults.appendChild(createTextElement(xmlDoc, "TangentialFlow", document.getElementById("TangentialFlowMar").value));
        marshallresults.appendChild(createTextElement(xmlDoc, "TotalFlow", document.getElementById("TotalFlowMar").value));
        marshallresults.appendChild(createTextElement(xmlDoc, "MarshallQuotient", document.getElementById("MarshallQuotientMar").value)); 
        let bulkdensitymar = xmlDoc.createElement("BulkDensity");
        marshallresults.appendChild(bulkdensitymar);
        bulkdensitymar.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueMar").value));
        bulkdensitymar.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodMar").value));
        let voidspercmar= xmlDoc.createElement("Voids");
        marshallresults.appendChild(voidspercmar);
        voidspercmar.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsMar").value));
        voidspercmar.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsMar").value));
        voidspercmar.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenMar").value));   

        // Populate Notes element
        martestresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContentMar").value));
    }

    if (CheckSelectedTest(testcasevalue ,"itscases")){
        // Populate ITSTestResults element
        var itstestresults = xmlDoc.createElement("ITSTestResults");

        // Populate ITSSampleProperties element
        let samplepropits= xmlDoc.createElement("ITSSampleProperties");
        itstestresults.appendChild(samplepropits);
        let sampleprepits = xmlDoc.createElement("SamplePreparation");
        samplepropits.appendChild(sampleprepits);
        let  selectionSamplingits = document.getElementById("SamplingITS").value;
            if (selectionSamplingits === "PavementCoring") {
                let pavcor = xmlDoc.createElement("PavementCoring");
                sampleprepits.appendChild(pavcor);
                pavcor.appendChild(createTextElement(xmlDoc, "Type", "Pavement Coring"));
                let coring = xmlDoc.createElement("Coring");
                pavcor.appendChild(coring);
                coring.appendChild(createTextElement(xmlDoc, "PavingDate", document.getElementById("PavingDateITS").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringDate", document.getElementById("CoringDateITS").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringLocation", document.getElementById("CoringLocationITS").value));
            } else if (selectionSamplingits === "LooseMixture" ) {
                let losmix = xmlDoc.createElement("LooseMixture");
                sampleprepits.appendChild(losmix);
                losmix.appendChild(createTextElement(xmlDoc, "Type", "Loose Mixture"));
                let compaction = xmlDoc.createElement("Compaction");
                losmix.appendChild(compaction);
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTemperature", document.getElementById("CompactionTemperatureITS").value));
                compaction.appendChild(createTextElement(xmlDoc, "BlowsNumber", document.getElementById("BlowsNumberITS").value));
            }

        let mixtureagingits = xmlDoc.createElement("MixtureAging");
        samplepropits.appendChild(mixtureagingits);
        let loosemixtureits = xmlDoc.createElement("LooseMixture");
        mixtureagingits.appendChild(loosemixtureits);
        let shorttermits = xmlDoc.createElement("ShortTerm");
        loosemixtureits.appendChild(shorttermits);
        shorttermits.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationShortITS").value));
        shorttermits.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureShortITS").value));
        let longtermits = xmlDoc.createElement("LongTerm");
        loosemixtureits.appendChild(longtermits);
        longtermits.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationLongITS").value));
        longtermits.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureLongITS").value));
        let compactedmixtureits = xmlDoc.createElement("CompactedSpecimen");
        mixtureagingits.appendChild(compactedmixtureits);
        let procedureb1its = xmlDoc.createElement("ProcedureB1");
        compactedmixtureits.appendChild(procedureb1its);
        procedureb1its.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB1ITS").value));
        procedureb1its.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB1ITS").value));
        let procedureb2its = xmlDoc.createElement("ProcedureB2");
        compactedmixtureits.appendChild(procedureb2its);
        procedureb2its.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB2ITS").value));
        procedureb2its.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB2ITS").value));

        samplepropits.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditionsITS").value));

        // Populate ITSResults element
        let itsresults = xmlDoc.createElement("ITSResults");
        itstestresults.appendChild(itsresults);
        itsresults.appendChild(createTextElement(xmlDoc, "TestTemperature", document.getElementById("TestTemperatureITS").value));
        itsresults.appendChild(createTextElement(xmlDoc, "IndirectTensileStrengthRatio", document.getElementById("IndirectTensileStrengthRatioITS").value));
        let drycase = xmlDoc.createElement("Dry");
        itsresults.appendChild(drycase);
        let Meanitsdry = xmlDoc.createElement("Mean");
        drycase.appendChild(Meanitsdry);
        Meanitsdry.appendChild(createTextElement(xmlDoc, "IndirectTensileStrength", document.getElementById("IndirectTensileStrengthITSDry").value));
        let sampledimitsdry = xmlDoc.createElement("SampleDimensions");
        Meanitsdry.appendChild(sampledimitsdry);
        sampledimitsdry.appendChild(createTextElement(xmlDoc, "Height", document.getElementById("HeightITSDry").value));
        sampledimitsdry.appendChild(createTextElement(xmlDoc, "Diameter", document.getElementById("DiameterITSDry").value));  
        let bulkdensityitsdry = xmlDoc.createElement("BulkDensity");
        Meanitsdry.appendChild(bulkdensityitsdry);
        bulkdensityitsdry.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueITSDry").value));
        bulkdensityitsdry.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodITSDry").value));
        let voidspercitsdry = xmlDoc.createElement("Voids");
        Meanitsdry.appendChild(voidspercitsdry);
        voidspercitsdry.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsITSWet").value));
        voidspercitsdry.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsITSDry").value));
        voidspercitsdry.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenITSDry").value));   
        
        if (!addReplicationsITS(xmlDoc, "ITSDry", "field21-12", drycase)) {return false;}

        let wetcase = xmlDoc.createElement("Wet");
        itsresults.appendChild(wetcase);
        let Meanitswet = xmlDoc.createElement("Mean");
        wetcase.appendChild(Meanitswet);
        Meanitswet.appendChild(createTextElement(xmlDoc, "IndirectTensileStrength", document.getElementById("IndirectTensileStrengthITSWet").value));
        let sampledimitswet = xmlDoc.createElement("SampleDimensions");
        Meanitswet.appendChild(sampledimitswet);
        sampledimitswet.appendChild(createTextElement(xmlDoc, "Height", document.getElementById("HeightITSWet").value));
        sampledimitswet.appendChild(createTextElement(xmlDoc, "Diameter", document.getElementById("DiameterITSWet").value));  
        let bulkdensityitswet = xmlDoc.createElement("BulkDensity");
        Meanitswet.appendChild(bulkdensityitswet);
        bulkdensityitswet.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueITSWet").value));
        bulkdensityitswet.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodITSWet").value));
        let voidspercitswet = xmlDoc.createElement("Voids");
        Meanitswet.appendChild(voidspercitswet);
        voidspercitswet.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsITSWet").value));
        voidspercitswet.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsITSWet").value));
        voidspercitswet.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenITSWet").value));   
        
        if (!addReplicationsITS(xmlDoc, "ITSWet", "field21-14", wetcase)) {return false;}

        // Populate Notes element
        itstestresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContentITS").value));
    }

    if (CheckSelectedTest(testcasevalue ,"tsrstcases")){
        // Populate TSRSTestResults element
        var tsrstestresults = xmlDoc.createElement("TSRSTestResults");

        // Populate TSRSTSampleProperties element
        let sampleproptsrst = xmlDoc.createElement("TSRSTSampleProperties");
        tsrstestresults.appendChild(sampleproptsrst);
        
        let samplepreptsrst = xmlDoc.createElement("SamplePreparation");
        sampleproptsrst.appendChild(samplepreptsrst);
        let  selectionSamplingtsrst = document.getElementById("SamplingTSRST").value;
            if (selectionSamplingtsrst === "PavementCoring") {
                let pavcor = xmlDoc.createElement("PavementCoring");
                samplepreptsrst.appendChild(pavcor);
                pavcor.appendChild(createTextElement(xmlDoc, "Type", "Pavement Coring"));
                let coring = xmlDoc.createElement("Coring");
                pavcor.appendChild(coring);
                coring.appendChild(createTextElement(xmlDoc, "PavingDate", document.getElementById("PavingDateTSRST").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringDate", document.getElementById("CoringDateTSRST").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringLocation", document.getElementById("CoringLocationTSRST").value));
            } else if (selectionSamplingtsrst === "LooseMixture" ) {
                let losmix = xmlDoc.createElement("LooseMixture");
                samplepreptsrst.appendChild(losmix);
                losmix.appendChild(createTextElement(xmlDoc, "Type", "Loose Mixture"));
                let compaction = xmlDoc.createElement("Compaction");
                losmix.appendChild(compaction);
                compaction.appendChild(createTextElement(xmlDoc, "CompactionDate", document.getElementById("CompactionDateTSRST").value));
                compaction.appendChild(createTextElement(xmlDoc, "RollerType", document.getElementById("RollerTypeTSRST").value));
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTarget", document.getElementById("CompactionTargetTSRST").value));
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTemperature", document.getElementById("CompactionTemperatureTSRST").value));
            }

        let mixtureagingtsrst = xmlDoc.createElement("MixtureAging");
        sampleproptsrst.appendChild(mixtureagingtsrst);
        let loosemixturetsrst = xmlDoc.createElement("LooseMixture");
        mixtureagingtsrst.appendChild(loosemixturetsrst);
        let shorttermtsrst = xmlDoc.createElement("ShortTerm");
        loosemixturetsrst.appendChild(shorttermtsrst);
        shorttermtsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationShortTSRST").value));
        shorttermtsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureShortTSRST").value));
        let longtermtsrst = xmlDoc.createElement("LongTerm");
        loosemixturetsrst.appendChild(longtermtsrst);
        longtermtsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationLongTSRST").value));
        longtermtsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureLongTSRST").value));
        let compactedmixturetsrst = xmlDoc.createElement("CompactedSpecimen");
        mixtureagingtsrst.appendChild(compactedmixturetsrst);
        let procedureb1tsrst = xmlDoc.createElement("ProcedureB1");
        compactedmixturetsrst.appendChild(procedureb1tsrst);
        procedureb1tsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB1TSRST").value));
        procedureb1tsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB1TSRST").value));
        let procedureb2tsrst = xmlDoc.createElement("ProcedureB2");
        compactedmixturetsrst.appendChild(procedureb2tsrst);
        procedureb2tsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB2TSRST").value));
        procedureb2tsrst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB2TSRST").value));

        sampleproptsrst.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditionsTSRST").value));

        // Populate TSRSTResults element
        let tsrstresults = xmlDoc.createElement("TSRSTResults");
        tsrstestresults.appendChild(tsrstresults);
        tsrstresults.appendChild(createTextElement(xmlDoc, "StartTemperature", document.getElementById("StartTemperatureTSRST").value));
        tsrstresults.appendChild(createTextElement(xmlDoc, "TemperatureRate", document.getElementById("TemperatureRateTSRST").value));
        tsrstresults.appendChild(createTextElement(xmlDoc, "FailureStress", document.getElementById("FailureStressTSRST").value));
        tsrstresults.appendChild(createTextElement(xmlDoc, "FailureTemperature", document.getElementById("FailureTemperatureTSRST").value));
        let smpledimtsr = xmlDoc.createElement("SampleDimensions");
        tsrstresults.appendChild(smpledimtsr);
        let  sampledimtsr = document.getElementById("SampleDimensionsTSRST").value;
        if (sampledimtsr === "Prismatic") {
            let shapepritsr = xmlDoc.createElement("Prismatic");
            smpledimtsr.appendChild(shapepritsr);
            shapepritsr.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthpTSRST").value));
            shapepritsr.appendChild(createTextElement(xmlDoc, "Height", document.getElementById("HeightpTSRST").value));
            shapepritsr.appendChild(createTextElement(xmlDoc, "Width", document.getElementById("WidthpTSRST").value));
        } else if (sampledimtsr === "Cylindrical" ) {
            let shapecyltsr = xmlDoc.createElement("Cylindrical");
            smpledimtsr.appendChild(shapecyltsr);
            shapecyltsr.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthcTSRST").value));
            shapecyltsr.appendChild(createTextElement(xmlDoc, "Diameter", document.getElementById("DiametercTSRST").value));
        }
        let bulkdensitytsrst = xmlDoc.createElement("BulkDensity");
        tsrstresults.appendChild(bulkdensitytsrst);
        bulkdensitytsrst.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueTSRST").value));
        bulkdensitytsrst.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodTSRST").value));
        let voidsperctsrst= xmlDoc.createElement("Voids");
        tsrstresults.appendChild(voidsperctsrst);
        voidsperctsrst.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsTSRST").value));
        voidsperctsrst.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsTSRST").value));
        voidsperctsrst.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenTSRST").value));   
        let graphTSRST = xmlDoc.createElement("CryogenicStressVersusTemperatureGraph");
        tsrstresults.appendChild(graphTSRST);
        let temptsrst = document.getElementById("TemperatureTSRSTg").value.split(";").map(v => v.trim()).filter(Boolean);
        let stresstsrst = document.getElementById("StressTSRSTg").value.split(";").map(v => v.trim()).filter(Boolean);
        if (temptsrst.length !== stresstsrst.length) 
        { EntryError('"Cryogenic Stress Versus Temperature" graph mismatch: Temperature and Stress values must have the same count.',"field21-16-3");return false;}
        for (let i = 0; i < temptsrst.length; i++) {
            let point = xmlDoc.createElement("Point");
            let temptsrstvalue = temptsrst[i];
            if (isNaN(parseFloat(temptsrstvalue)) || !/^\s*-?(\d+(\.\d+)?|\.\d+)\s*$/.test(temptsrstvalue)) 
            { EntryError(`Invalid Temperature in the "Cryogenic Stress Versus Temperature" graph: ${temptsrstvalue}`,"TemperatureTSRSTg");return false;}
            point.appendChild(createTextElement(xmlDoc, "Temperature", parseFloat(temptsrstvalue)));
            let stresstsrstvalue = stresstsrst[i];
            if (isNaN(parseFloat(stresstsrstvalue)) || parseFloat(stresstsrstvalue) < 0 || !/^\d+(\.\d+)?$/.test(stresstsrstvalue))
            { EntryError(`Invalid Stress in the "Cryogenic Stress Versus Temperature" graph: ${stresstsrstvalue}`,"StressTSRSTg");return false;}
            point.appendChild(createTextElement(xmlDoc, "Stress", parseFloat(stresstsrstvalue)));
            graphTSRST.appendChild(point);
        }

        // Populate Notes element
        tsrstestresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContentTSRST").value));
    }

    if (CheckSelectedTest(testcasevalue ,"utstcases")){
        // Populate UTSTestResults element
        var utstestresults = xmlDoc.createElement("UTSTestResults");

        // Populate UTSTSampleProperties element
        let sampleproputst = xmlDoc.createElement("UTSTSampleProperties");
        utstestresults.appendChild(sampleproputst);
        
        let samplepreputst = xmlDoc.createElement("SamplePreparation");
        sampleproputst.appendChild(samplepreputst);
        let  selectionSamplingutst = document.getElementById("SamplingUTST").value;
            if (selectionSamplingutst === "PavementCoring") {
                let pavcor = xmlDoc.createElement("PavementCoring");
                samplepreputst.appendChild(pavcor);
                pavcor.appendChild(createTextElement(xmlDoc, "Type", "Pavement Coring"));
                let coring = xmlDoc.createElement("Coring");
                pavcor.appendChild(coring);
                coring.appendChild(createTextElement(xmlDoc, "PavingDate", document.getElementById("PavingDateUTST").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringDate", document.getElementById("CoringDateUTST").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringLocation", document.getElementById("CoringLocationUTST").value));
            } else if (selectionSamplingutst === "LooseMixture" ) {
                let losmix = xmlDoc.createElement("LooseMixture");
                samplepreputst.appendChild(losmix);
                losmix.appendChild(createTextElement(xmlDoc, "Type", "Loose Mixture"));
                let compaction = xmlDoc.createElement("Compaction");
                losmix.appendChild(compaction);
                compaction.appendChild(createTextElement(xmlDoc, "CompactionDate", document.getElementById("CompactionDateUTST").value));
                compaction.appendChild(createTextElement(xmlDoc, "RollerType", document.getElementById("RollerTypeUTST").value));
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTarget", document.getElementById("CompactionTargetUTST").value));
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTemperature", document.getElementById("CompactionTemperatureUTST").value));
            }

        let mixtureagingutst = xmlDoc.createElement("MixtureAging");
        sampleproputst.appendChild(mixtureagingutst);
        let loosemixtureutst = xmlDoc.createElement("LooseMixture");
        mixtureagingutst.appendChild(loosemixtureutst);
        let shorttermutst = xmlDoc.createElement("ShortTerm");
        loosemixtureutst.appendChild(shorttermutst);
        shorttermutst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationShortUTST").value));
        shorttermutst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureShortUTST").value));
        let longtermutst = xmlDoc.createElement("LongTerm");
        loosemixtureutst.appendChild(longtermutst);
        longtermutst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationLongUTST").value));
        longtermutst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureLongUTST").value));
        let compactedmixtureutst = xmlDoc.createElement("CompactedSpecimen");
        mixtureagingutst.appendChild(compactedmixtureutst);
        let procedureb1utst = xmlDoc.createElement("ProcedureB1");
        compactedmixtureutst.appendChild(procedureb1utst);
        procedureb1utst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB1UTST").value));
        procedureb1utst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB1UTST").value));
        let procedureb2utst = xmlDoc.createElement("ProcedureB2");
        compactedmixtureutst.appendChild(procedureb2utst);
        procedureb2utst.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB2UTST").value));
        procedureb2utst.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB2UTST").value));

        sampleproputst.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditionsUTST").value));

        // Populate UTSTResults element
        let utstresults = xmlDoc.createElement("UTSTResults");
        utstestresults.appendChild(utstresults);
        utstresults.appendChild(createTextElement(xmlDoc, "TestTemperature", document.getElementById("TestTemperatureUTST").value));
        utstresults.appendChild(createTextElement(xmlDoc, "AppliedDeformationRate", document.getElementById("AppliedDeformationRateUTST").value));
        utstresults.appendChild(createTextElement(xmlDoc, "TensileStrength", document.getElementById("TensileStrengthUTST").value));
        utstresults.appendChild(createTextElement(xmlDoc, "FailureStrain", document.getElementById("FailureStrainUTST").value));
        let smpledimutst = xmlDoc.createElement("SampleDimensions");
        utstresults.appendChild(smpledimutst);
        let  sampledimutst = document.getElementById("SampleDimensionsUTST").value;
        if (sampledimutst === "Prismatic") {
            let shapepriutst = xmlDoc.createElement("Prismatic");
            smpledimutst.appendChild(shapepriutst);
            shapepriutst.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthpUTST").value));
            shapepriutst.appendChild(createTextElement(xmlDoc, "Height", document.getElementById("HeightpUTST").value));
            shapepriutst.appendChild(createTextElement(xmlDoc, "Width", document.getElementById("WidthpUTST").value));
        } else if (sampledimutst === "Cylindrical" ) {
            let shapecylutst = xmlDoc.createElement("Cylindrical");
            smpledimutst.appendChild(shapecylutst);
            shapecylutst.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthcUTST").value));
            shapecylutst.appendChild(createTextElement(xmlDoc, "Diameter", document.getElementById("DiametercUTST").value));
        }
        let bulkdensityutst = xmlDoc.createElement("BulkDensity");
        utstresults.appendChild(bulkdensityutst);
        bulkdensityutst.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueUTST").value));
        bulkdensityutst.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodUTST").value));
        let voidspercutst= xmlDoc.createElement("Voids");
        utstresults.appendChild(voidspercutst);
        voidspercutst.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsUTST").value));
        voidspercutst.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsUTST").value));
        voidspercutst.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenUTST").value));   

        // Populate Notes element
        utstestresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContentUTST").value));
    }

    if (CheckSelectedTest(testcasevalue ,"stiffnesscases")){
        // Populate StiffnessTestResults element
        var stifftestresults = xmlDoc.createElement("StiffnessTestResults");

        // Populate StiffnessSampleProperties element
        let samplepropstiff = xmlDoc.createElement("StiffnessSampleProperties");
        stifftestresults.appendChild(samplepropstiff);
        
        let sampleprepstiff = xmlDoc.createElement("SamplePreparation");
        samplepropstiff.appendChild(sampleprepstiff);
        let  selectionSamplingstiff = document.getElementById("SamplingStiff").value;
            if (selectionSamplingstiff === "PavementCoring") {
                let pavcor = xmlDoc.createElement("PavementCoring");
                sampleprepstiff.appendChild(pavcor);
                pavcor.appendChild(createTextElement(xmlDoc, "Type", "Pavement Coring"));
                let coring = xmlDoc.createElement("Coring");
                pavcor.appendChild(coring);
                coring.appendChild(createTextElement(xmlDoc, "PavingDate", document.getElementById("PavingDateStiff").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringDate", document.getElementById("CoringDateStiff").value));
                coring.appendChild(createTextElement(xmlDoc, "CoringLocation", document.getElementById("CoringLocationStiff").value));
            } else if (selectionSamplingstiff === "LooseMixture" ) {
                let losmix = xmlDoc.createElement("LooseMixture");
                sampleprepstiff.appendChild(losmix);
                losmix.appendChild(createTextElement(xmlDoc, "Type", "Loose Mixture"));
                let compaction = xmlDoc.createElement("Compaction");
                losmix.appendChild(compaction);
                compaction.appendChild(createTextElement(xmlDoc, "CompactionDate", document.getElementById("CompactionDateStiff").value));
                compaction.appendChild(createTextElement(xmlDoc, "CompactorType", document.getElementById("CompactorTypeStiff").value));
                compaction.appendChild(createTextElement(xmlDoc, "CompactionTemperature", document.getElementById("CompactionTemperatureStiff").value));
                var selectedcomptypestiff = document.getElementById("CompactorTypeStiff").value
                if (selectedcomptypestiff!= "GyratoryCompactor" && selectedcomptypestiff != "MarshallCompactor") {
                    compaction.appendChild(createTextElement(xmlDoc, "CompactionTarget", document.getElementById("CompactionTargetStiff").value));
                }
            }
        let mixtureagingstiff = xmlDoc.createElement("MixtureAging");
        samplepropstiff.appendChild(mixtureagingstiff);
        let loosemixturestiff = xmlDoc.createElement("LooseMixture");
        mixtureagingstiff.appendChild(loosemixturestiff);
        let shorttermstiff = xmlDoc.createElement("ShortTerm");
        loosemixturestiff.appendChild(shorttermstiff);
        shorttermstiff.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationShortStiff").value));
        shorttermstiff.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureShortStiff").value));
        let longtermstiff = xmlDoc.createElement("LongTerm");
        loosemixturestiff.appendChild(longtermstiff);
        longtermstiff.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationLongStiff").value));
        longtermstiff.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureLongStiff").value));
        let compactedmixturestiff = xmlDoc.createElement("CompactedSpecimen");
        mixtureagingstiff.appendChild(compactedmixturestiff);
        let procedureb1stiff = xmlDoc.createElement("ProcedureB1");
        compactedmixturestiff.appendChild(procedureb1stiff);
        procedureb1stiff.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB1Stiff").value));
        procedureb1stiff.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB1Stiff").value));
        let procedureb2stiff = xmlDoc.createElement("ProcedureB2");
        compactedmixturestiff.appendChild(procedureb2stiff);
        procedureb2stiff.appendChild(createTextElement(xmlDoc, "MixtureAgingDuration", document.getElementById("MixtureAgingDurationB2Stiff").value));
        procedureb2stiff.appendChild(createTextElement(xmlDoc, "MixtureAgingTemperature", document.getElementById("MixtureAgingTemperatureB2Stiff").value));
        samplepropstiff.appendChild(createTextElement(xmlDoc, "StorageConditions", document.getElementById("StorageConditionsStiff").value));

        // Populate StiffnessResults element
        let stiffresults = xmlDoc.createElement("StiffnessResults");
        stifftestresults.appendChild(stiffresults);
        stiffresults.appendChild(createTextElement(xmlDoc, "TestType", document.getElementById("TestTypeStiff").value));
        WriteStiffnessCases( xmlDoc, "field21-19-0", stiffresults);
        let smpledimstiff = xmlDoc.createElement("SampleDimensions");
        stiffresults.appendChild(smpledimstiff);
        let  testtypestf = document.getElementById("TestTypeStiff").value;
        if (testtypestf === "2PB-PR" || testtypestf === "3PB-PR" || testtypestf === "4PB-PR" || testtypestf === "DT-PR") {
            let shapepristiff = xmlDoc.createElement("Prismatic");
            smpledimstiff.appendChild(shapepristiff);
            shapepristiff.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthpStiff").value));
            shapepristiff.appendChild(createTextElement(xmlDoc, "Height", document.getElementById("HeightpStiff").value));
            shapepristiff.appendChild(createTextElement(xmlDoc, "Width", document.getElementById("WidthpStiff").value));
        } else if (testtypestf === "IT-CY" || testtypestf === "CIT-CY" || testtypestf === "DTC-CY" || testtypestf === "DT-CY" ) {
            let shapecylstiff = xmlDoc.createElement("Cylindrical");
            smpledimstiff.appendChild(shapecylstiff);
            shapecylstiff.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthcStiff").value));
            shapecylstiff.appendChild(createTextElement(xmlDoc, "Diameter", document.getElementById("DiametercStiff").value));
        } else if (testtypestf  === "2PB-TR") {
            let shapecylstiff = xmlDoc.createElement("Trapezoidal");
            smpledimstiff.appendChild(shapecylstiff);
            shapecylstiff.appendChild(createTextElement(xmlDoc, "Length", document.getElementById("LengthtStiff").value));
            shapecylstiff.appendChild(createTextElement(xmlDoc, "Bigbase", document.getElementById("BigbasetStiff").value));
            shapecylstiff.appendChild(createTextElement(xmlDoc, "Smallbase", document.getElementById("SmallbasetStiff").value));
            shapecylstiff.appendChild(createTextElement(xmlDoc, "Width", document.getElementById("WidthtStiff").value));
        }
        let bulkdensitystiff = xmlDoc.createElement("BulkDensity");
        stiffresults.appendChild(bulkdensitystiff);
        bulkdensitystiff.appendChild(createTextElement(xmlDoc, "Value", document.getElementById("BulkDensityValueStiff").value));
        bulkdensitystiff.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById("BulkDensityMethodStiff").value));
        let voidspercstiff= xmlDoc.createElement("Voids");
        stiffresults.appendChild(voidspercstiff);
        voidspercstiff.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById("AirVoidsStiff").value));
        voidspercstiff.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById("MineralAggregateVoidsStiff").value));
        voidspercstiff.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById("VoidsFilledWithBitumenStiff").value));   

        // Populate Notes element
        stifftestresults.appendChild(createTextElement(xmlDoc, "Notes", document.getElementById("NotesResultsContentStiff").value));
    }
    
    //////////////////////////
    //////////////////////////

    if (CheckSelectedTest(testcasevalue ,"ruttingcases")){
        // Populate Notes element
        var rutnotes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)
    }
    if (CheckSelectedTest(testcasevalue ,"marshallcases")){
        // Populate Notes element
        var marnotes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)
    }
    if (CheckSelectedTest(testcasevalue ,"itscases")){
        // Populate Notes element
        var itsnotes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)
    }
    if (CheckSelectedTest(testcasevalue ,"tsrstcases")){
        // Populate Notes element
        var tsrstnotes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)
    }
    if (CheckSelectedTest(testcasevalue ,"utstcases")){
        // Populate Notes element
        var utstnotes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)
    }
    if (CheckSelectedTest(testcasevalue ,"stiffnesscases")){
        // Populate Notes element
        var stfnotes = createTextElement(xmlDoc, "Notes", document.getElementById("NotesGeneralContent").value)
    }

    //////////////////////////
    ////////////////////////// 
    
    for (let TestName of RootNodes(testcasevalue)){

        // Generating Final XML
        let MainXmlDoc = document.implementation.createDocument("", TestName, null);
        let TestDataSource, TestMixture, TestTestResults, TestNotes;
        TestDataSource = MainXmlDoc.importNode(dataSource, true);
        if (TestName === "RuttingExp"){
            TestMixture = MainXmlDoc.importNode(mixture, true);
            TestTestResults = MainXmlDoc.importNode(ruttestresults, true);
            TestNotes = MainXmlDoc.importNode(rutnotes, true);
        } else if (TestName === "MarshallExp"){
            TestMixture = MainXmlDoc.importNode(mixture, true);
            TestTestResults = MainXmlDoc.importNode(martestresults, true);
            TestNotes = MainXmlDoc.importNode(marnotes, true);
        } else if (TestName === "ITSExp"){
            TestMixture = MainXmlDoc.importNode(mixture, true);
            TestTestResults = MainXmlDoc.importNode(itstestresults, true);
            TestNotes = MainXmlDoc.importNode(itsnotes, true);
        } else if (TestName === "TSRSTExp"){
            TestMixture = MainXmlDoc.importNode(mixture, true);
            TestTestResults = MainXmlDoc.importNode(tsrstestresults, true);
            TestNotes = MainXmlDoc.importNode(tsrstnotes, true);
        } else if (TestName === "UTSTExp"){
            TestMixture = MainXmlDoc.importNode(mixture, true);
            TestTestResults = MainXmlDoc.importNode(utstestresults, true);
            TestNotes = MainXmlDoc.importNode(utstnotes, true);
        } else if (TestName === "StiffnessExp"){
            TestMixture = MainXmlDoc.importNode(mixture, true);
            TestTestResults = MainXmlDoc.importNode(stifftestresults, true);
            TestNotes = MainXmlDoc.importNode(stfnotes, true);
        }
        MainXmlDoc.documentElement.appendChild(TestDataSource);
        MainXmlDoc.documentElement.appendChild(TestMixture);
        MainXmlDoc.documentElement.appendChild(TestTestResults);
        MainXmlDoc.documentElement.appendChild(TestNotes);

        let xmlString = new XMLSerializer().serializeToString(MainXmlDoc);
        let parser = new DOMParser();
        let XmlDocument = parser.parseFromString(xmlString, 'application/xml');
        removeEmptyElements(XmlDocument.documentElement); 
        let FinalXmlString = new XMLSerializer().serializeToString(XmlDocument); // Serialize the final XML document back to string

        namerecord=`${document.getElementById('measurementCampaignID').value}_${document.getElementById('organizationName').value}_${document.getElementById('year').value}`;

        if(gentype==='S'){
        // Save Record to Database
        $.ajax({
            url: '/curate/save-xml-data/',
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {
                xml_data: FinalXmlString,
                title: namerecord,
                template_id: Testid(TestName),
            },
            success: function(response) {
                console.log('Data saved successfully:', response);
                gvSavedCount++;
                if (response && response.data_id) gvSavedIds.push(response.data_id);
                checkAllGVSaved();
            },
        error: function(xhr, status, error) {
            gvFailedCount++;
            if (xhr.status === 403) {
                var errorMessage = 'Insufficient permissions';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                console.error('Error:', errorMessage);
                gvSaveDenied = true;
            } else {
                console.error('Error saving data:', error);
            }
            checkAllGVSaved();
        }
        });
        } else if(gentype==='ES'){
        // Edit Record in Database
        $.ajax({
            url: '/curate/save-xml-data/',
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {
                xml_data: FinalXmlString,
                title: namerecord,
                template_id: Testid(TestName),
                data_id: dataId,
            },
            success: function(response) {
                console.log('Data updated successfully:', response);
            },
        error: function(xhr, status, error) {
            if (xhr.status === 403) {
                var errorMessage = 'Insufficient permissions';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                console.error('Error:', errorMessage);
            } else {
                console.error('Error saving data:', error);
            }
        }
        });
        window.location.href = "/explore/keyword/";
        } else if(gentype==='D'){
        // Download Record as XML
        ShowPopMsg('D');
        let blob = new Blob([FinalXmlString], { type: "text/xml" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${namerecord}.xml`;
        link.click();
        }
    }

    // Close Empty fields 
    CloseEmptyFields();

    return false; // Prevent default form submission
}

// Helper function to create text elements
function createTextElement(xmlDoc, elementName, textContent) {
    let element = xmlDoc.createElement(elementName);
    let textNode = xmlDoc.createTextNode(textContent);
    element.appendChild(textNode);
    return element;
}

// Helper function to add AdditionalProperties
function addAdditionalProperties(type, xmlDoc, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let additionalproperties = xmlDoc.createElement('AdditionalProperties');
        additionalproperties.appendChild(createTextElement(xmlDoc, 'Property', document.getElementById(`TestMethod${type}_${i}`).value));
        additionalproperties.appendChild(createTextElement(xmlDoc, 'Value', document.getElementById(`Value${type}_${i}`).value));
        additionalproperties.appendChild(createTextElement(xmlDoc, 'Unit', document.getElementById(`Unit${type}_${i}`).value));
        parentElement.appendChild(additionalproperties);
    }
}

// Helper function to add Additional Additives
function addAdditionalAdditive(type, xmlDoc, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let additionaladd = xmlDoc.createElement('Additive');
        additionaladd.appendChild(createTextElement(xmlDoc, 'Type', document.getElementById(`Type${type}_${i}`).value));
        additionaladd.appendChild(createTextElement(xmlDoc, 'PercentageMass', document.getElementById(`PercentageMass${type}_${i}`).value));
        addAdditionalProperties(`Addtv_${i}`, xmlDoc, `fld14-${i}`, additionaladd);
        parentElement.appendChild(additionaladd);
    }
}

// Helper function to add OtherMixingProperty
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

// Helper function to add Replications for the Large Case
function addReplicationsL( xmlDoc, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let Replargedev = xmlDoc.createElement("Replication");
        parentElement.appendChild(Replargedev);
        Replargedev.appendChild(createTextElement(xmlDoc, "Thickness", document.getElementById(`ThicknessL${i}`).value));
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

// Helper function to add Replications for the Small Method A in Air Case
function addReplicationsSA( xmlDoc, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let RepsmalldevAair = xmlDoc.createElement("Replication");
        parentElement.appendChild(RepsmalldevAair);
        RepsmalldevAair.appendChild(createTextElement(xmlDoc, "Thickness", document.getElementById(`ThicknessSA${i}`).value));
        RepsmalldevAair.appendChild(createTextElement(xmlDoc, "WheelTrackingRate", document.getElementById(`WheelTrackingRateSA${i}`).value));
        RepsmalldevAair.appendChild(createTextElement(xmlDoc, "FinalCyclesNumber", document.getElementById(`CyclesNumberSA${i}`).value));
        RepsmalldevAair.appendChild(createTextElement(xmlDoc, "RutDepth", document.getElementById(`RutDepthSA${i}`).value));
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

// Helper function to add Replications for the Small Method B in Air and Water Cases
function addReplicationsSB( xmlDoc, type, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let RepsmalldevB = xmlDoc.createElement("Replication");
        parentElement.appendChild(RepsmalldevB);
        RepsmalldevB.appendChild(createTextElement(xmlDoc, "Thickness", document.getElementById(`Thickness${type}${i}`).value));
        RepsmalldevB.appendChild(createTextElement(xmlDoc, "WheelTrackingSlope", document.getElementById(`WheelTrackingSlope${type}${i}`).value));
        RepsmalldevB.appendChild(createTextElement(xmlDoc, "FinalCyclesNumber", document.getElementById(`CyclesNumber${type}${i}`).value));
        RepsmalldevB.appendChild(createTextElement(xmlDoc, "ProportionalRutDepth", document.getElementById(`Value${type}prop${i}`).value));
        RepsmalldevB.appendChild(createTextElement(xmlDoc, "RutDepth", document.getElementById(`Value${type}${i}`).value));
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

// Helper function to add Replications for the Indirect Tensile Strength Test results
function addReplicationsITS( xmlDoc, type, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let Repits = xmlDoc.createElement("Replication");
        parentElement.appendChild(Repits);
        Repits.appendChild(createTextElement(xmlDoc, "IndirectTensileStrength", document.getElementById(`IndirectTensileStrength${type}${i}`).value));
        let sampledimits = xmlDoc.createElement("SampleDimensions");
        Repits.appendChild(sampledimits);
        sampledimits.appendChild(createTextElement(xmlDoc, "Height", document.getElementById(`Height${type}${i}`).value));
        sampledimits.appendChild(createTextElement(xmlDoc, "Diameter", document.getElementById(`Diameter${type}${i}`).value));
        let bulkdensityits = xmlDoc.createElement("BulkDensity");
        Repits.appendChild(bulkdensityits);
        bulkdensityits.appendChild(createTextElement(xmlDoc, "Value", document.getElementById(`BulkDensityValue${type}${i}`).value));
        bulkdensityits.appendChild(createTextElement(xmlDoc, "MethodofMeasurement", document.getElementById(`BulkDensityMethod${type}${i}`).value));
        let voidspercits= xmlDoc.createElement("Voids");
        Repits.appendChild(voidspercits);
        voidspercits.appendChild(createTextElement(xmlDoc, "AirVoids", document.getElementById(`AirVoids${type}${i}`).value));
        voidspercits.appendChild(createTextElement(xmlDoc, "MineralAggregateVoids", document.getElementById(`MineralAggregateVoids${type}${i}`).value));
        voidspercits.appendChild(createTextElement(xmlDoc, "VoidsFilledWithBitumen", document.getElementById(`VoidsFilledWithBitumen${type}${i}`).value));
    }
    return true;
}

// Helper function to write part of the Stiffness Test results
function WriteStiffnessCases( xmlDoc, containerId, parentElement) {
    if (!document.getElementById(containerId)) {
        console.error(`Container with id '${containerId}' not found.`);
        return; }
    for (let i = 1; i < document.getElementById(containerId).childElementCount; i++) {
        let Rslt = xmlDoc.createElement("Results");
        parentElement.appendChild(Rslt);
        Rslt.appendChild(createTextElement(xmlDoc, "TestTemperature", document.getElementById(`TestTemperatureStiff${i}`).value));
        let  strndispl = document.getElementById(`SelectStrainDisplacementStiff${i}`).value;
        for (let j = 1; j <= 4; j++) {
            let casestf = xmlDoc.createElement("Case");
            Rslt.appendChild(casestf);
            casestf.appendChild(createTextElement(xmlDoc, document.getElementById(`SelectFrequencyTimeStiff${i}`).value, document.getElementById(`FrequencyTimeStiff${i}_${j}`).value));
            casestf.appendChild(createTextElement(xmlDoc, "StiffnessModulus", document.getElementById(`StiffnessModulusStiff${i}_${j}`).value));
            casestf.appendChild(createTextElement(xmlDoc, strndispl, document.getElementById(`StrainDisplacementStiff${i}_${j}`).value));
        }
    }
    return true;
}

// Function to remove all empty elements form XML string
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
