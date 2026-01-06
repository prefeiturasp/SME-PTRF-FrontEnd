import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabSelector from '../index';
import '@testing-library/jest-dom';

describe('TabSelector', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' }
  ];

  it('deve renderizar todas as tabs', () => {
    render(<TabSelector tabs={mockTabs} activeTab="tab1" setActiveTab={jest.fn()} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('deve chamar setActiveTab quando uma tab é clicada', () => {
    const setActiveTab = jest.fn();
    render(<TabSelector tabs={mockTabs} activeTab="tab1" setActiveTab={setActiveTab} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(setActiveTab).toHaveBeenCalledWith('tab2');
  });

  it('deve aplicar estilo ativo na tab selecionada', () => {
    const { container } = render(<TabSelector tabs={mockTabs} activeTab="tab2" setActiveTab={jest.fn()} />);
    
    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toHaveStyle({ backgroundColor: '#fff' });
  });
});

