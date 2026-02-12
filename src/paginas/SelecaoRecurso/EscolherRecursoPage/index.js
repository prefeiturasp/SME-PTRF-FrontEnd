import { Card, Typography, Row, Col, Spin } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import useRecursoSelecionado from "../../../hooks/Globais/useRecursoSelecionado";
import { visoesService } from "../../../services/visoes.service";

const { Title, Text } = Typography;

export const EscolherRecursoPage = () => {
  const { recursos, handleChangeRecurso, isLoading } = useRecursoSelecionado({ visoesService });

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <Title level={5} style={{ color: "#fff", marginBottom: 4, textAlign: "center" }}>
          Deseja acessar os dados de qual recurso?
        </Title>

        <Title
          level={5}
          style={{
            color: "#fff",
            marginBottom: 24,
            textAlign: "center",
            fontWeight: 400,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Os dados de Resumo de recursos, Créditos, Gastos da Escola e Prestação de contas serão exibidos conforme o
          recurso selecionado.
        </Title>

        <Row gutter={[16, 16]} align={"center"} style={styles.cardRow}>
          {recursos.map((recurso) => (
            <Col key={recurso.id} xs={24} md={6}>
              <Spin spinning={isLoading}>
                <Card hoverable style={styles.card} onClick={() => handleChangeRecurso(recurso)} loading={isLoading}>
                  {recurso.icone && <img style={styles.icone} src={recurso.icone} alt="Logo"></img>}
                  <Text style={{ ...styles.cardTitle, color: recurso.cor }}>{recurso.nome}</Text>
                  <div style={styles.arrow}>
                    <ArrowRightOutlined style={{ color: recurso.cor }} />
                  </div>
                </Card>
              </Spin>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000000,
  },

  container: {
    width: "100%",
    padding: 32,
    textAlign: "center",
  },

  card: {
    borderRadius: 8,
    minHeight: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardRow: {
    marginTop: 24,
  },

  cardTitle: {
    fontWeight: 700,
  },

  arrow: {
    display: "flex",
    alignItems: "justify",
    justifyContent: "end",
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 18,
  },

  icone: {
    width: "100%",
    height: 40,
    marginBottom: 8,
  },
};
