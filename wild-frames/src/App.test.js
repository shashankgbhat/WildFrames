import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the WildFrames brand', () => {
  render(<App />);
  expect(screen.getByText(/WildFrames/i)).toBeInTheDocument();
});
