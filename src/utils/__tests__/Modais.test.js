import { render } from "@testing-library/react";
import { 
    ModalDescartarAlteracoesValoresReprogramados,
    ModalConcluirValoresReprogramados,
    ModalConclusaoValoresReprogramadosNaoPermitido,
    ModalPublicarRelatorioConsolidadoPendente,
    ModalPublicarRelatorioConsolidado,
    ModalPublicarRetificacao,
    ModalPublicarRetificacaoPendente,
    AvisoCapitalModal,
    CancelarModal,
    DeletarModal,
    AvisoTipoReceita,
    AvisoTipoReceitaEstorno,
    ModalAtaNaoPreenchida,
    ModalConfirmarExportacao,
    ModalSalvarPrestacaoDeContasAnalise,
    SalvarModalDiretoria,
    CancelarModalDiretoria,
    AlterarEmailMeusDados,
    CancelarModalAssociacao,
    RedirectModalTabelaLancamentos,
    CancelarPrestacaoDeContas,
    SalvarPrestacaoDeContas,
    ConcluirPrestacaoDeContas,
    ErroGeral,
    ReverConciliacao,
    SaldoInsuficiente,
    TipoAplicacaoRecursoNaoAceito,
    PeriodoFechado,
    PeriodoFechadoImposto,
    DespesaIncompletaNaoPermitida,
    ExcluirImposto,
    TextoCopiado,
    SalvarValoresReprogramados,
    ChecarDespesaExistente,
    AlterarSenhaMeusDados
} from "../Modais"

test("deve renderizar o modal ModalDescartarAlteracoesValoresReprogramados corretamente", () => {
  const { getByText } = render(
    <ModalDescartarAlteracoesValoresReprogramados show={true} />
  );

  expect(getByText("Alterações não salvas")).toBeInTheDocument();
});

test("deve renderizar o ModalConcluirValoresReprogramados corretamente", () => {
    const { getByText } = render(
      <ModalConcluirValoresReprogramados show={true} />
    );
  
    expect(getByText("Concluir")).toBeInTheDocument();
});
  
test("deve renderizar o ModalConclusaoValoresReprogramadosNaoPermitido corretamente", () => {
    const { getByText } = render(
      <ModalConclusaoValoresReprogramadosNaoPermitido show={true} />
    );
  
    expect(getByText("Conclusão não permitida")).toBeInTheDocument();
});

test("deve renderizar o ModalPublicarRetificacao corretamente", () => {
    const { getByText } = render(
      <ModalPublicarRetificacao show={true} />
    );
  
    expect(getByText("Confirmar Geração")).toBeInTheDocument();
});

test("deve renderizar o ModalPublicarRetificacaoPendente corretamente", () => {
    const { getByText } = render(
      <ModalPublicarRetificacaoPendente show={true} />
    );
  
    expect(getByText("Pendência para a Geração do Consolidado")).toBeInTheDocument();
});

test("deve renderizar o ModalPublicarRelatorioConsolidadoPendente corretamente", () => {
    const { getByText } = render(
      <ModalPublicarRelatorioConsolidadoPendente show={true} />
    );
  
    expect(getByText("Pendência para a Geração do Consolidado")).toBeInTheDocument();
});
  
test("deve renderizar o ModalPublicarRelatorioConsolidado corretamente", () => {
    const { getByText } = render(
      <ModalPublicarRelatorioConsolidado show={true} />
    );
  
    expect(getByText("Confirmar Geração")).toBeInTheDocument();
});

test("deve renderizar o AvisoCapitalModal corretamente", () => {
    const { getByText } = render(
      <AvisoCapitalModal show={true} />
    );
  
    expect(getByText("Aviso")).toBeInTheDocument();
});

test("deve renderizar o CancelarModal corretamente", () => {
    const { getByText } = render(
      <CancelarModal show={true} />
    );
  
    expect(getByText("Cancelar cadastro")).toBeInTheDocument();
});

test("deve renderizar o DeletarModal corretamente", () => {
    const { getByText } = render(
      <DeletarModal show={true} />
    );
  
    expect(getByText("Deseja excluir esta Despesa?")).toBeInTheDocument();
});

test("deve renderizar o AvisoTipoReceita corretamente", () => {
    const { getByText } = render(
      <AvisoTipoReceita show={true} />
    );
  
    expect(getByText("Aviso")).toBeInTheDocument();
});

test("deve renderizar o AvisoTipoReceitaEstorno corretamente", () => {
    const { getByText } = render(
      <AvisoTipoReceitaEstorno show={true} />
    );
  
    expect(getByText("Exclusão não permitida")).toBeInTheDocument();
});
  

test("deve renderizar o ModalAtaNaoPreenchida corretamente", () => {
    const { getByText } = render(
      <ModalAtaNaoPreenchida show={true} />
    );
  
    expect(getByText("Ata não preenchida")).toBeInTheDocument();
});
  
test("deve renderizar o ModalConfirmarExportacao corretamente", () => {
    const { getByText } = render(
      <ModalConfirmarExportacao show={true} />
    );
  
    expect(getByText("Geração solicitada com sucesso")).toBeInTheDocument();
});
  
test("deve renderizar o AvisoTipoReceitaEstorno corretamente", () => {
    const { getByText } = render(
      <AvisoTipoReceitaEstorno show={true} />
    );
  
    expect(getByText("Exclusão não permitida")).toBeInTheDocument();
});
  
