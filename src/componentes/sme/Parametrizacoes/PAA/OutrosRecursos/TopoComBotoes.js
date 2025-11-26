import {useContext} from "react";
import { Row, Col } from "antd";
import { OutrosRecursosPaaContext } from "./context/index";
import { IconButton } from "../../../../Globais/UI";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(OutrosRecursosPaaContext)

    return(
        <Row className="mb-3">
            <Col span={24} align="right">
                <IconButton
                    icon="faPlus"
                    iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                    label="Adicionar Outros Recursos"
                    onClick={()=>{
                        setStateFormModal(initialStateFormModal);
                        setShowModalForm(true);
                    }}
                    variant="success"
                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                />
            </Col>
        </Row>
    )

}