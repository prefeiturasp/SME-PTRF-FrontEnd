import { useContext } from "react";
import { Formik } from "formik";
import { Row, Col, Select, Typography } from "antd";
import { YupSignupSchema } from "./YupSignupSchema";
import { ModalFormBodyText } from "../../../../Globais/ModalBootstrap";
import { AtividadesEstatutariasContext } from "./context/index";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"


export const ModalForm = ({atividadesEstatutariasTabelas, handleSubmitFormModal}) => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const {
        showModalForm,
        setShowModalForm,
        stateFormModal,
        bloquearBtnSalvarForm,
        setShowModalConfirmacaoExclusao
    } = useContext(AtividadesEstatutariasContext)
    
    const statusOptions = (atividadesEstatutariasTabelas?.status || []).map((item) => ({
        value: item.key,
        label: item.value
    }))

    const tiposOptions = (atividadesEstatutariasTabelas?.tipo || []).map((item) => ({
        value: item.key,
        label: item.value
    }))

    const mesOptions = (atividadesEstatutariasTabelas?.mes || []).map((item) => ({
        value: item.key,
        label: item.value
    }))
    
    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSignupSchema}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={true}
                onSubmit={handleSubmitFormModal}>
                {props => {
                    const { values, setFieldValue } = props;
                    return(
                        <form onSubmit={props.handleSubmit}>
                            <Row justify="end">
                                <Col>
                                    <p className='text-right mb-2'>* Preenchimento obrigatório</p>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <label htmlFor="tipo">Tipo de atividade *</label>
                                    <Select
                                        data-testid="input-tipo"
                                        data-qa="input-tipo"
                                        name="tipo"
                                        id="tipo"
                                        value={props.values.tipo}
                                        placeholder="Selecione o tipo de atividade"
                                        style={{ width: "100%" }}
                                        options={tiposOptions}
                                        onChange={(e) => setFieldValue('tipo', e)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || tiposOptions.length === 0}
                                        />
                                        {props.touched.tipo && props.errors.tipo && <span className="span_erro text-danger mt-1"> {props.errors.tipo} </span>}
                                </Col>
                                <Col span={12}>
                                    <div className="form-group">
                                        <label htmlFor="nome">Atividade Estatutária *</label>
                                        <input
                                            data-testid="input-nome"
                                            data-qa="input-nome"
                                            type="text"
                                            maxLength={150}
                                            value={props.values.nome}
                                            name="nome"
                                            id="nome"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            placeholder="Digite o nome da atividade estatutária"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <label htmlFor="mes">Mês *</label>
                                    <Select
                                        data-testid="input-mes"
                                        data-qa="input-mes"
                                        name="mes"
                                        id="mes"
                                        value={props.values.mes}
                                        placeholder="Selecione o mês"
                                        style={{ width: "100%" }}
                                        options={mesOptions}
                                        onChange={(e) => setFieldValue('mes', e)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || mesOptions.length === 0}
                                        />
                                        {props.touched.mes && props.errors.mes && <span className="span_erro text-danger mt-1"> {props.errors.mes} </span>}
                                </Col>
                                <Col span={12}>
                                    <label htmlFor="status">Status *</label>
                                    <Select
                                        data-testid="input-status"
                                        data-qa="input-status"
                                        name="status"
                                        id="status"
                                        value={props.values.status}
                                        placeholder="Selecione o status"
                                        style={{ width: "100%" }}
                                        options={statusOptions}
                                        onChange={(e) => setFieldValue('status', e)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || statusOptions.length === 0}
                                        />
                                        {props.touched.status && props.errors.status && <span className="span_erro text-danger mt-1"> {props.errors.status} </span>}
                                </Col>
                            </Row>

                            {values.id && <div className='row mt-3'>
                                <div className='col'>
                                    <p className='mb-2'>ID</p>
                                    <p className='mb-2'>{values.id}</p>
                                </div>
                            </div>}

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.operacao === 'edit' ? (
                                        <button
                                            data-qa="btn-excluir-atividade-estatutaria"
                                            data-testid="btn-excluir-atividade-estatutaria"
                                            onClick={()=> setShowModalConfirmacaoExclusao(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                            Excluir
                                        </button>
                                    ): null}
                                </div>

                                <div className="p-Y bd-highlight">
                                    <button
                                        data-testid="btn-cancelar"
                                        data-qa="btn-cancelar"
                                        onClick={()=> setShowModalForm(false)}
                                        type="button"
                                        className={`btn btn-outline-success mt-2 mr-2`}>
                                        Cancelar
                                    </button>
                                </div>

                                <div className="p-Y bd-highlight">
                                    <button
                                        data-testid="btn-salvar"
                                        data-qa="btn-salvar"
                                        type="submit"
                                        className="btn btn btn-success mt-2"
                                        disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        )
    }

    return (
        <ModalFormBodyText
            show={showModalForm}
            titulo={
                <Typography.Title level={4}>
                    {`${!stateFormModal.uuid ? 'Adicionar' :
                        (TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES ? 'Editar' : 'Visualizar')} atividade estatutária`}
                </Typography.Title>
            }
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}