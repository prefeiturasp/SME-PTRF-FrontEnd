import React from "react";
import {YupSignupSchemaMembros} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from "react-text-mask";
import {Formik} from "formik";
import { Switch } from 'antd';

export const FormCadastroDeMembrosDaAssociacao = ({stateFormEditarMembro, validateFormMembros, handleChangeEditarMembro, onSubmitEditarMembro, visoesService, ePresidente, formRef, telefoneMaskContitional, switchStatusPresidente, handleChangeSwitchStatusPresidente, cargosDaDiretoriaExecutiva, responsavelPelasAtribuicoes, handleChangeResponsavelPelaAtribuicao, possuiMaisDeUmCargoEducacao, podeEditarDadosMembros}) =>{

    return(
        <>
            <div className="d-flex justify-content-end my-2">
                <span className="font-weight-bold">
                    * Preenchimento obrigatório
                </span>
            </div>

            <Formik
                initialValues={stateFormEditarMembro}
                validationSchema={YupSignupSchemaMembros}
                validate={validateFormMembros}
                enableReinitialize={true}
                validateOnBlur={true}
                onSubmit={onSubmitEditarMembro}
                innerRef={formRef}
            >
                {props => {
                    const {
                        errors,
                        setErrors,
                    } = props;
                    return(
                        <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>
                            <div className='row'>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="cargo_associacao">Cargo na Associação</label>
                                        <input
                                            readOnly={true}
                                            type="text"
                                            value={props.values.cargo_associacao ? props.values.cargo_associacao : ""}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                handleChangeEditarMembro(e.target.name, e.target.value);
                                            }}
                                            name="cargo_associacao"
                                            className="form-control"
                                        />
                                        {props.errors.cargo_associacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_associacao}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="representacao">Representação na associação *</label>
                                        <select
                                            disabled={!podeEditarDadosMembros(props.values)}
                                            value={props.values.representacao ? props.values.representacao : ""}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                handleChangeEditarMembro(e.target.name, e.target.value);
                                            }}
                                            name="representacao"
                                            className="form-control"
                                        >
                                            <option value="">Escolha a Representação</option>
                                            <option value="ESTUDANTE">Estudante</option>
                                            <option value='PAI_RESPONSAVEL'>Pai ou responsável</option>
                                            <option value='SERVIDOR'>Servidor</option>
                                        </select>
                                        {props.errors.representacao && <span className="span_erro text-danger mt-1"> {props.errors.representacao}</span>}
                                    </div>
                                </div>

                                <div className={`col ${props.values.representacao !== 'SERVIDOR' && props.values.representacao !== 'ESTUDANTE' && 'escondeItem'}`}>
                                    <div className="form-group">
                                        <label htmlFor="codigo_identificacao">{props.values.representacao === 'SERVIDOR' ? "Registro Funcional" : "Código EOL"}</label>
                                        <input
                                            disabled={!podeEditarDadosMembros(props.values)}
                                            type="text"
                                            value={props.values.codigo_identificacao ? props.values.codigo_identificacao : ""}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                //handleChangeEditarMembro(e.target.name, e.target.value);
                                            }}
                                            name="codigo_identificacao"
                                            className="form-control"
                                            onBlur={(e) => {props.handleBlur(e)}}
                                        />
                                        {props.errors.codigo_identificacao && <span className="span_erro text-danger mt-1"> {props.errors.codigo_identificacao}</span>}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="usuario">Usuário do SIG - Escola</label>
                                        <input
                                            type="text"
                                            value={props.values.usuario}
                                            name="usuario"
                                            className="form-control"
                                            readOnly={true}
                                        />
                                        {props.errors.usuario && <span className="span_erro text-danger mt-1"> {props.errors.usuario}</span>}
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="nome">Nome Completo *</label>
                                        <input
                                            readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                            disabled={!podeEditarDadosMembros(props.values)}
                                            type="text"
                                            value={props.values.nome ? props.values.nome : ""}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                handleChangeEditarMembro(e.target.name, e.target.value);
                                            }
                                            }
                                            name="nome"
                                            className="form-control"
                                        />
                                        {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                    </div>
                                </div>

                                {possuiMaisDeUmCargoEducacao(props.values.lista_cargos)
                                
                                    ?
                                        <div className={(ePresidente(stateFormEditarMembro) ? "col": "col") + (props.values.representacao !== 'SERVIDOR' ? " escondeItem" : "")}>
                                            <div className="form-group">
                                                <label htmlFor="cargo_educacao">Cargo na educação</label>
                                                <select
                                                    disabled={!podeEditarDadosMembros(props.values)}
                                                    value={props.values.cargo_educacao ? props.values.cargo_educacao : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }}
                                                    name="cargo_educacao"
                                                    className="form-control"
                                                    onBlur={(e) => {props.handleBlur(e)}}
                                                >
                                                    <option key={0} value="">Escolha o Cargo</option>
                                                    {props.values.lista_cargos && props.values.lista_cargos.map((item, index) => {
                                                        return(
                                                            <option key={index+1} value={item}>{item}</option>
                                                        )
                                                        
                                                    })}
                                                    
                                                </select>
                                                {(props.values.cargo_educacao === undefined || props.values.cargo_educacao === "") && props.errors.cargo_educacao &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.cargo_educacao}</span>}
                                            </div>
                                        </div>
                                    :
                                
                                        <div className={(ePresidente(stateFormEditarMembro) ? "col": "col") + (props.values.representacao !== 'SERVIDOR' ? " escondeItem" : "")}>
                                            <div className="form-group">
                                                <label htmlFor="cargo_educacao">Cargo na educação</label>
                                                <input
                                                    readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                    disabled={!podeEditarDadosMembros(props.values)}
                                                    type="text"
                                                    value={props.values.cargo_educacao ? props.values.cargo_educacao : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }}
                                                    onBlur={(e) => {props.handleBlur(e)}}
                                                    name="cargo_educacao"
                                                    className="form-control"
                                                />
                                                {(props.values.cargo_educacao === undefined || props.values.cargo_educacao === "") && props.errors.cargo_educacao &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.cargo_educacao}</span>}
                                            </div>
                                        </div> 
                                }
                            </div>

                            <div className="row">
                                {props.values.representacao === 'PAI_RESPONSAVEL' || props.values.representacao === 'ESTUDANTE' ? (
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cpf">{props.values.representacao === 'PAI_RESPONSAVEL' ? "CPF do pai ou responsável" : "CPF"} *</label>
                                            <MaskedInput
                                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL' && props.values.representacao !== 'ESTUDANTE'}
                                                disabled={!podeEditarDadosMembros(props.values)}
                                                type="text"
                                                value={props.values.cpf ? props.values.cpf : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }}
                                                name="cpf"
                                                className="form-control"
                                                onClick={() => setErrors(
                                                    {
                                                        ...errors,
                                                    }
                                                )}
                                            />
                                            {props.errors.cpf &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.cpf}</span>}
                                        </div>
                                    </div>
                                ) : null }
                            </div>

                                {ePresidente(stateFormEditarMembro) &&
                                    <div className='row'>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="telefone">Telefone</label>
                                                <MaskedInput
                                                    disabled={!podeEditarDadosMembros(props.values)}
                                                    mask={(valor) => telefoneMaskContitional(valor)}
                                                    value={props.values.telefone ? props.values.telefone : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }}
                                                    name="telefone"
                                                    className="form-control"
                                                />
                                                {props.errors.telefone &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.telefone}</span>}
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="cep">CEP</label>
                                                <MaskedInput
                                                    disabled={!podeEditarDadosMembros(props.values)}
                                                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                                    value={props.values.cep ? props.values.cep : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }}
                                                    name="cep"
                                                    className="form-control"
                                                />
                                                {props.errors.cep &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.cep}</span>}
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="bairro">Bairro</label>
                                                <input
                                                    readOnly={false}
                                                    disabled={!podeEditarDadosMembros(props.values)}
                                                    type="text"
                                                    value={props.values.bairro ? props.values.bairro : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }}
                                                    name="bairro"
                                                    className="form-control"
                                                />
                                                {props.errors.bairro &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.bairro}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="endereco">Endereço</label>
                                                <input
                                                    disabled={!podeEditarDadosMembros(props.values)}
                                                    type="text"
                                                    value={props.values.endereco ? props.values.endereco : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }}
                                                    name="endereco"
                                                    className="form-control"
                                                    placeholder=""
                                                />
                                                {props.errors.endereco && <span className="span_erro text-danger mt-1"> {props.errors.endereco}</span>}
                                            </div>
                                        </div>
                                    </div>
                                }

                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            disabled={!podeEditarDadosMembros(props.values)}
                                            type="text"
                                            value={props.values.email ? props.values.email : ""}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                handleChangeEditarMembro(e.target.name, e.target.value);
                                            }
                                            }
                                            onClick={() => setErrors(
                                                {
                                                    ...errors,
                                                }
                                            )}
                                            name="email"
                                            className="form-control"
                                            placeholder="Insira o e-mail"
                                        />
                                        {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                    </div>
                                </div>
                            </div>
                            <hr className='mt-3 mb-4'/>

                            {ePresidente(stateFormEditarMembro) &&
                                <div className='d-flex align-items-center'>

                                    <div className='col pl-0'>
                                        <span className='mr-2'>Status de ocupação: </span>
                                        <Switch
                                            onChange={handleChangeSwitchStatusPresidente}
                                            checked={switchStatusPresidente}
                                            name="statusPresidenteSwitch"
                                            checkedChildren="Presente"
                                            unCheckedChildren="Ausente"
                                            disabled={!podeEditarDadosMembros(props.values)}
                                            className={`switch-status-presidente ${switchStatusPresidente ? "switch-status-presidente-checked" : ""}`}
                                        />
                                    </div>

                                    {!switchStatusPresidente &&
                                        <div className='col'>
                                            <div className="row d-flex align-items-center">

                                                <div className='col-auto'>
                                                    <label className='mb-0' htmlFor="responsavel_pelas_atribuicoes">Responsável pelas atribuições</label>
                                                </div>

                                                <div className='col-auto'>
                                                    <select
                                                        disabled={!podeEditarDadosMembros(props.values)}
                                                        value={responsavelPelasAtribuicoes}
                                                        onChange={(e) => {
                                                            handleChangeResponsavelPelaAtribuicao(e.target.value);
                                                        }}
                                                        name="responsavel_pelas_atribuicoes"
                                                        className="form-control"
                                                    >
                                                        <option value=''>Escolha o responsável</option>
                                                        {cargosDaDiretoriaExecutiva && cargosDaDiretoriaExecutiva.length > 0 && cargosDaDiretoriaExecutiva.filter(element => element.id !== "PRESIDENTE_DIRETORIA_EXECUTIVA").map((responsavel)=>
                                                            <option key={responsavel.id} value={responsavel.id}>{responsavel.nome}</option>
                                                        )}
                                                    </select>
                                                    {props.errors.responsavel_pelas_atribuicoes && <span className="span_erro text-danger mt-1"> {props.errors.responsavel_pelas_atribuicoes}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </form>
                    );
                }}
            </Formik>
        </>
    )
}