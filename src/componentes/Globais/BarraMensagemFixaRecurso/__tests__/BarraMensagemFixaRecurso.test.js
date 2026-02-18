import { render, screen } from "@testing-library/react";
import React from "react";
import { BarraMensagemFixaRecurso } from "../index";
import { BarraMensagemFixaProvider } from "../../BarraMensagemFixa/context/BarraMensagemFixaProvider";

describe('<BarraMensagemFixaRecurso>', () => {
  test('Deve renderizar a barra com mensagem customizada', () => {
    const mensagemCustomizada = "Você está acessando com o recurso TESTE";
    
    render(
      <BarraMensagemFixaProvider mensagem={mensagemCustomizada}>
        <BarraMensagemFixaRecurso />
      </BarraMensagemFixaProvider>
    );
    
    expect(screen.getByText(mensagemCustomizada)).toBeInTheDocument();
  });

  test('Deve renderizar o componente sem erros', () => {
    const { container } = render(
      <BarraMensagemFixaProvider mensagem="Mensagem de teste">
        <BarraMensagemFixaRecurso />
      </BarraMensagemFixaProvider>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Deve aplicar classes CSS corretas da barra de mensagem', () => {
    const { container } = render(
      <BarraMensagemFixaProvider mensagem="Teste" fixed={true}>
        <BarraMensagemFixaRecurso />
      </BarraMensagemFixaProvider>
    );
    
    // Verificar se o componente renderiza sem erros
    const barraMensagem = container.querySelector('[class*="barra-mensagem-fixa-container"]');
    expect(barraMensagem).toBeInTheDocument();
  });
});
