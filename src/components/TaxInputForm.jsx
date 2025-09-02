import React, { useState, useEffect } from 'react';

const TaxInputForm = ({ onCalculate }) => {

    const [grossIncome, setGrossIncome] = useState('');
    const [filingStatusOptions, setFilingStatusOptions] = useState([]);
    const [filingStatus, setFilingStatus] = useState('');
    const [taxYearOptions, setTaxYearOptions] = useState([]);
    const [taxYear, setTaxYear] = useState('');
    const [totalDeductions, setTotalDeductions] = useState('');
    const [totalCredits, setTotalCredits] = useState('');    

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/taxYears`)
            .then((res) => res.json())
            .then((data) => {
                setTaxYearOptions(data);
                setTaxYear(data?.[0] ?? '');
            })
            .catch((err) => console.error('Error fetching available tax years: ', err));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/filingStatuses`)
            .then((res) => res.json())
            .then((data) => {
                setFilingStatusOptions(data)
                setFilingStatus(data?.[0].code ?? '');
            })
            .catch((err) => console.error('Error fetching filing statuses: ', err));
    }, []);

    const handleSubmit = () => {
        const payload = {
            grossIncome: parseFloat(grossIncome) || 0,
            selectedFilingStatus: filingStatus,
            selectedTaxYear: parseInt(taxYear, 10),
            totalDeductions: parseFloat(totalDeductions) || 0,
            totalCredits: parseFloat(totalCredits) || 0
        };
        onCalculate(payload);
    }

    return (
        <div className="card bg-secondary text-light mb-5">
            <div className="card-body">
                <form>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="taxYear" className="form-label text-light">Tax Year</label>
                            <select 
                                className="form-select bg-dark text-light border-secondary"
                                value={taxYear}
                                onChange={(e) => setTaxYear(e.target.value)}
                            >
                                {taxYearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="grossIncome" className="form-label text-light">Gross Income (USD)</label>
                            <input 
                                id="grossIncome"
                                type="number"
                                step="0.01"
                                className="form-control bg-dark text-light border-secondary"
                                value={grossIncome}
                                onChange={(e) => setGrossIncome(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="filingStatus" className="form-label text-light">Filing Status</label>
                            <select
                                className="form-select bg-dark text-light border-secondary"
                                value={filingStatus}
                                onChange={(e) => setFilingStatus(e.target.value)}
                            >
                                {filingStatusOptions.map((statusEnum) => (
                                    <option key={statusEnum.code} value={statusEnum.code}>
                                        {statusEnum.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="totalDeductions" className="form-label text-light">Total Deductions (USD)</label>
                            <input
                                id="totalDeductions"
                                type="number"
                                step="0.01"
                                className="form-control bg-dark text-light border-secondary"
                                value={totalDeductions}
                                onChange={(e) => setTotalDeductions(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="totalCredits" className="form-label text-light">Total Credits (USD)</label>
                            <input
                                id="totalCredits"
                                type="number"
                                step="0.01"
                                className="form-control bg-dark text-light border-secondary"
                                value={totalCredits}
                                onChange={(e) => setTotalCredits(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6 d-flex align-items-end">                            
                            <button type="button" className="btn btn-primary w-100" onClick={handleSubmit}>
                                Calculate Taxes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxInputForm;
 