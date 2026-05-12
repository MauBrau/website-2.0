import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the app with header containing site name', () => {
  render(<App />);
  const nameElements = screen.getAllByText(/Maude/i);
  expect(nameElements.length).toBeGreaterThan(0);
});

test('renders navigation links for all pages', () => {
  render(<App />);
  expect(screen.getAllByText(/home/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/resume/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/projects/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
});
