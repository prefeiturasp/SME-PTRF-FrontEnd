import React, { useState } from "react";
import { Modal, Timeline, Divider, Tag, Space } from "antd";
import { SwapOutlined, CaretUpFilled, CaretDownFilled } from "@ant-design/icons";
import { Badge } from "react-bootstrap";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import { useGetTimelineCargoComposicaoVacancia } from "../hooks/useGetTimelineCargoComposicaoVacancia";


export const ModalTimelineCargoVacancia = ({ show, handleClose, composicaoUuid, cargoAssociacao, cargoLabel }) => {
    const dataTemplate = useDataTemplate();
    const { isLoading, data: registros } = useGetTimelineCargoComposicaoVacancia(composicaoUuid, cargoAssociacao);
    // o backend sempre retorna em ordem crescente (mais antigo primeiro)
    const [ordemCrescente, setOrdemCrescente] = useState(true);

    const registrosOrdenados = ordemCrescente ? registros : [...registros].reverse();

    const montaItens = () => registrosOrdenados.map((registro) => ({
        color: registro.vago ? "red" : (registro.substituto || registro.substituido) ? "blue" : "green",
        children: (
            <div>
                <strong>{registro.vago ? "Cargo Vago" : registro.ocupante_do_cargo?.nome}</strong>
                <div>
                    {dataTemplate("", "", registro.data_inicio_no_cargo)} até {dataTemplate("", "", registro.data_fim_no_cargo)}
                </div>
                {registro.substituto && <Badge className="badge-substituto">Substituição direta</Badge>}
                {registro.substituido && <Badge className="badge-substituido">Substituído</Badge>}
            </div>
        ),
    }));

    return (
        <Modal
            className="ModalTimelineCargoVacancia"
            title={<span>Linha temporal do cargo{cargoLabel ? ` — ${cargoLabel}` : ""}</span>}
            open={show}
            onCancel={handleClose}
            footer={null}
        >
            <Divider className="my-2"/>

            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Space wrap size="small">
                    <Tag color="green">Cargo Ocupado</Tag>
                    <Tag color="red">Cargo Vago</Tag>
                    <Tag color="blue">Cargo Substituído</Tag>
                </Space>
                <Space style={{ display: "flex", width: "100%", marginTop: "4px", marginBottom: "4px" }}>
                    <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => setOrdemCrescente((valorAtual) => !valorAtual)}>
                       {ordemCrescente ? <CaretUpFilled/> : <CaretDownFilled/> }
                    </button>
                    <span className="text-muted">{ordemCrescente ? "Do mais antigo para o mais recente" : "Do mais recente para o mais antigo"}</span>
                </Space>
            </Space>

            <Divider className="my-2"/>

            <div className="mt-8">
                {isLoading && <p>Carregando...</p>}
                {!isLoading && registros.length === 0 && <p>Nenhum registro encontrado.</p>}
                {!isLoading && registros.length > 0 && <Timeline className="timeline" items={montaItens()} />}
            </div>
        </Modal>
    );
};