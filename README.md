# AsphaltMine Database Web application

## Description
This repository contains the source files for the [AsphaltMine Database](https://www.Asphaltmine.org) web application. AsphaltMine is an Asphalt Test Result Database for Performance Prediction. It serves as a platform for collecting asphalt test results in an organized online database and for using this data to train machine learning models to predict asphalt performance.

## Features and Modifications
The web application is built upon the NIST MDCS project. Significant modifications include:
- Implementation of a unique form for AsphaltMine called the GV Web Form. This form is capable of saving, downloading, loading, and viewing single and multiple test records.
- Adding a comprehensive tutorial explaining various aspects of AsphaltMine and how to use the platform.
- Addition of a performance prediction module, using trained ML models to predict asphalt performance from mix design inputs (currently including Marshall mix design, with more models planned).
- Addition of a Live Insights visualization page, providing aggregated statistics and histograms over curated records (per-workspace or sitewide).
- Addition of a Bulk Upload tool, allowing multiple test records to be extracted, validated, and saved from AsphaltMine's predefined Excel template.
- Addition of an Excel export option, using AsphaltMine's predefined Excel template, to the existing record download functionalities.
- Several major and minor modifications for compatibility across libraries.
- Removal of certain aspects of the original NIST MDCS project, including the curate, query, and form pages, along with several other features.

These modifications have been ongoing since June 2025; for the detailed nature and dates of individual changes, see this repository's commit history.

## Original NIST MDCS Project
For the complete original NIST MDCS project, see [ORIGINAL_README.md](ORIGINAL_README.md) and visit the GitHub link: [https://github.com/usnistgov/mdcs](https://github.com/usnistgov/mdcs) 

## Licensing
- Original NIST License: [NIST_LICENSE.md](NIST_LICENSE.md)
- Third Party License: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

