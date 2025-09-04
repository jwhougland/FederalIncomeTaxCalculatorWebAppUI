// Mock ReactTabulator
jest.mock('react-tabulator', () => ({
  ReactTabulator: ({ data }) => (
    <div data-testid="tabulator-mock">
      {data.map((row, i) => (
        <div key={i}>
          <span>Total Tax Owed: {row.federalTaxOwed}</span>
          <span>Effective Tax Rate: {row.effectiveTaxRate}</span>
        </div>
      ))}
    </div>
  ),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaxCalculator from './TaxCalculator';

// Set environment variable for API URL
process.env.REACT_APP_API_URL = 'http://localhost:4000';

beforeEach(() => {
  fetch.resetMocks();
  jest.clearAllMocks();
});

describe('TaxCalculator', () => {
  test('submits payload and displays tax result summary', async () => {
    // Mock API responses
    fetch
      .mockResponseOnce(JSON.stringify([2025, 2024])) // taxYears
      .mockResponseOnce(JSON.stringify([{ code: 'SINGLE', description: 'Single' }])) // filingStatuses
      .mockResponseOnce(
        JSON.stringify([
          {
            federalTaxOwed: '$5000',
            effectiveTaxRate: '14.3%',
            marginalTaxRate: '22%',
            takeHomePay: '$30000',
          },
        ])
      ); // taxCalculation

    render(<TaxCalculator />);

    // Wait for dropdowns to populate
    await waitFor(() => screen.getByLabelText(/Tax Year/i));
    await waitFor(() => screen.getByLabelText(/Filing Status/i));

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Gross Income/i), { target: { value: 35000 } });
    fireEvent.change(screen.getByLabelText(/Total Deductions/i), { target: { value: 0 } });
    fireEvent.change(screen.getByLabelText(/Total Credits/i), { target: { value: 0 } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate Taxes/i }));

    // Verify mocked Tabulator output
    await waitFor(() => {
      expect(screen.getByText(/Total Tax Owed/i)).toBeInTheDocument();
      expect(screen.getByText(/\$5000/)).toBeInTheDocument();
      expect(screen.getByText(/Effective Tax Rate/i)).toBeInTheDocument();
    });
  });
});
