import React, {useEffect, useState} from "react";
import {Formik} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {YupSubmitDocumentosAcertos} from './YupSubmitDocumentosAcertos'
import {ModalBootstrapFormAdicionarDocumentos, ModalBootstrapConsideraComoCorreto, ModalBootstrapRemoveAcerto} from "../../../../Globais/ModalBootstrap";

export const ModalAdicionarAcertosDocumentos = (props) => {
    const [showModalConsideraCorreto, setShowModalConsideraCorreto] = useState(false)
    const [showModalRemoveAcerto, setShowModalRemoveAcerto] = useState(false)


    const verificaSeTemAjuste = () => {
            let documentoAjuste = props.listaDeDocumentosRelatorio?.filter((documento) => {
                return props.documentoAcertoInfo.documento === documento.uuid
            })
            let resultado = documentoAjuste[0]?.analise_documento_consolidado_dre?.resultado
            return resultado === 'AJUSTE'
        }
    
    const verificaDevolvida = () => {
        let documentoAjuste = props.listaDeDocumentosRelatorio?.filter((documento) => {
            return props.documentoAcertoInfo.documento === documento.uuid
        })
        return documentoAjuste[0]?.analise_documento_consolidado_dre?.documento_ja_foi_devolvido
    }

    const bodyTextarea = (modalProps) => {
        return (
            <Formik 
                validationSchema={YupSubmitDocumentosAcertos}
                initialValues={modalProps.initialValues}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={modalProps.handleSubmitModal}
            >
                {
                ({errors, ...props}) => (
                    <form onSubmit={props.handleSubmit}>
                        <div className='row'>
                            <div className="col-12">
                            {verificaSeTemAjuste() &&
                                <button
                                type="button"
                                className={`btn btn-link ${modalProps.precisaConsiderarCorreto && verificaDevolvida() ? 'btn-remover-ajuste-lancamento-copia' : 'btn-remover-ajuste-lancamento'} sme-considera-correto`}
                                onClick={(e) => {modalProps.precisaConsiderarCorreto && verificaDevolvida() ? setShowModalConsideraCorreto(true) : setShowModalRemoveAcerto(true)}}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        fontSize: '17px',
                                        marginRight: "4px",
                                        color: modalProps.precisaConsiderarCorreto && verificaDevolvida() ? "#297805" : "#B40C02"
                                    }}
                                    icon={modalProps.precisaConsiderarCorreto && verificaDevolvida() ? faCheckCircle : faTimesCircle }
                                />
                                {modalProps.precisaConsiderarCorreto && verificaDevolvida()  ? "Considerar correto" : "Remover acerto" }
                                </button>}
                                <p>
                                    <span className="span_erro text-danger">
                                        <strong>{errors.detalhamento}</strong>
                                    </span>
                                </p>
                                <textarea 
                                    name='detalhamento'
                                    id='detalhamento'
                                    value={props.values.detalhamento}
                                    onChange={props.handleChange}
                                    className="form-control"
                                    placeholder="Adicione o acerto"
                                    rows="3"/>
                            </div>
                            <div className='col-12'>
                                <div className="d-flex justify-content-end pb-3 mt-3">
                                    <button onClick={
                                        modalProps.handleClose
                                    }
                                    type="button"
                                    className="btn btn-outline-success mt-2 mr-2">
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn btn btn-success mt-2 mr-2">
                                        Adicionar acerto
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
            </Formik>
        )
    };
    return (
    <>
        <ModalBootstrapFormAdicionarDocumentos show={
                props.show
            }
            titulo={
                props.titulo
            }
            bodyText={
                bodyTextarea(props)
            }/>
        <section>
            <ModalBootstrapConsideraComoCorreto 
                show={showModalConsideraCorreto}
                titulo={'Marcar como correto'}
                primeiroBotaoOnclick={(e) => {
                    setShowModalConsideraCorreto(false)
                    props.marcarComoCorreto()
                    props.handleClose()
                }}
                primeiroBotaoTexto={"Confirmar"}
                primeiroBotaoCss={"success"}
                segundoBotaoTexto={"Cancelar"}
                segundoBotaoCss={'outline-success'}
                segundoBotaoOnclick={(e) => setShowModalConsideraCorreto(false)}
                bodyText={'A solicitação de acerto será apagada na referida análise e ficará disponível para visualização no histórico de análise. Após confirmação da mensagem, o documento passa a ter o status de "Correto".'}
            />
        </section>
        <section>
            <ModalBootstrapRemoveAcerto
                show={showModalRemoveAcerto}
                titulo={'Remover acerto'}
                primeiroBotaoOnclick={(e) => {
                    props.marcarComoNaoConferido()
                    props.handleClose()
                    setShowModalRemoveAcerto(false)
                }}
                primeiroBotaoTexto={"Confirmar"}
                primeiroBotaoCss={"success"}
                segundoBotaoTexto={"Cancelar"}
                segundoBotaoCss={'outline-success'}
                segundoBotaoOnclick={(e) => {
                    setShowModalRemoveAcerto(false)
                }}
                bodyText={'Deseja excluir o acerto?'}
            />
        </section>
    </>
    );
};
