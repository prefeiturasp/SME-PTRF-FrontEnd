import { useContext } from "react";
import { Formik } from "formik";
import { Row, Col, Typography } from "antd";
import { YupSignupSchema } from "./YupSignupSchema";
import { ModalFormBodyText } from "../../../../Globais/ModalBootstrap";
import { OutrosRecursosPaaContext } from "./context/index";
import { RodapeFormsID } from "../../../../Globais/RodapeFormsID";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"


export const ModalForm = ({handleSubmitFormModal}) => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const {
        showModalForm,
        setShowModalForm,
        stateFormModal,
        bloquearBtnSalvarForm,
        setShowModalConfirmacaoExclusao
    } = useContext(OutrosRecursosPaaContext)
    
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
                                <Col xs={24} sm={18} md={16} lg={14}>
                                    <div className="form-group">
                                        <label htmlFor="nome">Nome do Recurso *</label>
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
                                            placeholder="Digite o nome do Recurso"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                    </div>
                                </Col>
                            </Row>
                                
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={8} lg={8}>
                                    <div className="form-group">
                                        <label htmlFor="aceita_custeio">Aceita Custeio</label>
                                        <div>
                                            <label style={{ marginRight: "10px" }} htmlFor="aceita_custeio_true">
                                                <input
                                                    type="radio"
                                                    data-testid="aceita_custeio_true"
                                                    id="aceita_custeio_true"
                                                    name="aceita_custeio"
                                                    value="true"
                                                    checked={values.aceita_custeio === true}
                                                    onChange={() => setFieldValue("aceita_custeio", true)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />{" "}
                                                Sim
                                            </label>

                                            <label htmlFor="aceita_custeio_false">
                                                <input
                                                    type="radio"
                                                    data-testid="aceita_custeio_false"
                                                    id="aceita_custeio_false"
                                                    name="aceita_custeio"
                                                    value="false"
                                                    checked={values.aceita_custeio === false}
                                                    onChange={() => setFieldValue("aceita_custeio", false)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />{" "}
                                                Não
                                            </label>
                                        </div>
                                    </div>
                                </Col>

                                {/* aceita_capital */}
                                <Col xs={24} sm={24} md={8} lg={8}>
                                    <div className="form-group">
                                        <label htmlFor="aceita_capital">Aceita Capital</label>
                                        <div>
                                            <label htmlFor="aceita_capital_true" style={{ marginRight: "10px" }}>
                                                <input
                                                    type="radio"
                                                    data-testid="aceita_capital_true"
                                                    id="aceita_capital_true"
                                                    name="aceita_capital"
                                                    value="true"
                                                    checked={values.aceita_capital === true}
                                                    onChange={() => setFieldValue("aceita_capital", true)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />{" "}
                                                Sim
                                            </label>

                                            <label htmlFor="aceita_capital_false">
                                                <input
                                                    type="radio"
                                                    data-testid="aceita_capital_false"
                                                    id="aceita_capital_false"
                                                    name="aceita_capital"
                                                    value="false"
                                                    checked={values.aceita_capital === false}
                                                    onChange={() => setFieldValue("aceita_capital", false)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />{" "}
                                                Não
                                            </label>
                                        </div>

                                    </div>
                                </Col>

                                {/* aceita_livre_aplicacao */}
                                <Col xs={24} sm={8} md={8} lg={8}>
                                    <div className="form-group">
                                        <label htmlFor="aceita_livre_aplicacao">Aceita Livre Aplicação</label>
                                        <div>
                                            <label style={{ marginRight: "10px" }} htmlFor="aceita_livre_aplicacao_true">
                                                <input
                                                    type="radio"
                                                    data-testid="aceita_livre_aplicacao_true"
                                                    id="aceita_livre_aplicacao_true"
                                                    name="aceita_livre_aplicacao"
                                                    value="true"
                                                    checked={values.aceita_livre_aplicacao === true}
                                                    onChange={() => setFieldValue("aceita_livre_aplicacao", true)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />{" "}
                                                Sim
                                            </label>

                                            <label htmlFor="aceita_livre_aplicacao_false">
                                                <input
                                                    type="radio"
                                                    data-testid="aceita_livre_aplicacao_false"
                                                    id="aceita_livre_aplicacao_false"
                                                    name="aceita_livre_aplicacao"
                                                    value="false"
                                                    checked={values.aceita_livre_aplicacao === false}
                                                    onChange={() => setFieldValue("aceita_livre_aplicacao", false)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />{" "}
                                                Não
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                                
                            </Row>
                            
                            <RodapeFormsID value={values.id} />

                            <Row justify='space-between'>
                                <div>
                                    {values.operacao === 'edit' ? (
                                        <button
                                            data-qa="btn-excluir-outros-recursos-paa"
                                            data-testid="btn-excluir-outros-recursos-paa"
                                            onClick={()=> setShowModalConfirmacaoExclusao(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                            Excluir
                                        </button>
                                    ): null}
                                </div>
                                <div>
                                    <button
                                        data-testid="btn-cancelar"
                                        data-qa="btn-cancelar"
                                        onClick={()=> setShowModalForm(false)}
                                        type="button"
                                        className='btn btn-outline-success mt-2 mr-2'>
                                        Cancelar
                                    </button>
                                    <button
                                        data-testid="btn-salvar"
                                        data-qa="btn-salvar"
                                        type="submit"
                                        className="btn btn btn-success mt-2"
                                        disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                        Salvar
                                    </button>
                                </div>
                            </Row>
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
                        (TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES ? 'Editar' : 'Visualizar')} Outros Recursos`}
                </Typography.Title>
            }
            onHide={setShowModalForm}
            size='md'
            bodyText={bodyTextarea()}
        />
    )

}