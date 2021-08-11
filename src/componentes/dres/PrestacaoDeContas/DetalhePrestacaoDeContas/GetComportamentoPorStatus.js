import React, {Fragment} from "react";
import {Cabecalho} from "./Cabecalho";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";
import {CobrancaPrestacaoDeContas} from "./CobrancaPrestacaoDeContas";
import {DevolucoesPrestacaoDeContas} from "./DevolucoesPrestacaoDeContas";
import {InformacoesPrestacaoDeContas} from "./InformacoesPrestacaoDeContas";
import {InformacoesDevolucaoAoTesouro} from "./InformacoesDevolucaoAoTesouro";
import {ResumoFinanceiroSeletorDeContas} from "./ResumoFinanceiroSeletorDeContas";
import {AnalisesDeContaDaPrestacao} from "./AnalisesDeContaDaPrestacao";
import {ResumoFinanceiroTabelaTotais} from "./ResumoFinanceiroTabelaTotais";
import {ResumoFinanceiroTabelaAcoes} from "./ResumoFinanceiroTabelaAcoes";
import {CobrancaDevolucoesPrestacaoDeContas} from "./CobrancaDevolucoesPrestacaoDeContas";
import {ComentariosDeAnalise} from "./ComentariosDeAnalise";


export const GetComportamentoPorStatus = (
    {
        prestacaoDeContas,
        receberPrestacaoDeContas,
        setShowReabrirPc,
        stateFormRecebimentoPelaDiretoria,
        handleChangeFormRecebimentoPelaDiretoria,
        tabelaPrestacoes,
        listaDeCobrancas,
        dataCobranca,
        handleChangeDataCobranca,
        addCobranca,
        deleteCobranca,
        retornaNumeroOrdinal,
        analisarPrestacaoDeContas,
        setShowNaoRecebida,
        salvarAnalise,
        setShowConcluirAnalise,
        setShowRecebida,
        handleChangeFormInformacoesPrestacaoDeContas,
        informacoesPrestacaoDeContas,
        initialFormDevolucaoAoTesouro,
        formRef,
        despesas,
        buscaDespesaPorFiltros,
        buscaDespesa,
        valorTemplate,
        despesasTabelas,
        tiposDevolucao,
        validateFormDevolucaoAoTesouro,
        infoAta,
        clickBtnEscolheConta,
        toggleBtnEscolheConta,
        exibeAtaPorConta,
        infoAtaPorConta,
        analisesDeContaDaPrestacao,
        handleChangeAnalisesDeContaDaPrestacao,
        getObjetoIndexAnalise,
        toggleBtnTabelaAcoes,
        clickBtnTabelaAcoes,
        listaDeCobrancasDevolucoes,
        dataCobrancaDevolucoes,
        handleChangeDataCobrancaDevolucoes,
        addCobrancaDevolucoes,
        deleteCobrancaDevolucoes,
        setShowVoltarParaAnalise,
        btnSalvarDisabled,
        setBtnSalvarDisabled
    }) => {

        console.log("XXXXXXXXXXXXXXX INFO ATA ", infoAtaPorConta)

    if (prestacaoDeContas && prestacaoDeContas.status) {
        if (prestacaoDeContas.status === 'NAO_RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Receber"}
                        textoBtnRetroceder={"Reabrir PC"}
                        metodoAvancar={receberPrestacaoDeContas}
                        metodoRetroceder={() => setShowReabrirPc(true)}
                        disabledBtnAvancar={!stateFormRecebimentoPelaDiretoria.data_recebimento}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={false}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={true}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Não recebida"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={() => setShowNaoRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={false}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                </>
            )

        } else if (prestacaoDeContas.status === 'EM_ANALISE') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={true}
                        metodoSalvarAnalise={salvarAnalise}
                        btnSalvarDisabled={btnSalvarDisabled}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={true}
                    />
                    <InformacoesDevolucaoAoTesouro
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        initialValues={initialFormDevolucaoAoTesouro}
                        formRef={formRef}
                        despesas={despesas}
                        buscaDespesaPorFiltros={buscaDespesaPorFiltros}
                        buscaDespesa={buscaDespesa}
                        valorTemplate={valorTemplate}
                        despesasTabelas={despesasTabelas}
                        tiposDevolucao={tiposDevolucao}
                        validateFormDevolucaoAoTesouro={validateFormDevolucaoAoTesouro}
                        setBtnSalvarDisabled={setBtnSalvarDisabled}
                    />
                         {/**************************/}
                        <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta, index)=>
                                            <Fragment key={conta.conta_associacao.uuid}>
                                            <a
                                                onClick={()=>{
                                                        toggleBtnEscolheConta(index);
                                                        exibeAtaPorConta(conta.conta_associacao.nome)
                                                }}

                                                className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}
                                                id= {`nav-${conta.conta_associacao.uuid}-tab`}
                                                //id="nav-home-tab"
                                                data-toggle="tab"
                                                href={`#nav-${conta.conta_associacao.uuid}`}
                                                //href="#nav-home"
                                                role="tab"
                                                aria-controls="nav-home"
                                                aria-selected="true"
                                            >
                                                    Conta {conta.conta_associacao.nome}
                                            </a>
                                            {/*<button*/}
                                            {/*    type='button'*/}
                                            {/*    onClick={()=>{*/}
                                            {/*            toggleBtnEscolheConta(index);*/}
                                            {/*            exibeAtaPorConta(conta.conta_associacao.nome)*/}
                                            {/*    }}*/}
                                            {/*    className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}*/}
                                            {/*>*/}
                                            {/*        Conta {conta.conta_associacao.nome}*/}
                                            {/*</button>*/}
                                            </Fragment>

                                        )}
                                        <a className="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
                                </div>
                        </nav>
                        {infoAtaPorConta && infoAtaPorConta.conta_associacao && infoAtaPorConta.conta_associacao.uuid &&
                                <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade show active"
                                             id={`nav-${infoAtaPorConta.conta_associacao.uuid}`}
                                            //id="nav-home"
                                             role="tabpanel"
                                             aria-labelledby={`nav-${infoAtaPorConta.conta_associacao.uuid}-tab`}>OLLYVER {infoAtaPorConta.conta_associacao.nome}</div>
                                </div>
                        }


                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />

                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={true}
                    />

                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                        {/**************************/}
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={true}
                    />
                    <CobrancaDevolucoesPrestacaoDeContas
                        listaDeCobrancasDevolucoes={listaDeCobrancasDevolucoes}
                        dataCobrancaDevolucoes={dataCobrancaDevolucoes}
                        handleChangeDataCobrancaDevolucoes={handleChangeDataCobrancaDevolucoes}
                        addCobrancaDevolucoes={addCobrancaDevolucoes}
                        deleteCobrancaDevolucoes={deleteCobrancaDevolucoes}
                        editavel={true}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />
                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}
                    />
                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'APROVADA_RESSALVA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={false}
                        esconderBotaoAvancar={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        prestacaoDeContas={prestacaoDeContas}
                        exibeMotivo={true}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />
                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}
                    />
                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'APROVADA' || prestacaoDeContas.status === 'REPROVADA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={false}
                        esconderBotaoAvancar={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        prestacaoDeContas={prestacaoDeContas}
                        exibeMotivo={false}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />
                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}
                    />
                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        }
    }
};