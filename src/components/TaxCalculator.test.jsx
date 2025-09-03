// src/components/TaxCalculator.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaxCalculator from './TaxCalculator';

// Mock react-tabulator so it doesn't try to render Tabulator in tests
jest.mock('react-tabulator', () => {
    return {
        ReactTabulator: ({ data }) => (
            <div data-testid="tabulator-mock">
                {data?.totalTaxOwed !== undefined && (
                    <div>Total Tax Owed: ${data.totalTaxOwed}</div>
                )}
                {data?.effectiveTaxRate !== undefined && (
                    <div>Effective Tax Rate: {data.effectiveTaxRate * 100}%</div>
                )}
            </div>
        ),
    };
});

beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
});

test('submits payload and displays tax result summary', async () => {
    // Mock the API responses
    fetch
        .mockResponseOnce(JSON.stringify([2025])) // TaxInputForm taxYears
        .mockResponseOnce(JSON.stringify([{ code: 'SINGLE', description: 'Single' }])) // Filing statuses
        .mockResponseOnce(
            JSON.stringify({
                totalTaxOwed: 5000,
                effectiveTaxRate: 0.15,
                taxableIncome: 35000,
            }) // TaxCalculationResultSummary
        );

    render(<TaxCalculator />);

    // Wait for dropdowns to populate
    await waitFor(() => {
        expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025');
        expect(screen.getByLabelText(/Filing Status/i)).toHaveValue('SINGLE');
    });

    // Fill in form
    fireEvent.change(screen.getByLabelText(/Gross Income/i), { target: { value: '35000' } });
    fireEvent.change(screen.getByLabelText(/Total Deductions/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Total Credits/i), { target: { value: '0' } });

    // Click calculate
    fireEvent.click(screen.getByRole('button', { name: /Calculate Taxes/i }));

    // Wait for mocked Tabulator summary to appear
    await waitFor(() => {
        expect(screen.getByText(/Total Tax Owed/i)).toBeInTheDocument();
        expect(screen.getByText(/\$5000/)).toBeInTheDocument();
        expect(screen.getByText(/Effective Tax Rate/i)).toBeInTheDocument();
        expect(screen.getByText(/15%/)).toBeInTheDocument();
    });
});

test('logs error if tax calculation API fails', async () => {
    fetch
        .mockResponseOnce(JSON.stringify([2025]))
        .mockResponseOnce(JSON.stringify([{ code: 'SINGLE', description: 'Single' }]))
        .mockRejectOnce(new Error('API down'));

    // Silence console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<TaxCalculator />);

    await waitFor(() => {
        expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025');
    });

    fireEvent.click(screen.getByRole('button', { name: /Calculate Taxes/i }));

    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Tax calculation failed:'),
            expect.any(Error)
        );
    });

    console.error.mockRestore();
});
