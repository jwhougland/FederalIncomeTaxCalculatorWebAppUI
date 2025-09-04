import React, { useState, useEffect } from 'react';

const TaxInputForm = ({ onCalculate, formErrors = {} }) => {

    const [grossIncome, setGrossIncome] = useState(0);
    const [filingStatusOptions, setFilingStatusOptions] = useState([]);
    const [filingStatus, setFilingStatus] = useState('');
    const [taxYearOptions, setTaxYearOptions] = useState([]);
    const [taxYear, setTaxYear] = useState('');
    const [totalDeductions, setTotalDeductions] = useState(0);
    const [totalCredits, setTotalCredits] = useState(0);

    const [statusError, setStatusError] = useState(false);
    const [yearError, setYearError] = useState(false);

    const safeNumber = (val) => Math.max(0, Number(val) || 0);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/taxYears`)
            .then((res) => res.json())
            .then((data) => {
                setTaxYearOptions(data);
                setTaxYear(data?.[0] ?? '');
            })
            .catch((err) => {
                console.error('Error fetching available tax years: ', err);
                setYearError(true);
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/filingStatuses`)
            .then((res) => res.json())
            .then((data) => {
                setFilingStatusOptions(data);
                setFilingStatus(data?.[0]?.code ?? '');
            })
            .catch((err) => {
                console.error('Error fetching filing statuses: ', err);
                setStatusError(true);
            });
    }, []);

    const handleSubmit = () => {
        const payload = {
            grossIncome,
            selectedFilingStatus: filingStatus,
            selectedTaxYear: parseInt(taxYear, 10) || 0,
            totalDeductions,
            totalCredits,
        };
        onCalculate(payload);
    };

    return (
        <div className="card bg-secondary text-light mb-5">
            <div className="card-body">
                <form>
                    <div className="row g-3">
                        {/* Tax Year */}
                        <div className="col-md-6">
                            <label htmlFor="taxYear" className="form-label text-light">
                                Tax Year
                            </label>
                            <select
                                id="taxYear"
                                className="form-select bg-dark text-light border-secondary"
                                value={taxYear}
                                onChange={(e) => setTaxYear(e.target.value)}
                                disabled={!taxYearOptions.length && !yearError}
                                aria-live="polite"
                            >
                                {yearError ? (
                                    <option>Error loading years</option>
                                ) : taxYearOptions.length === 0 ? (
                                    <option>Loading...</option>
                                ) : (
                                    taxYearOptions.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))
                                )}
                            </select>
                            {formErrors.selectedTaxYear && (
                                <div className="text-danger">{formErrors.selectedTaxYear}</div>
                            )}
                        </div>

                        {/* Gross Income */}
                        <div className="col-md-6">
                            <label htmlFor="grossIncome" className="form-label text-light">
                                Gross Income (USD)
                            </label>
                            <input
                                id="grossIncome"
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control bg-dark text-light border-secondary"
                                value={grossIncome}
                                onChange={(e) => setGrossIncome(safeNumber(e.target.value))}
                            />
                            {formErrors.grossIncome && (
                                <div className="text-danger">{formErrors.grossIncome}</div>
                            )}
                        </div>

                        {/* Filing Status */}
                        <div className="col-md-6">
                            <label htmlFor="filingStatus" className="form-label text-light">
                                Filing Status
                            </label>
                            <select
                                id="filingStatus"
                                className="form-select bg-dark text-light border-secondary"
                                value={filingStatus}
                                onChange={(e) => setFilingStatus(e.target.value)}
                                disabled={!filingStatusOptions.length && !statusError}
                                aria-live="polite"
                            >
                                {statusError ? (
                                    <option>Error loading statuses</option>
                                ) : filingStatusOptions.length === 0 ? (
                                    <option>Loading...</option>
                                ) : (
                                    filingStatusOptions.map((statusEnum) => (
                                        <option key={statusEnum.code} value={statusEnum.code}>
                                            {statusEnum.description}
                                        </option>
                                    ))
                                )}
                            </select>
                            {formErrors.selectedFilingStatus && (
                                <div className="text-danger">{formErrors.selectedFilingStatus}</div>
                            )}
                        </div>

                        {/* Total Deductions */}
                        <div className="col-md-6">
                            <label htmlFor="totalDeductions" className="form-label text-light">
                                Total Deductions (USD)
                            </label>
                            <input
                                id="totalDeductions"
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control bg-dark text-light border-secondary"
                                value={totalDeductions}
                                onChange={(e) => setTotalDeductions(safeNumber(e.target.value))}
                            />
                            {formErrors.totalDeductions && (
                                <div className="text-danger">{formErrors.totalDeductions}</div>
                            )}
                        </div>

                        {/* Total Credits */}
                        <div className="col-md-6">
                            <label htmlFor="totalCredits" className="form-label text-light">
                                Total Credits (USD)
                            </label>
                            <input
                                id="totalCredits"
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control bg-dark text-light border-secondary"
                                value={totalCredits}
                                onChange={(e) => setTotalCredits(safeNumber(e.target.value))}
                            />
                            {formErrors.totalCredits && (
                                <div className="text-danger">{formErrors.totalCredits}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="col-md-6 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={handleSubmit}
                            >
                                Calculate Taxes
                            </button>
                        </div>

                        {/* General errors */}
                        {formErrors.general && (
                            <div className="col-12 text-danger mt-3">{formErrors.general}</div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxInputForm;
