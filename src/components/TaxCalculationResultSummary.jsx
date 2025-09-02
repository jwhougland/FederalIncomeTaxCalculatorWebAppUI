import React from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'tabulator-tables/dist/css/tabulator_midnight.min.css';


const TaxCalculationResultSummary = ({ data }) => {

    const columns = [
        { title: 'Tax Bracket (%)', field: 'marginalTaxRate', hozAlign: 'left' },
        { title: 'Income Tax (USD)', field: 'federalTaxOwed', hozAlign: 'left' },
        { title: 'Effective Tax Rate (%)', field: 'effectiveTaxRate', hozAlign: 'left' },
        { title: 'Take Home Pay (USD)', field: 'takeHomePay', hozAlign: 'left' }
    ];

    if (data.length === 0) return null;

    return (
        <div className="mb-5">
            <h2 className="h5 mb-3">Federal Income Tax Results:</h2>
            <ReactTabulator
                data={data}
                columns={columns}
                options={{
                    layout: "fitColumns",
                    responsiveLayout: "hide"
                }}
                className="mb-4"
            />
        </div>
    );
};

export default TaxCalculationResultSummary;