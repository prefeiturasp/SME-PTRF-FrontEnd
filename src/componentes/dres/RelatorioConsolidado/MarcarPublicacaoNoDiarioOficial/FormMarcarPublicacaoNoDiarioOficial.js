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

const FormMarcarPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao, handleClose, textoMsg, textoBotaoSalvar}) => {

    const initialState = {
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
            let marcado = await postMarcarComoPublicadoNoDiarioOficial(payload)
            handleClose()
            toastCustom.ToastCustomSuccess('Data e página da publicação aplicadas com sucesso.', `${textoMsg}`)
            console.log("Relatório marcado como publicado no Diário Oficial com sucesso! ", marcado)
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        }catch (e) {
            console.log("Erro ao marcar como publicado no Diário Oficial!")
            handleClose()
        }
    }, [carregaConsolidadosDreJaPublicadosProximaPublicacao, consolidadoDre.uuid, handleClose, textoMsg])

    const desmarcarComoPublicado = async () => {
        const payload ={
            consolidado_dre: consolidadoDre.uuid,
        }
        try {
            let desmarcado = await postDesmarcarComoPublicadoNoDiarioOficial(payload)
            handleClose()
            setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(false)
            toastCustom.ToastCustomSuccess('Informação da publicação removida com sucesso.', `Data e página da publicação removidas com sucesso.`)
            console.log("Relatório desmarcado como publicado no Diário Oficial com sucesso! ", desmarcado)
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        }catch (e) {
            console.log("Erro ao desmarcar como publicado no Diário Oficial!")
            handleClose()
            setShowModalConfirmDesmarcarPublicacaoNoDiarioOficial(false)
        }
    }

    const verificaSeHabilitaBotaoExclusao = () =>{
        return consolidadoDre
            && consolidadoDre.data_publicacao
            && consolidadoDre.pagina_publicacao
            && consolidadoDre.status_sme !== 'EM_ANALISE'
            && consolidadoDre.permite_excluir_data_e_pagina_publicacao
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
                          <p>Selecione a data e a página da publicação no Diário Oficial da Cidade.</p>
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
                  titulo='Remover publicação'
                  texto='<p>Deseja remover a data e a página da publicação no Diário Oficial da Cidade?</p>'
                  segundoBotaoOnclick={desmarcarComoPublicado}
              />
          </section>
      </>
  )
}

export default memo(FormMarcarPublicacaoNoDiarioOficial)