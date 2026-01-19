import React from 'react';
import { render, waitFor } from '@testing-library/react';
import EditorWysiwygCustom from '../index';

jest.mock('../EditorWysiwygCustomLoader', () => {
  return function EditorWysiwygCustomLoader() {
    return <div data-testid="editor-loader">Editor</div>;
  };
});

describe('EditorWysiwygCustom', () => {
  it('renderiza componente', async () => {
    const { container } = render(<EditorWysiwygCustom />);
    
    expect(container).toBeInTheDocument();
    
    await waitFor(() => {
      expect(container.querySelector('[data-testid="editor-loader"]')).toBeInTheDocument();
    });
  });
});

