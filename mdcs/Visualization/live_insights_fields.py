"""XSD-driven field mapping for the Live Insights page.

Paths mirror the element names defined in the AsphaltDB-*.xsd schemas under
core_curate_app/core_curate_app/pythoncodes/. The root-tag -> test-key mapping
mirrors the `Tests` dict built by xmlprocessing.load_test_schemas() in that
same package, so a record's test type is derived the same way curate does it.
"""

# Root XML tag of a curated record -> internal test key.
TEST_ROOT_TAGS = {
    "MarshallExp": "marshall",
    "ITSExp": "its",
    "RuttingExp": "rutting",
    "StiffnessExp": "stiffness",
    "TSRSTExp": "tsrst",
    "UTSTExp": "utst",
}

TEST_LABELS = {
    "marshall": "Marshall",
    "its": "ITS",
    "rutting": "Rutting",
    "stiffness": "Stiffness",
    "tsrst": "TSRST",
    "utst": "UTST",
}

# Numeric fields on the Mixture branch, common to every test. Extracted from
# extract_paths_and_values(root) using these dotted paths. Rendered as a
# mean + 95% interval card, with an optional expandable histogram.
MIXTURE_NUMERIC_FIELDS = {
    "binder_content": ("Mixture.MixtureRecipe.Composition.Binder.BinderContent", "Binder Content (%)"),
    "rap_content": ("Mixture.MixtureRecipe.Composition.ReclaimedAsphalt", "RAP Content (%)"),
    "max_density": ("Mixture.MixtureRecipe.MixtureMaximumDensity", "Maximum Density (Mg/m³)"),
}

# Categorical fields rendered as a pie/donut of their (small, fixed) set of
# values.
MIXTURE_CATEGORICAL_FIELDS = {
    "mixing_method": ("Mixture.Mixing.MixingMethod", "Mixing Method"),
}

# Categorical fields with a large/open vocabulary, rendered as a top-N bar
# chart instead of a pie (too many distinct values for a pie to stay readable).
MIXTURE_TOP_N_FIELDS = {
    "target_binder_grade": ("Mixture.MixtureRecipe.Composition.Binder.TargetBinderGrade", "Target Binder Grade"),
}

# DataSource.Year is technically on the DataSource branch (common to every
# record, like Mixture), not under Mixture itself - grouped here anyway since
# it's shown alongside the mixture-level charts.
YEAR_FIELD = ("DataSource.Year", "Records by Year")

# Sieve gradation points (repeated <Point> children of a GrainSizeDistribution
# element) aren't indexed by extract_paths_and_values, so they're walked
# directly with a dedicated ElementTree extractor instead.
#
# The schema records two distinct, independent gradation curves, not one:
#   - "composition": Mixture.MixtureRecipe.Composition.AggregatesDistribution
#     - the as-designed blend gradation for the whole mixture.
#   - "recovered": Mixture.RecoveredMaterials.Aggregates.GrainSizeDistribution
#     - the gradation measured on aggregate recovered/extracted back out of
#       the mixture after production (a QA/verification curve).
# These are shown as two separate charts, not merged.
SIEVE_SOURCES = {
    "composition": (
        "Mixture/MixtureRecipe/Composition/AggregatesDistribution/Point",
        "Sieve Gradation – Composition (as designed)",
    ),
    "recovered": (
        "Mixture/RecoveredMaterials/Aggregates/GrainSizeDistribution/Point",
        "Sieve Gradation – Recovered Materials",
    ),
}
SIEVE_POINT_SIZE_TAG = "Size"
SIEVE_POINT_VALUE_TAG = "PercentageDistribution"

