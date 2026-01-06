import React from 'react';
import { render, screen } from '@testing-library/react';
import { LogoSPHorizontalColorida, LogoSPHorizontalMonocromatica } from '../index';
import '@testing-library/jest-dom';

describe('LogoSP', () => {
  it('deve renderizar LogoSPHorizontalColorida com alt text correto', () => {
    render(<LogoSPHorizontalColorida />);
    const img = screen.getByAltText('logo prefeitura de são paulo');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  it('deve renderizar LogoSPHorizontalMonocromatica com alt text correto', () => {
    render(<LogoSPHorizontalMonocromatica />);
    const img = screen.getByAltText('logo prefeitura de são paulo monocromática');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });
});

