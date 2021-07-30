import React from "react";
import {FieldArray, Formik} from "formik";
import {YupSignupSchemaPerfis} from "./YupSignupSchemaPerfis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import MaskedInput from "react-text-mask";
import {ModalUsuarioNaoCadastrado} from "./ModalUsuarioNaoCadastrado";
import {ModalUsuarioCadastradoVinculado} from "./ModalUsuarioCadastradoVinculado";
import {ModalConfirmDeletePerfil} from "./ModalConfirmDeletePerfil";
import {ModalInfo} from "./ModalInfo";
import GestaoDePerfisFormAutocomplete from "./GestaoDePerfisFormAutocomplete";

export const GestaoDePerfisFormFormik = (
    {
        initPerfisForm,
        setStatePerfisForm,
        statePerfisForm,
        handleSubmitPerfisForm,
        setShowModalDeletePerfil,
        validacoesPersonalizadas,
        setFormErrors,
        formErrors,
        idUsuarioCondicionalMask,
        setBloquearCampoName,
        bloquearCampoName,
        grupos,
        visoes,
        showModalUsuarioNaoCadastrado,
        handleCloseUsuarioNaoCadastrado,
        showModalUsuarioCadastradoVinculado,
        setShowModalUsuarioNaoCadastrado,
        setShowModalUsuarioCadastradoVinculado,
        showModalDeletePerfil,
        handleCloseDeletePerfil,
        onDeletePerfilTrue,
        showModalInfo,
        setShowModalInfo,
        tituloModalInfo,
        textoModalInfo,
        tabelaAssociacoes,
        handleChangeTipoUnidade,
        unidadesPorTipo,
        vinculaUnidadeUsuario,
        desvinculaUnidadeUsuario,
        btnAdicionarDisabled,
        handleChangeVisao,
        handleChangeGrupo,
        getEstadoInicialVisoesChecked,
        getEstadoInicialGruposChecked,
        acessoCadastrarUnidade,
        unidadeVisaoUE,
        serviceTemUnidadeDre,
        serviceTemUnidadeUE,
        pesquisaVisao,
        pesquisaPermissaoExibicaoVisao,
    }) => {

    return (
        <Formik
            initialValues={statePerfisForm}
            validationSchema={YupSignupSchemaPerfis}
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmitPerfisForm}
        >
            {props => {
                const {
                    setFieldValue,
                    resetForm,
                    values,
                } = props;
                let vinculoUnidade = props.values.unidades_vinculadas.find(element => element.uuid === initPerfisForm.unidade_selecionada)
                let exibirBotaoDesvincular = (initPerfisForm.visao === "UE" && vinculoUnidade);
                let temOutrasUnidadesOuVisoes = (
                    (vinculoUnidade && props.values.unidades_vinculadas.length > 1) ||
                    (!vinculoUnidade && props.values.unidades_vinculadas.length > 0) ||
                    props.values.visoes.includes(pesquisaVisao("DRE").id) ||
                    props.values.visoes.includes(pesquisaVisao("SME").id)
                )
                return (
                    <form onSubmit={props.handleSubmit}>
                        <div className="d-flex bd-highlight mt-2">
                            <div className="p-Y flex-grow-1 bd-highlight">
                                <p className='titulo-gestao-de-perfis-form'>{!statePerfisForm.id ? 'Adicionar' : 'Editar'} usuário</p>
                            </div>

                            <div className="p-Y bd-highlight">
                                {statePerfisForm.id && exibirBotaoDesvincular &&
                                <button
                                    onClick={async () => {
                                        if (vinculoUnidade) {
                                            await desvinculaUnidadeUsuario(vinculoUnidade)
                                        }
                                        if (!temOutrasUnidadesOuVisoes) {
                                            setShowModalDeletePerfil(true)
                                        } else {
                                            window.location.assign('/gestao-de-perfis/');
                                        }
                                    }}
                                    type="button"
                                    className="btn btn btn-danger mt-2"
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            fontSize: '15px',
                                            marginRight: "5px",
                                            color: '#fff'
                                        }}
                                        icon={faTrash}
                                    />
                                    {temOutrasUnidadesOuVisoes ? "Desvincular usuário" : "Desvincular e excluir"}
                                </button>
                                }
                            </div>

                            <div className="p-Y bd-highlight">
                                {statePerfisForm.id && initPerfisForm.visao !== "UE" &&
                                <button
                                    disabled={serviceTemUnidadeDre(props.values.unidades_vinculadas) || serviceTemUnidadeUE(props.values.unidades_vinculadas) || props.values.visoes.includes(pesquisaVisao("SME").id)}
                                    onClick={() => {
                                        setShowModalDeletePerfil(true)
                                    }}
                                    type="button"
                                    className="btn btn btn-danger mt-2 ml-2"
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            fontSize: '15px',
                                            marginRight: "5px",
                                            color: '#fff'
                                        }}
                                        icon={faTrash}
                                    />
                                    Deletar usuário
                                </button>
                                }
                            </div>
                            <div className="p-Y bd-highlight">
                                <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                            </div>
                            <div className="p-Y bd-highlight">
                                <button
                                    onClick={() => window.location.assign('/gestao-de-perfis/')}
                                    type="button"
                                    className="btn btn btn-outline-success mt-2 ml-2">Voltar
                                </button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="e_servidor">Tipo de usuário</label>
                                    <select
                                        value={props.values.e_servidor}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="e_servidor"
                                        className="form-control"
                                        disabled={statePerfisForm.id}
                                        onBlur={() => {
                                            validacoesPersonalizadas(values, {setFieldValue, resetForm});
                                        }}
                                        onClick={() => {
                                            setFormErrors({username: ""})
                                        }}
                                    >
                                        <option value="">Escolha o tipo de usuário</option>
                                        <option value="True">Servidor</option>
                                        <option value="False">Não Servidor</option>
                                    </select>
                                    {props.errors.e_servidor && <span className="span_erro text-danger mt-1"> {props.errors.e_servidor}</span>}
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="username">ID do usuário</label>
                                    <MaskedInput
                                        mask={idUsuarioCondicionalMask(props.values.e_servidor)}
                                        showMask={false}
                                        guide={false}
                                        value={props.values.username ? props.values.username : ""}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        onBlur={() => {
                                            validacoesPersonalizadas(values, {
                                                setFieldValue,
                                                resetForm
                                            });
                                        }}
                                        onClick={() => {
                                            setFormErrors({username: ""})
                                        }}
                                        name="username"
                                        className="form-control"
                                        placeholder={props.values.e_servidor === "False" ? "Insira o CPF do usuário, sem ponto nem traço" : "Insira o RF do servidor, sem ponto nem traço"}
                                        disabled={!props.values.e_servidor || statePerfisForm.id}
                                    />
                                    {/*Validações personalizadas*/}
                                    {formErrors.username && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.username}</span></p>}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="name">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={props.values.name ? props.values.name : ""}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="name"
                                        className="form-control"
                                        readOnly={bloquearCampoName}
                                        maxLength='255'
                                    />
                                    {props.errors.name && <span className="span_erro text-danger mt-1"> {props.errors.name}</span>}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        value={props.values.email ? props.values.email : ''}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="email"
                                        className="form-control"
                                        placeholder='Insira seu email se desejar'
                                        maxLength='254'
                                    />
                                    {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="visoes">Visões</label>
                                    <div className="card">
                                        <div className="card-body p-2">
                                            {visoes && visoes.length > 0 && visoes.map((visao, index_visoes) => (
                                                <div className="form-group form-check mb-0" key={index_visoes}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="visoes"
                                                        id={visao.nome}
                                                        value={visao.id}
                                                        onChange={(e) => {
                                                            handleChangeVisao(e, setFieldValue, values)
                                                            getEstadoInicialVisoesChecked()
                                                        }}
                                                        checked={props.values.visoes.includes(parseInt(visao.id))}
                                                        disabled={!visao.editavel || initPerfisForm.visao === "UE"}
                                                    />
                                                    <label className="form-check-label" htmlFor={visao.nome}>{visao.nome}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {props.errors.visoes && <span className="span_erro text-danger mt-1"> {props.errors.visoes}</span>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="groups">Grupos</label>
                                    <div className="card">
                                        <div className="card-body p-2">
                                            {grupos && grupos.length > 0 && grupos.map((grupo, index_grupos) => (
                                                <div className="form-group form-check mb-0" key={index_grupos}>
                                                        {pesquisaPermissaoExibicaoVisao(grupo.visao) &&
                                                            <>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    name="groups"
                                                                    id={grupo.nome}
                                                                    value={grupo.id}
                                                                    onChange={(e) => {
                                                                            handleChangeGrupo(e, setFieldValue, values)
                                                                            getEstadoInicialGruposChecked()
                                                                    }}
                                                                    checked={props.values.groups.includes(grupo.id)}
                                                                />
                                                                <label className="form-check-label" htmlFor={grupo.nome}>{grupo.nome}</label>
                                                            </>
                                                        }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {props.errors.groups && <span className="span_erro text-danger mt-1"> {props.errors.groups}</span>}
                                </div>
                            </div>

                            {initPerfisForm.visao !== "UE" &&
                                    <div className='col-12'>
                                        <p>
                                            <strong>{values.id ? "Unidades que possui acesso" : "Salve o usuário para poder vincular as unidades."}</strong>
                                        </p>
                                    </div>
                            }
                            {values.id && initPerfisForm.visao !== "UE" &&
                            <FieldArray
                                name="unidades_vinculadas"
                                render={({remove, push}) => (
                                    <>
                                        {props.values.unidades_vinculadas && props.values.unidades_vinculadas.length > 0 && props.values.unidades_vinculadas.map((unidade_vinculada, index_field_array) => {
                                            return (
                                                <div className="col-12" key={index_field_array}>
                                                    <div className='row'>
                                                        <div className='col mt-4'>
                                                            <label htmlFor="tipo_de_unidade">Tipo de Unidade {index_field_array + 1}</label>
                                                            {values.visao === "UE" ? (
                                                                    <select
                                                                        value={unidade_vinculada.tipo_unidade ? unidade_vinculada.tipo_unidade : ""}
                                                                        onChange={
                                                                            (e) => {
                                                                                props.handleChange(e);
                                                                                handleChangeTipoUnidade(e.target.value, values)
                                                                            }}
                                                                        name={`unidades_vinculadas[${index_field_array}].tipo_unidade`}
                                                                        id={`tipo_unidade_${index_field_array}`}
                                                                        className="form-control"
                                                                        disabled={unidade_vinculada.nome}
                                                                    >
                                                                        <option value="">Selecione um tipo de unidade
                                                                        </option>
                                                                        <option disabled={true} value="DRE">DIRETORIA
                                                                        </option>
                                                                        {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element => element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                                                                            <option
                                                                                disabled={!acessoCadastrarUnidade('UE') || item.id !== unidadeVisaoUE.tipo_unidade}
                                                                                key={item.id}
                                                                                value={item.id}>{item.nome}</option>
                                                                        ))}
                                                                    </select>
                                                                ) :
                                                                <select
                                                                    value={unidade_vinculada.tipo_unidade ? unidade_vinculada.tipo_unidade : ""}
                                                                    onChange={
                                                                        (e) => {
                                                                            props.handleChange(e);
                                                                            handleChangeTipoUnidade(e.target.value, values)
                                                                        }}
                                                                    name={`unidades_vinculadas[${index_field_array}].tipo_unidade`}
                                                                    id={`tipo_unidade_${index_field_array}`}
                                                                    className="form-control"
                                                                    disabled={unidade_vinculada.nome}
                                                                >
                                                                    <option value="">Selecione um tipo de unidade</option>
                                                                    <option disabled={!acessoCadastrarUnidade('DRE')} value="DRE">DIRETORIA</option>
                                                                    {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element => element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                                                                        <option disabled={!acessoCadastrarUnidade('UE')} key={item.id} value={item.id}>{item.nome}</option>
                                                                    ))}
                                                                </select>
                                                            }
                                                        </div>

                                                        <div className="col mt-4">
                                                            <label htmlFor="groups">Unidade {index_field_array + 1}</label>
                                                            {unidade_vinculada.nome ? (
                                                                    <input
                                                                        value={unidade_vinculada.nome}
                                                                        name={`unidades_vinculadas[${index_field_array}].unidade_vinculada`}
                                                                        id={`unidade_vinculada_${index_field_array}`}
                                                                        className="form-control"
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        placeholder='Escolha uma unidade'
                                                                        disabled={true}
                                                                    />
                                                                ) :
                                                                <GestaoDePerfisFormAutocomplete
                                                                    todasAsAcoesAutoComplete={unidadesPorTipo}
                                                                    setFieldValue={setFieldValue}
                                                                    recebeAcaoAutoComplete={vinculaUnidadeUsuario}
                                                                    index={index_field_array}
                                                                />
                                                            }
                                                            {props.touched.unidade_vinculada && props.errors.unidade_vinculada && <span className="text-danger mt-1"> {props.errors.unidade_vinculada}</span>}
                                                        </div>

                                                        {index_field_array >= 0 && values.unidades_vinculadas.length > 0 && (
                                                            <div
                                                                className="col-auto mt-4 d-flex justify-content-center">
                                                                <button
                                                                    onClick={async () => {
                                                                        if (unidade_vinculada) {
                                                                            await desvinculaUnidadeUsuario(unidade_vinculada)
                                                                        }
                                                                        remove(index_field_array)
                                                                    }}
                                                                    className="btn btn-link fonte-14 pt-3 mt-4"
                                                                    type="button"
                                                                    disabled={unidade_vinculada && unidade_vinculada.uuid ? !unidade_vinculada.pode_excluir : false}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        style={{
                                                                            fontSize: '20px',
                                                                            marginRight: "5px",
                                                                            color: "#B40C02"
                                                                        }}
                                                                        icon={faTrashAlt}
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        <div className="d-flex col-12 justify-content-start mt-3 mb-3">
                                            <button
                                                type="button"
                                                className="btn btn btn-success mt-2 mr-2"
                                                disabled={btnAdicionarDisabled}
                                                onClick={() => {
                                                    getEstadoInicialVisoesChecked();
                                                    getEstadoInicialGruposChecked();
                                                    push({
                                                            unidade_vinculada: '',
                                                            tipo_unidade: '',
                                                        }
                                                    );
                                                }}
                                            >
                                                + Adicionar
                                            </button>
                                        </div>
                                    </>
                                )}
                            />
                            }
                        </div>
                        <section>
                            <ModalUsuarioNaoCadastrado
                                show={showModalUsuarioNaoCadastrado}
                                handleClose={() => handleCloseUsuarioNaoCadastrado({resetForm})}
                                onCadastrarTrue={() => {
                                    setBloquearCampoName(false)
                                    setShowModalUsuarioNaoCadastrado(false)
                                }}
                                titulo="Usuário não cadastrado"
                                texto="<p>O usuário não existe no CoreSSO deseja criá-lo?</p>"
                                primeiroBotaoTexto="Cancelar"
                                primeiroBotaoCss="outline-success"
                                segundoBotaoCss="success"
                                segundoBotaoTexto="Cadastrar"
                            />
                        </section>
                        <section>
                            <ModalUsuarioCadastradoVinculado
                                show={showModalUsuarioCadastradoVinculado}
                                handleClose={() => {
                                    setShowModalUsuarioCadastradoVinculado(false);
                                    setStatePerfisForm(initPerfisForm)
                                }}
                                titulo="Usuário já vinculado"
                                texto="<p>Este usuário já está vinculado</p>"
                                primeiroBotaoTexto="Fechar"
                                primeiroBotaoCss="success"
                            />
                        </section>
                        <section>
                            <ModalConfirmDeletePerfil
                                show={showModalDeletePerfil}
                                handleClose={handleCloseDeletePerfil}
                                onDeletePerfilTrue={onDeletePerfilTrue}
                                titulo="Excluir usuário"
                                texto="<p>Deseja realmente excluir este usuário?</p>"
                                primeiroBotaoTexto="Cancelar"
                                primeiroBotaoCss="outline-success"
                                segundoBotaoCss="danger"
                                segundoBotaoTexto="Excluir"
                            />
                        </section>
                        <section>
                            <ModalInfo
                                show={showModalInfo}
                                handleClose={() => setShowModalInfo(false)}
                                titulo={tituloModalInfo}
                                texto={textoModalInfo}
                                primeiroBotaoTexto="Fechar"
                                primeiroBotaoCss="success"
                            />
                        </section>
                    </form>
                );
            }}
        </Formik>
    )
}