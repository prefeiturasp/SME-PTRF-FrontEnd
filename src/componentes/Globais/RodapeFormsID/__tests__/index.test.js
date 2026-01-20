import React from 'react';
import { render, screen } from '@testing-library/react';
import { RodapeFormsID } from '../index';

describe('RodapeFormsID', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it('renderiza ID quando value é fornecido', () => {
    render(<RodapeFormsID value="12345" />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('não renderiza quando value é null', () => {
    const { container } = render(<RodapeFormsID value={null} />);
    
    expect(container).toBeEmptyDOMElement();
  });

  it('não renderiza quando value é undefined', () => {
    const { container } = render(<RodapeFormsID value={undefined} />);
    
    expect(container).toBeEmptyDOMElement();
  });

  it('não renderiza quando value é 0 (falsy)', () => {
    const { container } = render(<RodapeFormsID value={0} />);
    
    expect(container).toBeEmptyDOMElement();
  });
});

