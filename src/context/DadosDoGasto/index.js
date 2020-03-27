import React, {useState, createContext, useEffect} from "react";
import Api from "../../services/Api";

export const DadosDoGastoContext = createContext( {
    dadosDoGasto: [],
    inputFields: [],
    setDadosDoGasto(){},
    setInputFields(){},
    handleAddFields(){},
    handleRemoveFields(){},
    handleInputChange(){},
    limpaFormulario(){},

    retornApi:[],
    setRetornoApi(){},
    GetTiposCusteioApi(){},
});

export const DadosDoGastoContextProvider = ({children}) => {
    const [retornApi, setRetornoApi] = useState([]);
    const GetTiposCusteioApi = () =>{

        useEffect(() => {
            async function loadApi() {
                const response = await Api.get('tipos_custeio')
                setRetornoApi(response.data)
            }
            loadApi();
        }, [])
        //return retornApi
    }

    const [dadosDoGasto, setDadosDoGasto] = useState({
        // Custeio
        associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
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
        numero_processo_incorporacao_capital:"",
    })

    const [inputFields, setInputFields] = useState([
        { firstName: '', lastName: '' }
    ]);

    const handleAddFields = () => {
        const values = [...inputFields];
        values.push({ firstName: '', lastName: '' });
        setInputFields(values);
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        if (event.target.name === "firstName") {
            values[index].firstName = event.target.value;
        } else {
            values[index].lastName = event.target.value;
        }

        setInputFields(values);
    };

    const handleChangeDadosDoGasto = (name, value) => {
        setDadosDoGasto({
            ...dadosDoGasto,
            [name]: value
        });
    };

    const limpaFormulario = ()=>{
        setDadosDoGasto({
            associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
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
            numero_processo_incorporacao_capital:"",
        });
    }

    return (
        <DadosDoGastoContext.Provider value={
            {
                retornApi,
                setRetornoApi,
                GetTiposCusteioApi,
                dadosDoGasto,
                inputFields,
                setDadosDoGasto,
                setInputFields,
                handleChangeDadosDoGasto,
                handleAddFields,
                handleRemoveFields,
                handleInputChange,
                limpaFormulario
            } }>
            {children}
        </DadosDoGastoContext.Provider>
    )
}