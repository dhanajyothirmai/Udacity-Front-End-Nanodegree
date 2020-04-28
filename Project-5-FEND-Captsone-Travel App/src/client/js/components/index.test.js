import {
    _updateUI,
    _getDates,
    _fetchPixaby,
    _fetchDarkSky,
    _fetchGeoNames,
} from "./index"

test("It should return true", () => {
    expect(_updateUI).toBeDefined();
    expect(_getDates).toBeDefined();
    expect(_fetchPixaby).toBeDefined();
    expect(_fetchDarkSky).toBeDefined();
    expect(_fetchGeoNames).toBeDefined();
});
