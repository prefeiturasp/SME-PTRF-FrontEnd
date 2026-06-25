import React, {memo, useCallback, useState} from "react";
import {Formik} from "formik";
import {YupSignupSchemaMarcarPublicacaoNoDiarioOficial} from "../YupSignupSchemaMarcarPublicacaoNoDiarioOficial";
import {DatePickerField} from "../../../Globais/DatePickerField";
import moment from "moment";
import {
    postDesmarcarComoPublicadoNoDiarioOficial,
    postMarcarComoPublicadoNoDiarioOficial
} from "../../../../services/dres/RelatorioConsolidado.service";
import {toastCustom} from "../../../Globais/ToastCustom";
import ModalConfirmDesmarcarPublicacaoNoDiarioOficial from "../ModalConfirmDesmarcarPublicacaoNoDiarioOficial";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";

const FormMarcarPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao, handleClose, textoMsg, textoBotaoSalvar}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    const habilita_exibicao_de_lauda = recursoSelecionado?.habilita_exibicao_de_lauda;

    const texto_documento_consolidado_pc = new TextoDocumentoConsolidadoPC(habilita_exibicao_de_lauda)

    const text_normal_remover = texto_documento_consolidado_pc.texto_remover_publicacao();
    const text_removido = texto_documento_consolidado_pc.texto_removido();
    const text_possessive = texto_documento_consolidado_pc.possessivo();
    const text_aplicada = texto_documento_consolidado_pc.texto_publicacao_aplicada();
    const texto_publicacao = texto_documento_consolidado_pc.texto_input_label();

    const texto_info = `Selecione a data ${texto_publicacao}.`;

    const initialState = {
        habilita_exibicao_de_lauda,
        data_publicacao: consolidadoDre.data_publicacao,
        pagina_publicacao: consolidadoDre.pagina_publicacao,
    }

    const [showModalConfirmDesmarcarPublicacaoNoDiarioOficial, setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial] = useState(false);

    const marcarComoPublicado = useCallback( async (values) => {
        const payload ={
            consolidado_dre: consolidadoDre.uuid,
            data_publicacao: values.data_publicacao = moment(values.data_publicacao).format("YYYY-MM-DD"),
            pagina_publicacao: values.pagina_publicacao,
        }
        try {
            await postMarcarComoPublicadoNoDiarioOficial(payload)
            handleClose()
            toastCustom.ToastCustomSuccess(`Data ${text_aplicada} com sucesso.`, `${textoMsg}`)
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        } catch {
            handleClose()
        }
    }, [carregaConsolidadosDreJaPublicadosProximaPublicacao, consolidadoDre.uuid, handleClose, textoMsg])

    const desmarcarComoPublicado = async () => {
        const payload ={
            consolidado_dre: consolidadoDre.uuid,
        }

        try {
            await postDesmarcarComoPublicadoNoDiarioOficial(payload)
            handleClose()
            setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(false)
            toastCustom.ToastCustomSuccess(`Informação ${text_possessive} removida com sucesso.`, `Data ${text_removido}`)
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        } catch {
            handleClose()
            setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(false)
        }
    }

    const verificaSeHabilitaBotaoExclusao = () =>{
        let hasPublicationPage = true;

        if (habilita_exibicao_de_lauda) {
            hasPublicationPage = consolidadoDre?.pagina_publicacao
        }

        return hasPublicationPage
            && consolidadoDre?.data_publicacao
            && consolidadoDre?.status_sme !== 'EM_ANALISE'
            && consolidadoDre?.permite_excluir_data_e_pagina_publicacao
    }

  return(
      <>
          <Formik
              initialValues={initialState}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={YupSignupSchemaMarcarPublicacaoNoDiarioOficial}
              enableReinitialize={true}
              onSubmit={marcarComoPublicado}
          >
              {props => {
                  const {
                      setFieldValue,
                  } = props;
                  return (
                      <form onSubmit={props.handleSubmit}>
                          <p>{texto_info}</p>
                          <div className="mt-2">
                              <label htmlFor="data">Data</label>
                              <DatePickerField
                                  name="data_publicacao"
                                  id="data_publicacao"
                                  value={props.values.data_publicacao}
                                  onChange={setFieldValue}
                              />
                              {props.errors.data_publicacao && <span className="span_erro text-danger mt-1"> {props.errors.data_publicacao}</span>}
                          </div>
                          
                          {
                            habilita_exibicao_de_lauda &&
                            <div className='mt-2'>
                                <label htmlFor="pagina_publicacao">Informar página da lauda no Diário Oficial</label>
                                <input
                                    type="text"
                                    value={props.values.pagina_publicacao}
                                    name="pagina_publicacao"
                                    id="pagina_publicacao"
                                    className="form-control"
                                    onChange={props.handleChange}
                                />
                                {props.errors.pagina_publicacao && <span className="span_erro text-danger mt-1"> {props.errors.pagina_publicacao} </span>}
                            </div>
                          }

                          <div className="d-flex bd-highlight align-items-center">
                              <div className="py-2 flex-grow-1 bd-highlight">
                                  <button
                                      onClick={()=>setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(true)}
                                      type='button'
                                      className='btn btn-danger'
                                      disabled={!verificaSeHabilitaBotaoExclusao()}
                                  >
                                      Remover
                                  </button>
                              </div>
                              <div className="py-2 bd-highlight">
                                  <button onClick={handleClose} type="button" className="btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                  <button type="submit" className="btn btn-success mt-2">{textoBotaoSalvar}</button>
                              </div>
                          </div>

                      </form>
                  )
              }}
          </Formik>
          <section>
              <ModalConfirmDesmarcarPublicacaoNoDiarioOficial
                  show={showModalConfirmDesmarcarPublicacaoNoDiarioOficial}
                  onHide={()=>setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(false)}
                  handleClose={()=>setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(false)}
                  titulo={text_normal_remover}
                  texto={`<p>Deseja remover a data ${texto_publicacao}?</p>`}
                  segundoBotaoOnclick={desmarcarComoPublicado}
              />
          </section>
      </>
  )
}

export default memo(FormMarcarPublicacaoNoDiarioOficial)