test("deve renderizar o ModalSalvarPrestacaoDeContasAnalise corretamente", () => {
    const { getByText } = render(
      <ModalSalvarPrestacaoDeContasAnalise show={true} />
    );
  
    expect(getByText("Informações salvas")).toBeInTheDocument();
});
  
test("deve renderizar o SalvarModalDiretoria corretamente", () => {
    const { getByText } = render(
      <SalvarModalDiretoria show={true} />
    );
  
    expect(getByText("Edição salva")).toBeInTheDocument();
});

test("deve renderizar o CancelarModalDiretoria corretamente", () => {
    const { getByText } = render(
      <CancelarModalDiretoria show={true} />
    );
  
    expect(getByText("Deseja cancelar a Edição da Diretoria?")).toBeInTheDocument();
});

test("deve renderizar o AlterarEmailMeusDados corretamente", () => {
    const { getByText } = render(
      <AlterarEmailMeusDados show={true} />
    );
  
    expect(getByText("Editar E-mail")).toBeInTheDocument();
});

test("deve renderizar o CancelarModalAssociacao corretamente", () => {
    const { getByText } = render(
      <CancelarModalAssociacao show={true} />
    );
  
    expect(getByText("Deseja cancelar a Edição da Associacao?")).toBeInTheDocument();
});
  

test("deve renderizar o RedirectModalTabelaLancamentos corretamente", () => {
    const { getByText } = render(
      <RedirectModalTabelaLancamentos show={true} />
    );
  
    expect(getByText("Edição do lançamento")).toBeInTheDocument();
});

test("deve renderizar o CancelarPrestacaoDeContas corretamente", () => {
    const { getByText } = render(
      <CancelarPrestacaoDeContas show={true} />
    );
  
    expect(getByText("Deseja cancelar a conciliação?")).toBeInTheDocument();
});

test("deve renderizar o SalvarPrestacaoDeContas corretamente", () => {
    const { getByText } = render(
      <SalvarPrestacaoDeContas show={true} />
    );
  
    expect(getByText("Salvar informações")).toBeInTheDocument();
});

test("deve renderizar o ConcluirPrestacaoDeContas corretamente", () => {
    const { getByText } = render(
      <ConcluirPrestacaoDeContas show={true} />
    );
  
    expect(getByText("Deseja concluir a conciliação?")).toBeInTheDocument();
});


test("deve renderizar o ErroGeral corretamente", () => {
    const { getByText } = render(
      <ErroGeral show={true} />
    );
  
    expect(getByText("Ooops!!! Algum erro aconteceu")).toBeInTheDocument();
});

test("deve renderizar o ReverConciliacao corretamente", () => {
    const { getByText } = render(
      <ReverConciliacao show={true} textareaModalReverConciliacao={""}/>
    );
  
    expect(getByText("Reabertura prévia da prestação de contas do período")).toBeInTheDocument();
});

test("deve renderizar o SaldoInsuficiente corretamente", () => {
    const { getByText } = render(
      <SaldoInsuficiente show={true} saldosInsuficientesDaAcao={{ saldos_insuficientes: []}}/>
    );
  
    expect(getByText("Saldo Insuficiente")).toBeInTheDocument();
});

test("deve renderizar o TipoAplicacaoRecursoNaoAceito corretamente", () => {
    const { getByText } = render(
      <TipoAplicacaoRecursoNaoAceito show={true} />
    );
  
    expect(getByText("Tipo de aplicação não aceito pela ação")).toBeInTheDocument();
});

test("deve renderizar o PeriodoFechado corretamente", () => {
    const { getByText } = render(
      <PeriodoFechado show={true} />
    );
  
    expect(getByText("Período Fechado")).toBeInTheDocument();
});

test("deve renderizar o PeriodoFechadoImposto corretamente", () => {
    const { getByText } = render(
      <PeriodoFechadoImposto show={true} />
    );
  
    expect(getByText("Período Fechado")).toBeInTheDocument();
});

test("deve renderizar o DespesaIncompletaNaoPermitida corretamente", () => {
    const { getByText } = render(
      <DespesaIncompletaNaoPermitida show={true} />
    );
  
    expect(getByText("Despesa incompleta")).toBeInTheDocument();
});

test("deve renderizar o ExcluirImposto corretamente", () => {
    const { getByText } = render(
      <ExcluirImposto show={true} />
    );
  
    expect(getByText("Excluir imposto")).toBeInTheDocument();
});

test("deve renderizar o TextoCopiado corretamente", () => {
    const { getByText } = render(
      <TextoCopiado show={true} />
    );
  
    expect(getByText("Texto copiado com sucesso")).toBeInTheDocument();
});

test("deve renderizar o SalvarValoresReprogramados corretamente", () => {
    const { getByText } = render(
      <SalvarValoresReprogramados show={true} />
    );
  
    expect(getByText("Todos os dados estão corretos?")).toBeInTheDocument();
});

test("deve renderizar o ChecarDespesaExistente corretamente", () => {
    const { getByText } = render(
      <ChecarDespesaExistente show={true} />
    );
  
    expect(getByText("Despesa já cadastrada")).toBeInTheDocument();
});

test("deve renderizar o AlterarSenhaMeusDados corretamente", () => {
    const { getByText } = render(
      <AlterarSenhaMeusDados show={true} />
    );
  
    expect(getByText("Editar Senha")).toBeInTheDocument();
});