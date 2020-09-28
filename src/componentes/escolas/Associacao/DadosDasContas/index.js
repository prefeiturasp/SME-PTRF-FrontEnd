import React, {useEffect, useState} from "react";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import Loading from "../../../../utils/Loading";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {getContas, salvarContas} from "../../../../services/escolas/Associacao.service";
import {FormDadosDasContas} from "./FormDadosDasContas";
import {ModalConfirmaSalvar} from "../../../../utils/Modais";
import {ExportaDadosDaAsssociacao} from "../ExportaDadosAssociacao";

export const DadosDasContas = () => {

    const initial = [{
        tipo_conta: "",
        banco_nome: "",
        agencia: "",
        conta_associacao: "",
        numero_conta: "",
    }];

    const [loading, setLoading] = useState(true);
    const [intialValues, setIntialValues] = useState(initial);
    const [showSalvar, setShowSalvar] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() =>{
        buscaContas();
    }, []);

    useEffect(()=>{
        setLoading(false)
    }, []);

    const buscaContas = async ()=>{
        let contas = await getContas();
        setIntialValues(contas)
    };

    const setaCampoReadonly=(nome_conta) =>{
        return nome_conta === "Cartão"
    };


    const temErros = (values) => {
        const errors = {};
        values.contas.map((item)=>{
            if (item.tipo_conta.nome !== 'Cartão') {
                if (!item.tipo_conta || !item.banco_nome || !item.agencia || !item.numero_conta){
                    errors.campos_obrigatorios = "Todos os campos são obrigatórios"
                }
            }
        });

        return errors;
    };

    const onSubmit = async (values) => {
        if (values.contas && values.contas.length > 0 ){
            const erros = temErros(values);
            setErrors(erros);
            if ("campos_obrigatorios" in erros) {
                return
            }

            setLoading(true);
            let payload = [];
            values.contas.map((value)=>{
                payload.push({
                    "uuid": value.uuid,
                    "tipo_conta": value.tipo_conta.id,
                    "banco_nome": value.banco_nome,
                    "agencia": value.agencia,
                    "numero_conta": value.numero_conta

                })
            });
            try {
                await salvarContas(payload);
                await buscaContas();
                setShowSalvar(true)
            }catch (e) {
                console.log("Erro ao salvar conta", e)
            }
            setLoading(false)
        }
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
                <div className="row">
                    <div className="col-12">
                        <MenuInterno
                            caminhos_menu_interno = {UrlsMenuInterno}
                        />
                        <ExportaDadosDaAsssociacao/>
                        <FormDadosDasContas
                            intialValues={intialValues}
                            onSubmit={onSubmit}
                            setaCampoReadonly={setaCampoReadonly}
                            errors={errors}
                        />
                    </div>

                    <ModalConfirmaSalvar
                        show={showSalvar}
                        handleClose={()=>setShowSalvar(false)}
                        titulo="Contas salvas"
                        texto="A edição foi salva com sucesso"
                        primeiroBotaoCss="success"
                    />
                </div>
            }
        </>
    )
};