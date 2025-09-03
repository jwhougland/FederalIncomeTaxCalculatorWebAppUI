import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TaxInputForm from './TaxInputForm';

beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
});

describe('TaxInputForm', () => {
    test('renders tax year and filing status options (happy path)', async () => {
        fetch
            .mockResponseOnce(JSON.stringify([2025, 2024])) // tax years
            .mockResponseOnce(
                JSON.stringify([{ code: 'SINGLE', description: 'Single' }]) // filing statuses
            );

        render(<TaxInputForm onCalculate={jest.fn()} />);

        // Wait until async fetches populate dropdowns
        await waitFor(() => {
            expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025');
        });

        expect(screen.getByLabelText(/Filing Status/i)).toHaveValue('SINGLE');
    });

    test('handles API error gracefully', async () => {
        // Simulate both endpoints failing
        fetch.mockReject(() => Promise.reject('API is down'));

        // Silence console.error for this test
        jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<TaxInputForm onCalculate={jest.fn()} />);

        // Component should render fallback loading text
        expect(await screen.findAllByText(/Loading.../i)).toHaveLength(2);

        console.error.mockRestore(); // restore console
    });

    test('submits correct payload on Calculate Taxes click', async () => {
        fetch
            .mockResponseOnce(JSON.stringify([2025])) // tax years
            .mockResponseOnce(
                JSON.stringify([{ code: 'SINGLE', description: 'Single' }]) // filing statuses
            );

        const handleCalculate = jest.fn();
        render(<TaxInputForm onCalculate={handleCalculate} />);

        // Wait for dropdowns
        await waitFor(() => {
            expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025');
        });

        // Fill in inputs
        fireEvent.change(screen.getByLabelText(/Gross Income/i), {
            target: { value: '75000' },
        });
        fireEvent.change(screen.getByLabelText(/Total Deductions/i), {
            target: { value: '12000' },
        });
        fireEvent.change(screen.getByLabelText(/Total Credits/i), {
            target: { value: '1500' },
        });

        // Click button
        fireEvent.click(screen.getByRole('button', { name: /Calculate Taxes/i }));

        // Verify payload
        expect(handleCalculate).toHaveBeenCalledWith({
            grossIncome: 75000,
            selectedFilingStatus: 'SINGLE',
            selectedTaxYear: 2025,
            totalDeductions: 12000,
            totalCredits: 1500,
        });
    });
});
