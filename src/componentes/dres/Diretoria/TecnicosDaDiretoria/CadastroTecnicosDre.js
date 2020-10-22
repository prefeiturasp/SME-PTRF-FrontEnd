import React, {useEffect, useState} from "react";
import "./tecnicos.scss"
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPlus, faClipboardList, faEdit} from "@fortawesome/free-solid-svg-icons";
import Img404 from "../../../../assets/img/img-404.svg";
import Loading from "../../../../utils/Loading";
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito";
import {getTecnicosDre, createTecnicoDre, deleteTecnicoDre, getTecnicoDrePorRf, updateTecnicoDre} from "../../../../services/dres/TecnicosDre.service";
import {TecnicoDreForm} from "./TecnicoDreForm";
import {ConfirmaDeleteTecnico} from "./ConfirmaDeleteTecnicoDialog";
import {consultarRF} from "../../../../services/escolas/Associacao.service";
import {Link} from "react-router-dom";

export const CadastroTecnicosDre = ({dadosDaDre}) => {

    const rowsPerPage = 7;

    const initTecnicoForm = {
        uuid: "",
        rf: "",
        nome: "",
        email: "",
        telefone: "",
    };

    const [loading, setLoading] = useState(true);
    const [stateTecnicoForm, setStateTecnicoForm] = useState(initTecnicoForm);
    const [dreUuid, setDreUuid] = useState(dadosDaDre.uuid);
    const [tecnicosList, setTecnicosList] = useState([]);
    const [showTecnicoForm, setShowTecnicoForm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [btnSalvarReadOnly, setBtnSalvarReadOnly] = useState(false);
    const [stateSelectDeleteTecnico, setStateSelectDeleteTecnico] = useState("");
    const [stateCheckboxDeleteTecnico, setStateCheckboxDeleteTecnico] = useState(false);

    const carregaTecnicos = async () => {
        let tecnicos = await getTecnicosDre(dreUuid);

        console.log("tecnicos ", tecnicos)

        setTecnicosList(tecnicos)
    };

    const deleteTecnico = async () => {
        setLoading(true);
        if (stateTecnicoForm.uuid) {
                try {
                    const response = await deleteTecnicoDre(stateTecnicoForm.uuid, stateSelectDeleteTecnico);
                    if (response.status === 204 || response.status === 200) {
                        await carregaTecnicos();
                        console.log("Operação realizada com sucesso!");
                    } else {
                        console.log("Erro ao excluir Técnico")
                    }
                } catch (error) {
                    console.log(error)
                }
        }
        setLoading(false)
    };

    const handleAddTecnicoAction = () => {
        setStateTecnicoForm(initTecnicoForm);
        setShowTecnicoForm(true);
    };

    const handleDeleteTecnicoAction = (tecnico) => {
        const initFormTecnico = {
            uuid: tecnico.uuid,
            rf: tecnico.rf,
            nome: tecnico.nome,
            email: tecnico.email,
            telefone: tecnico.telefone,
        };
        setStateTecnicoForm(initFormTecnico);
        setShowConfirmDelete(true);
    };

    const handleCloseTecnicoForm = () => {
        setShowTecnicoForm(false);
    };

    const handleSubmitTecnicoForm = async () => {
        setLoading(true);
        setShowTecnicoForm(false);
        const payload = {
            'dre': dreUuid,
            'rf': stateTecnicoForm.rf,
            'nome': stateTecnicoForm.nome,
            'email': stateTecnicoForm.email,
            'telefone': stateTecnicoForm.telefone,
        };

        if (stateTecnicoForm.uuid) {
            console.log("Update não implementado.")
        } else {
            try {
                const response = await createTecnicoDre(payload);
                if (response.status === 201) {
                    console.log("Técnico criado com sucesso!");
                    await carregaTecnicos();
                } else if (response.status === 400 && response.data.rf) {
                    // data:
                    // rf: ["Técnico de DRE com este RF já existe."]
                    console.log("Técnico já existe")
                } else {
                    console.log("Erro ao criar Tecnico");
                    console.log(response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)
    };

    const handleChangesInTecnicoForm = (name, value) => {

        console.log("handleChangesInTecnicoForm name: ", name, ' value: ', value)
        setStateTecnicoForm({
            ...stateTecnicoForm,
            [name]: value
        });
    };

    const validateTecnicoForm = async (values) => {
        const errors = {};

        setBtnSalvarReadOnly(true);
        try {
            let rf = await consultarRF(values.rf.trim());
            if (rf.status === 200 || rf.status === 201) {
                const init = {
                    ...stateTecnicoForm,
                    nome: rf.data[0].nm_pessoa,
                    rf: values.rf,
                    email: values.email,
                    telefone: values.telefone,
                };
                setStateTecnicoForm(init);

                const tecnico_existente = await getTecnicoDrePorRf(values.rf.trim());

                if (tecnico_existente.length > 0) {
                    errors.rf = "Técnico já cadastrado"
                } else {
                    setBtnSalvarReadOnly(false);
                }
            }
        } catch (e) {
            errors.rf = "RF inválido"
        }

        return errors
    };


    const handleDeleteConfirmation = () => {
        setShowConfirmDelete(false);
        deleteTecnico();
    };

    const closeConfirmDeleteDialog = () => {
        setShowConfirmDelete(false);
    };

    const conferirAtribuicoesTemplate = (rowData, column) => {
        return (
            <div>
                <Link to={`/dre-atribuicoes/${rowData['uuid']}`} className="link-green" onClick={() => {}}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "0"}}
                        icon={faClipboardList}
                    />
                    <span> Conferir atribuições</span>
                </Link>
            </div>
        )
    };

    const tableActionsTemplate = (rowData, column) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={() => handleDeleteTecnicoAction(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
                <button className="btn-editar-membro" onClick={() => handleDeleteTecnicoAction(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "red"}}
                        icon={faTrash}
                    />
                </button>

            </div>
        )
    };

    useEffect(() => {
        carregaTecnicos()
        setLoading(false)
    }, []);

    const handleChangeSelectDeleteTecnico = (value) => {
        setStateSelectDeleteTecnico(value);
    };
    const handleChangeCheckboxDeleteTecnico = async (e) => {
        let checado = e.target.checked;
        setStateCheckboxDeleteTecnico(checado);
        setStateSelectDeleteTecnico("");
    };

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                dreUuid !== undefined ? (

                    <div>
                        <div className="row">
                            <div className="col-10">
                                <label><strong>Lista de técnicos</strong></label>
                            </div>
                            <div className="col-2">
                                <a className="link-green float-right" onClick={() => handleAddTecnicoAction()}>
                                    <FontAwesomeIcon
                                        style={{fontSize: '15px', marginRight: "0"}}
                                        icon={faPlus}
                                    />
                                    <strong> adicionar</strong>
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {tecnicosList.length > 0 ? (
                                    <DataTable
                                        value={tecnicosList}
                                        className="mt-3 datatable-footer-coad"
                                        paginator={tecnicosList.length > rowsPerPage}
                                        rows={rowsPerPage}
                                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                        autoLayout={true}
                                        selectionMode="single"
                                    >
                                        <Column field='rf' header='Registro funcional'/>
                                        <Column field='nome' header='Nome completo'/>
                                        <Column field='email' header='E-mail'/>
                                        <Column field='telefone' header='Telefone'/>

                                        <Column body={conferirAtribuicoesTemplate} header='Unidades escolares atribuidas'
                                                style={{textAlign: 'center'}}/>

                                        <Column body={tableActionsTemplate} header='Ações'
                                                style={{textAlign: 'center', width: '8em'}}/>
                                    </DataTable>)
                                    : (
                                        <MsgImgLadoDireito
                                            texto='Não há nenhum técnico cadastrado ainda, clique em "+adicionar" para incluir um.'
                                            img={Img404}
                                        />
                                    )
                                }
                            </div>

                        </div>

                        <section>
                            <TecnicoDreForm
                                show={showTecnicoForm}
                                handleClose={handleCloseTecnicoForm}
                                onSubmit={handleSubmitTecnicoForm}
                                handleChange={handleChangesInTecnicoForm}
                                validateForm={validateTecnicoForm}
                                initialValues={stateTecnicoForm}
                                btnSalvarReadOnly={btnSalvarReadOnly}
                            />
                        </section>

                        <section>
                            <ConfirmaDeleteTecnico
                                show={showConfirmDelete}
                                onCancelDelete={closeConfirmDeleteDialog}
                                onConfirmDelete={handleDeleteConfirmation}
                                stateTecnicoForm={stateTecnicoForm}
                                tecnicosList={tecnicosList}
                                stateSelectDeleteTecnico={stateSelectDeleteTecnico}
                                stateCheckboxDeleteTecnico={stateCheckboxDeleteTecnico}
                                handleChangeSelectDeleteTecnico={handleChangeSelectDeleteTecnico}
                                handleChangeCheckboxDeleteTecnico={handleChangeCheckboxDeleteTecnico}
                            />
                        </section>
                    </div>
                ) : null}
        </>
    );
};