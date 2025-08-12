import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Record Manager title', () => {
  render(<App />);
  const title = screen.getByText(/Record Manager/i);
  expect(title).toBeInTheDocument();
});
