// src/setupTests.js
import '@testing-library/jest-dom'; // no /extend-expect
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks globally for all tests
fetchMock.enableMocks();
