import React, { useState } from 'react';
import TaxInputForm from './TaxInputForm';
import TaxCalculationResultSummary from './TaxCalculationResultSummary';

const TaxCalculator = () => {

    const [taxCalculationResultSummaryData, setTaxCalculationResultSummaryData] = useState([]);
    const [formErrors, setFormErrors] = useState({}); // store backend validation errors

    const calculateTaxes = async (payload) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/taxCalculation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // extract error JSON returned by Spring
                const errorData = await response.json();
                // errorData will be an object like { fieldName: "message" }
                console.error('Validation errors:', errorData);
                // optionally, set to state to display in UI
                setFormErrors(errorData);
                setTaxCalculationResultSummaryData([]); // clear previous results
                return;
            }

            const data = await response.json();
            // Ensure we always pass an array to Tabulator
            const tableData = Array.isArray(data) ? data : [data];

            setTaxCalculationResultSummaryData(tableData);
	    
            setFormErrors({}); // clear previous errors
        } catch (error) {
            console.error('Tax calculation failed: ', error);
            setFormErrors({ general: 'Unexpected error occurred' });
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">Federal Income Tax Estimator</h1>
            <TaxInputForm 
                onCalculate={calculateTaxes} 
                formErrors={formErrors} // pass errors to form
            />
            <TaxCalculationResultSummary data={taxCalculationResultSummaryData} />
        </div>
    );
};

export default TaxCalculator;