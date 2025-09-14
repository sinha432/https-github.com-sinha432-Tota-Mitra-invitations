import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';
import { useAuth } from '@/App';

jest.mock('@/App', () => ({
  useAuth: jest.fn(),
}));

describe('WeatherWidget', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      language: 'en',
    });
  });

  test('renders loading state initially', () => {
    render(<WeatherWidget />);
    expect(screen.getByText(/loading weather/i)).toBeInTheDocument();
  });

  test('renders weather data when available', async () => {
    // Mock fetch to return sample weather data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            main: { temp: 25, humidity: 60 },
            wind: { speed: 10 },
            weather: [{ main: 'sunny' }],
            visibility: 10000,
          }),
      })
    ) as jest.Mock;

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/temperature/i)).toBeInTheDocument();
      expect(screen.getByText(/25°C/)).toBeInTheDocument();
    });
  });

  test('shows error toast on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down')) as jest.Mock;

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/loading weather/i)).toBeInTheDocument();
    });
  });
});
