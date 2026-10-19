import { Row, Col } from "antd";

const CargoTimelineItemLista = ({ cargoRow }) => (
    <Row key={cargoRow.cargo_associacao}
        className="linha-composicao-data CargoTimelineItemLista">
        <Col sm={12} md={8} lg={4} xl={4} className="text-muted">
            {cargoRow.cargo_associacao_label}
        </Col>
        <Col md={3} className="text-muted">
            {cargoRow?.ocupante_do_cargo?.representacao_label || '-'}
        </Col>
        <Col md={3} className="text-muted">
            {cargoRow?.ocupante_do_cargo?.representacao === "SERVIDOR" ? cargoRow?.ocupante_do_cargo?.codigo_identificacao : '-'}
        </Col>
        <Col md={8} className="text-muted">
            {cargoRow.nomeOuVago}
        </Col>
    </Row>
);


export const CargosTimelineModoListagem = ({ cargos, secao }) => {
    return (
        <>
            <p className="titulo-secao-composicao CargosTimelineModoListagem">
                <strong>{secao}</strong>
            </p>

             <Row className="linha-composicao-data">
                <Col sm={12} md={8} lg={4} xl={4} className="font-weight-bold">
                    Cargo
                </Col>
                <Col md={3} className="font-weight-bold">
                    Representação
                </Col>
                <Col md={3} className="font-weight-bold">
                    RF
                </Col>
                <Col md={8} className="font-weight-bold">
                    Ocupante/Situação
                </Col>
            </Row>

            {cargos.map((cargoRow) => (
                <CargoTimelineItemLista
                    key={cargoRow.cargo_associacao} cargoRow={cargoRow} />
            ))}
           
        </>
    );
};