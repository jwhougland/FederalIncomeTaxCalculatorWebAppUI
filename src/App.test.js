// src/App.test.js
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
});

test('renders app heading and loads TaxInputForm dropdowns', async () => {
    // Mock the fetch responses in the same order TaxInputForm calls them
    fetch
        .mockResponseOnce(JSON.stringify([2025, 2024])) // tax years
        .mockResponseOnce(
            JSON.stringify([{ code: 'SINGLE', description: 'Single' }]) // filing statuses
        );

    render(<App />);

    // Confirm heading is rendered
    expect(
        screen.getByText(/Federal Income Tax Estimator/i)
    ).toBeInTheDocument();

    // Wait for dropdowns to populate
    await waitFor(() => {
        expect(screen.getByLabelText(/Tax Year/i)).toHaveValue('2025');
        expect(screen.getByLabelText(/Filing Status/i)).toHaveValue('SINGLE');
    });
});
