import React, {useState, createContext, useContext} from "react";
import {GetDadosApiDespesaContext} from "../GetDadosApiDespesa";

export const DadosDoGastoContext = createContext( {
    dadosDoGasto: [],
    inputFields: [],
    setDadosDoGasto(){},

    limpaFormulario(){},

    valoresIniciaisFormDespesa:[],
    setValoresIniciaisFormDespesa(){},

    initialValues:[],
    setInitialValues(){},

    idAssociacao:[],
    setIdAssociacao(){},

    verboHttp:[],
    setVerboHttp(){},

    idDespesa:[],
    setIdDespesa(){},
});

export const DadosDoGastoContextProvider = ({children}) => {

    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    const [idAssociacao, setIdAssociacao] = useState("52ad4766-3515-4de9-8ab6-3b12078f8f14")
    const [verboHttp, setVerboHttp] = useState("")
    const [idDespesa, setIdDespesa] = useState("")

    const [initialValues, setInitialValues] = useState( {
        associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
        cpf_cnpj_fornecedor: "",
        nome_fornecedor: "",
        tipo_documento: "",
        numero_documento: "",
        data_documento: "",
        tipo_transacao: "",
        data_transacao: "",
        valor_total: "",
        valor_recursos_proprios: "",
        valorRecursoAcoes: "",
        dadosDoGasto: "",
        rateios: [{
            associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
            aplicacao_recurso: "",
            tipo_aplicacao_recurso: "",
            tipo_custeio: 1,
            especificacao_material_servico: "",
            conta_associacao: "",
            acao_associacao: "",
            valor_rateio: "",
            quantidade_itens_capital: "",
            valor_item_capital: "",
            numero_processo_incorporacao_capital: "",
        }],

    })

    const [valoresIniciaisFormDespesa, setValoresIniciaisFormDespesa] = useState(
        {
            associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
            cpf_cnpj_fornecedor: "",
            nome_fornecedor: "",
            tipo_documento: "",
            numero_documento: "",
            data_documento: "",
            tipo_transacao: "",
            data_transacao: "",
            valor_total: "",
            valor_recursos_proprios: "",
            valorRecursoAcoes: "",
            dadosDoGasto: "",
            rateios: [{
                associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                aplicacao_recurso: "",
                tipo_aplicacao_recurso: "",
                tipo_custeio: 1,
                especificacao_material_servico: "",
                conta_associacao: "",
                acao_associacao: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
                numero_processo_incorporacao_capital: "",
            }],

        }
    )

    const [dadosDoGasto, setDadosDoGasto] = useState({
        // Custeio
        tipo_aplicacao_recurso: "CUSTEIO",

    })

    const handleChangeDadosDoGasto = (name, value) => {
        setDadosDoGasto({
            ...dadosDoGasto,
            [name]: value
        });

        dadosApiContext.setEspecificacaoMterialServico(value)

    };

    const limpaFormulario = ()=>{
        setDadosDoGasto([
            {  // Custeio
                associacao: "INPUT FIELDS - 07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                aplicacao_recurso: "",
                tipo_aplicacao_recurso: 1,
                tipo_custeio: 1,
                especificacao_material_servico:"",
                conta_associacao:"conta1",
                acao_associacao:"",
                valor_rateio:'',
                //Capital
                quantidade_itens_capital:'',
                valor_item_capital:'',
                numero_processo_incorporacao_capital:"", }
        ]);
    }

    return (
        <DadosDoGastoContext.Provider value={
            {
                dadosDoGasto,
                setDadosDoGasto,

                handleChangeDadosDoGasto,

                limpaFormulario,

                valoresIniciaisFormDespesa,
                setValoresIniciaisFormDespesa,

                initialValues,
                setInitialValues,

                idAssociacao,
                setIdAssociacao,

                verboHttp,
                setVerboHttp,

                idDespesa,
                setIdDespesa,



            } }>
            {children}
        </DadosDoGastoContext.Provider>
    )
}