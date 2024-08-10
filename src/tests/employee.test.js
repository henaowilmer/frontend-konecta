import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Tables from 'layouts/employees';
import { AuthContext } from 'context';
import '@testing-library/jest-dom';
import { Suspense } from 'react';
import { MaterialUIControllerProvider } from 'context';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import pxToRem from 'assets/theme/functions/pxToRem'; 

const mockTheme = createTheme({
    palette: {
        transparent: {
            main: '#ffffff', // Define un color mock para transparent.main
        },
        white: {
            main: '#ffffff', // Define un color mock para white.main
        },
        dark: {
            main: '#ffffff', // Define un color mock para white.main
        },
        background: {
            default: '#f0f0f0', // Define un color mock para background.default
        },
        gradients: {
            info: { main: '#000', state: '#111' },
            primary: { main: '#222', state: '#333' },
        },
        text: { main: '#000' },
    },
    functions: {
        linearGradient: (color1, color2) => `linear-gradient(${color1}, ${color2})`,
        pxToRem: (value) => `${value / 16}rem`, 
    },
    borders: {
        borderRadius: '8px',
    },
    boxShadows: {
        colored: {
            primary: '0px 4px 20px 0px rgba(0, 0, 0, 0.1)',
        },
    },
});

jest.mock('assets/theme/functions/pxToRem', () => jest.fn((value) => `${value / 16}rem`));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
    LocalizationProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
    AdapterDayjs: () => <div />
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
    DatePicker: (props) => <input {...props} />
}));

jest.mock('services/employee-service', () => ({
  delete: jest.fn(),
}));

jest.mock('layouts/employees/data', () => jest.fn(() => Promise.resolve({
  columns: [],
  rows: [],
  totalRecords: 0,
})));

jest.mock('@mui/material/Dialog', () => (props) => (
  <div data-testid="dialog" {...props} />
));

jest.mock('@mui/material/DialogActions', () => (props) => (
  <div data-testid="dialog-actions" {...props} />
));

jest.mock('@mui/material/DialogContent', () => (props) => (
  <div data-testid="dialog-content" {...props} />
));

jest.mock('@mui/material/DialogContentText', () => (props) => (
  <div data-testid="dialog-content-text" {...props} />
));

jest.mock('@mui/material/DialogTitle', () => (props) => (
  <div data-testid="dialog-title" {...props} />
));

jest.mock('layouts/employees/form', () => () => <div>FormEmployee Component</div>);

describe('Tables Component', () => {
  const mockAuthContext = { isAdmin: true };

  test('renders the component', async () => {
    render(
        <ThemeProvider theme={mockTheme}>
            <Router>
                <MaterialUIControllerProvider>
                    <AuthContext.Provider value={mockAuthContext}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Tables />
                        </Suspense>
                    </AuthContext.Provider>
                </MaterialUIControllerProvider>
            </Router>
        </ThemeProvider>
    );

    expect(screen.getByText(/Tabla de empleados/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Buscar.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Limpiar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear/i })).toBeInTheDocument();
  });

  test('handles filter input change', () => {
    render(
        <ThemeProvider theme={mockTheme}>
            <Router>
                <MaterialUIControllerProvider>
                    <AuthContext.Provider value={mockAuthContext}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Tables />
                        </Suspense>
                    </AuthContext.Provider>
                </MaterialUIControllerProvider>
            </Router>
        </ThemeProvider>
    );

    const searchInput = screen.getByLabelText(/Buscar.../i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(searchInput.value).toBe('John');
  });

  test('opens the create form dialog', () => {
    render(
        <ThemeProvider theme={mockTheme}>
            <Router>
                <MaterialUIControllerProvider>
                    <AuthContext.Provider value={mockAuthContext}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Tables />
                        </Suspense>
                    </AuthContext.Provider>
                </MaterialUIControllerProvider>
            </Router>
        </ThemeProvider>
    );

    const createButton = screen.getByRole('button', { name: /Crear/i });
    fireEvent.click(createButton);

    expect(screen.getByText(/Empleado/i)).toBeInTheDocument();
  });
});
