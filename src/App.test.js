/*
- File Name: App.test.js
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  render ,
  screen , 
  App
  }
- Contributors: shrouk ahmed , rania rabie ,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : containing test cases that verify the behavior and functionality of the main App component
*/
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
