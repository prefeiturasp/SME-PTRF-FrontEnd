import React from "react";
import {
    AvisoCapitalModal,
    CancelarModal,
    DeletarModal,
    ErroGeral,
    PeriodoFechado,
    PeriodoFechadoImposto,
    DespesaIncompletaNaoPermitida
} from "../../../../utils/Modais";
import {ModalErroDeletarCadastroDespesa} from "./modals/ModalErroDeletarCadastroDespesa";
import {metodosAuxiliares} from "./utils";
import {visoesService} from "../../../../services/visoes.service";

/**
 * Modais de shell (fora do Formik) do cadastro pipeline.
 */
export const DespesaFormModais = ({
    show,
    setShow,
    setLoading,
    origem,
    parametroLocation,
    showAvisoCapital,
    setShowAvisoCapital,
    despesaContext,
    showDelete,
    setShowDelete,
    onDeletarTrue,
    textoModalDelete,
    showPeriodoFechado,
    setShowPeriodoFechado,
    showPeriodoFechadoImposto,
    setShowPeriodoFechadoImposto,
    showErroGeral,
    setShowErroGeral,
    showModalErroDeletarDespesa,
    setShowModalErroDeletarDespesa,
    textoModalErroDeletarDespesa,
    showDespesaIncompletaNaoPermitida,
    setShowDespesaIncompletaNaoPermitida,
}) => {
    const aux = metodosAuxiliares;
    const visao_selecionada = visoesService.getItemUsuarioLogado("visao_selecionada.nome");

    return (
        <>
            <section>
                <CancelarModal
                    show={show}
                    handleClose={() => setShow(false)}
                    onCancelarTrue={() => aux.onCancelarTrue(setShow, setLoading, origem, parametroLocation)}
                />
            </section>
            <section>
                <AvisoCapitalModal
                    show={showAvisoCapital}
                    handleClose={() => setShowAvisoCapital(false)}
                />
            </section>
            {despesaContext.idDespesa ? (
                <DeletarModal
                    show={showDelete}
                    handleClose={() => setShowDelete(false)}
                    onDeletarTrue={() => onDeletarTrue(setShowDelete, setLoading, despesaContext, origem)}
                    texto={textoModalDelete}
                />
            ) : null}
            <section>
                {visao_selecionada === "UE" && (
                    <PeriodoFechado
                        show={showPeriodoFechado}
                        handleClose={() => setShowPeriodoFechado(false)}
                    />
                )}
            </section>
            <section>
                <PeriodoFechadoImposto
                    show={showPeriodoFechadoImposto}
                    handleClose={() => setShowPeriodoFechadoImposto(false)}
                />
            </section>
            <section>
                <ErroGeral
                    show={showErroGeral}
                    handleClose={() => setShowErroGeral(false)}
                />
            </section>
            <section>
                <ModalErroDeletarCadastroDespesa
                    show={showModalErroDeletarDespesa}
                    handleClose={() => setShowModalErroDeletarDespesa(false)}
                    titulo="Exclusão de Despesa"
                    texto={textoModalErroDeletarDespesa}
                />
            </section>
            <section>
                <DespesaIncompletaNaoPermitida
                    show={showDespesaIncompletaNaoPermitida}
                    handleClose={() => setShowDespesaIncompletaNaoPermitida(false)}
                />
            </section>
        </>
    );
};
