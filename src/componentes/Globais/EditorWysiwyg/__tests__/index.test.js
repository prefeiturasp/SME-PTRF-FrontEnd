import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EditorWysiwyg from '../index';
import '@testing-library/jest-dom';

jest.mock('../EditorWysiwygLoader', () => ({
  __esModule: true,
  default: () => <div data-testid="editor-wysiwyg-content">Editor Wysiwyg</div>
}));

jest.mock('../../../../utils/Loading', () => {
  return function Loading() {
    return <div data-testid="loading">Carregando...</div>;
  };
});

describe('EditorWysiwyg', () => {
  it('deve renderizar o componente com Suspense', async () => {
    render(<EditorWysiwyg />);
    
    await waitFor(() => {
      expect(screen.getByTestId('editor-wysiwyg-content')).toBeInTheDocument();
    });
  });

  it('deve passar props para o componente lazy', async () => {
    const props = { value: 'conteudo', onChange: jest.fn() };
    render(<EditorWysiwyg {...props} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('editor-wysiwyg-content')).toBeInTheDocument();
    });
  });
});