# Key result metrics per test, extracted from extract_paths_and_values(root)
# using each test's <Test>TestResults branch (element names verbatim from the
# corresponding AsphaltDB-*.xsd).
TEST_RESULT_FIELDS = {
    "marshall": {
        "stability": ("MarshallTestResults.MarshallResults.Stability", "Stability (kN)"),
        "flow": ("MarshallTestResults.MarshallResults.Flow", "Flow (mm)"),
        "marshall_quotient": ("MarshallTestResults.MarshallResults.MarshallQuotient", "Marshall Quotient (kN/mm)"),
        "bulk_density": ("MarshallTestResults.MarshallResults.BulkDensity.Value", "Bulk Density (Mg/m³)"),
        "air_voids": ("MarshallTestResults.MarshallResults.Voids.AirVoids", "Air Voids (%)"),
        "vma": ("MarshallTestResults.MarshallResults.Voids.MineralAggregateVoids", "VMA (%)"),
        "vfb": ("MarshallTestResults.MarshallResults.Voids.VoidsFilledWithBitumen", "VFB (%)"),
    },
    "its": {
        "test_temperature": ("ITSTestResults.ITSResults.TestTemperature", "Test Temperature (°C)"),
        "itsr": ("ITSTestResults.ITSResults.IndirectTensileStrengthRatio", "ITSR (%)"),
        "its_dry": ("ITSTestResults.ITSResults.Dry.Mean.IndirectTensileStrength", "ITS Dry (kPa)"),
        "its_wet": ("ITSTestResults.ITSResults.Wet.Mean.IndirectTensileStrength", "ITS Wet (kPa)"),
    },
    "rutting": {
        "test_temperature": ("RuttingTestResults.Results.TestTemperature", "Test Temperature (°C)"),
        "rut_depth": (
            "RuttingTestResults.Results.Procedure.LargeOrExtraLargeDevices.Mean.MeanProportionalRutDepth",
            "Mean Proportional Rut Depth (%)",
        ),
    },
    "stiffness": {
        # TestType (e.g. "4PB-PR") is categorical, not numeric, so it isn't
        # listed here as a mean/interval metric. StiffnessModulus lives under
        # repeated Results_N.Case_M entries, which collide under
        # extract_paths_and_values the same way sieve Points do; it's
        # collected with a dedicated walker (_collect_stiffness_moduli) and
        # added to the results in live_insights_service.get_test_detail().
    },
    "tsrst": {
        "start_temperature": ("TSRSTestResults.TSRSTResults.StartTemperature", "Start Temperature (°C)"),
        "temperature_rate": ("TSRSTestResults.TSRSTResults.TemperatureRate", "Temperature Rate (°C/h)"),
        "failure_stress": ("TSRSTestResults.TSRSTResults.FailureStress", "Failure Stress (MPa)"),
        "failure_temperature": ("TSRSTestResults.TSRSTResults.FailureTemperature", "Failure Temperature (°C)"),
    },
    "utst": {
        "test_temperature": ("UTSTestResults.UTSTResults.TestTemperature", "Test Temperature (°C)"),
        "deformation_rate": ("UTSTestResults.UTSTResults.AppliedDeformationRate", "Applied Deformation Rate (%/min)"),
        "tensile_strength": ("UTSTestResults.UTSTResults.TensileStrength", "Tensile Strength (MPa)"),
        "failure_strain": ("UTSTestResults.UTSTResults.FailureStrain", "Failure Strain (%)"),
    },
}

# Path (as a list of tag names from the test's Results branch) to the repeated
# Case/StiffnessModulus entries, walked directly like the sieve points.
STIFFNESS_CASE_PATH = "StiffnessTestResults/Results/Case"
STIFFNESS_MODULUS_TAG = "StiffnessModulus"

# Sieve size (mm) used for the single Recovered-gradation correlation field
# below - a small tolerance is applied when matching a record's reported
# sizes against this value (see _closest_sieve_value in the service), since
# not every record reports exactly "0.063".
RECOVERED_FINES_SIEVE_SIZE = 0.063

# Correlation Analysis field selection, per test. Every field key here must
# resolve via _record_field_value() in live_insights_service.py: either a
# MIXTURE_NUMERIC_FIELDS key, "recovered_0063" (the sieve field above),
# "stiffness_modulus" (collected the same way as get_test_detail's results,
# averaged per record since a record can report more than one), or a
# TEST_RESULT_FIELDS[test] key. "default" is what's shown before the user
# asks to see more; "extra" is computed in the same pass but only revealed
# on request - test-condition parameters (temperature, deformation/heating
# rate) are kept as "extra" rather than "default" since they describe how
# the test was run, not an outcome worth correlating against the mixture.
CORRELATION_FIELDS = {
    "marshall": {
        "default": ["binder_content", "rap_content", "max_density", "recovered_0063", "stability", "flow", "air_voids"],
        "extra": ["marshall_quotient", "bulk_density", "vma", "vfb"],
    },
    "its": {
        "default": ["binder_content", "rap_content", "max_density", "recovered_0063", "itsr"],
        "extra": ["test_temperature", "its_dry", "its_wet"],
    },
    "rutting": {
        "default": ["binder_content", "rap_content", "max_density", "recovered_0063", "rut_depth"],
        "extra": ["test_temperature"],
    },
    "stiffness": {
        "default": ["binder_content", "rap_content", "max_density", "recovered_0063", "stiffness_modulus"],
        "extra": [],
    },
    "tsrst": {
        "default": ["binder_content", "rap_content", "max_density", "recovered_0063", "failure_stress", "failure_temperature"],
        "extra": ["start_temperature", "temperature_rate"],
    },
    "utst": {
        "default": ["binder_content", "rap_content", "max_density", "recovered_0063", "tensile_strength", "failure_strain"],
        "extra": ["test_temperature", "deformation_rate"],
    },
}

# Correlation coefficients need at least this many paired records (both
# fields reported on the same record) to be shown at all - below this a
# coefficient is more noise than signal.
MIN_CORRELATION_N = 10
