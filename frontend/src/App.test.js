import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  expect(screen.getByText(/CI\/CD Demo App/i)).toBeInTheDocument();
});

test('shows loading state for backend', () => {
  render(<App />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
