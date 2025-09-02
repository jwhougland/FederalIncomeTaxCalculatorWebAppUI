import React, { useState } from 'react';
import TaxInputForm from './TaxInputForm';

const TaxCalculator = () => {

    const calculateTaxes = async (payload) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/taxCalculation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
        } catch (error) {
            console.error('Tax calculation failed: ', error);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">Federal Income Tax Estimator</h1>
            <TaxInputForm onCalculate={calculateTaxes} />
        </div>
    );
};

export default TaxCalculator;