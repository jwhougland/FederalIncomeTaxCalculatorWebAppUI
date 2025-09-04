import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TaxInputForm from './TaxInputForm';

beforeEach(() => {
  fetch.resetMocks();
  jest.clearAllMocks();
});

describe('TaxInputForm', () => {
  test('renders tax year and filing status options (happy path)', async () => {
    fetch
      .mockResponseOnce(JSON.stringify([2025, 2024])) // taxYears
      .mockResponseOnce(JSON.stringify([{ code: 'SINGLE', description: 'Single' }])); // filingStatuses

    render(<TaxInputForm onCalculate={jest.fn()} />);

    await waitFor(() => expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025'));
    expect(screen.getByLabelText(/Filing Status/i)).toHaveValue('SINGLE');
  });

  test('handles API error gracefully', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<TaxInputForm onCalculate={jest.fn()} />);

    // Component should render fallback loading text
    expect(await screen.findAllByText(/Loading.../i)).toHaveLength(2);

    console.error.mockRestore();
  });

  test('submits correct payload on Calculate Taxes click', async () => {
    fetch
      .mockResponseOnce(JSON.stringify([2025])) // taxYears
      .mockResponseOnce(JSON.stringify([{ code: 'SINGLE', description: 'Single' }])); // filingStatuses

    const handleCalculate = jest.fn();
    render(<TaxInputForm onCalculate={handleCalculate} />);

    await waitFor(() => expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025'));

    // Fill in inputs
    fireEvent.change(screen.getByLabelText(/Gross Income/i), { target: { value: '75000' } });
    fireEvent.change(screen.getByLabelText(/Total Deductions/i), { target: { value: '12000' } });
    fireEvent.change(screen.getByLabelText(/Total Credits/i), { target: { value: '1500' } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate Taxes/i }));

    expect(handleCalculate).toHaveBeenCalledWith({
      grossIncome: 75000,
      selectedFilingStatus: 'SINGLE',
      selectedTaxYear: 2025,
      totalDeductions: 12000,
      totalCredits: 1500,
    });
  });
});
