import React, {useEffect, useState} from "react";
import {updateAssociacao} from "../../../../../services/dres/Associacoes.service";
import "../../associacoes.scss"
import Loading from "../../../../../utils/Loading";
import {Formik} from "formik";
import {YupSignupSchemaDadosDaAssociacao} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from "react-text-mask";
import {visoesService} from "../../../../../services/visoes.service";
import { processoSeiMask } from "../../../../../utils/ProcessoSeiMask";


export const ProcessoSeiRegularidade = ({dadosDaAssociacao}) => {


    const [processoRegularidade, setProcessoRegularidade] = useState({
        processo_regularidade: dadosDaAssociacao.dados_da_associacao.processo_regularidade,
    });

    const [associacaoUuid, setAssociacaoUuid] = useState(dadosDaAssociacao.dados_da_associacao.uuid);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //buscaAssociacao();
        setLoading(false)
    }, []);


    const handleSubmit = async (values) => {
        setLoading(true);

        const payload = {
            "processo_regularidade": values.processo_regularidade
        };

        try {
            const response = await updateAssociacao(associacaoUuid, payload);
            if (response.status === 200) {
                setProcessoRegularidade({processo_regularidade:values.processo_regularidade})
                console.log("Operação realizada com sucesso!");
            } else {
                console.log(response);
                return
            }
        } catch (error) {
            console.log(error);
            return
        }
        setLoading(false)
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
                processoRegularidade !== undefined ? (
                    <>
                        <div className="row">
                            <div className="d-flex bd-highlight">
                                <div className="flex-grow-1 bd-highlight">
                                    <p className="mb-1 ml-2 titulo-explicativo-dre-detalhes">Processos SEI</p>
                                </div>
                            
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 mt-3">

                                <Formik
                                    initialValues={processoRegularidade}
                                    validateOnBlur={true}
                                    validationSchema={YupSignupSchemaDadosDaAssociacao}
                                    enableReinitialize={true}
                                    onSubmit={handleSubmit}
                                >
                                    {props => (
                                        <form onSubmit={props.handleSubmit}>
                                            <div className="form-row ">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="processo-regularidade"><strong>Processo SEI de regularidade</strong></label>
                                                    <div className="d-flex align-items-center">
                                                    <MaskedInput
                                                        mask={(valor) => processoSeiMask(valor)}
                                                        onChange={props.handleChange}
                                                        name="processo_regularidade"
                                                        className="form-control"
                                                        placeholder="Número do processo SEI"
                                                        value={props.values.processo_regularidade}
                                                        id="processo_regularidade"
                                                        onBlur={props.handleBlur}
                                                        disabled={!visoesService.getPermissoes(['change_processo_sei'])}
                                                    />
                                                        {props.touched.processo_regularidade && props.errors.processo_regularidade && <span className="span_erro text-danger mt-1"> {props.errors.processo_regularidade} </span>}
                                                        <button
                                                            type="submit"
                                                            className="btn btn btn btn-success mr-0 mb-2 ml-md-2 mt-2"
                                                            disabled={!visoesService.getPermissoes(['change_processo_sei'])}
                                                        >
                                                            Salvar
                                                        </button>
                                                    </div>
                                                </div>


                                            </div>

                                        </form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </>
                ) : null}
        </>
    );
};