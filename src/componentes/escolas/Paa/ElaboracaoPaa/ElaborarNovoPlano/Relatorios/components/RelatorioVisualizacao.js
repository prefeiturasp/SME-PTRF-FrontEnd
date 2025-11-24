import { Spin, Typography } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WatermarkPrevia from "../../../../../../Globais/WatermarkPrevia/WatermarkPrevia";
import "./RelatorioVisualizacao.scss";

const { Title } = Typography;

const joinClassNames = (...classes) => classes.filter(Boolean).join(" ");

export const RelatorioVisualizacao = ({
  title,
  children,
  onBack = null,
  backButtonLabel = "Voltar",
  headerActions = null,
  isLoading = false,
  error = false,
  errorContent = null,
  isEmpty = false,
  emptyContent = null,
  className = "",
  contentClassName = "",
  titleClassName = "",
  backButtonClassName = "",
  bodyClassName = "",
  watermarkIcon = "rascunho",
  showWatermark = true,
  heightDeps = [],
  spinProps = {},
}) => {
  const containerRef = useRef(null);
  const [alturaDocumento, setAlturaDocumento] = useState(0);
  const heightDepsKey = useMemo(() => JSON.stringify(heightDeps), [heightDeps]);

  const atualizarAlturaDocumento = useCallback(() => {
    if (containerRef.current) {
      setAlturaDocumento(containerRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    atualizarAlturaDocumento();
    window.addEventListener("resize", atualizarAlturaDocumento);
    return () => window.removeEventListener("resize", atualizarAlturaDocumento);
  }, [atualizarAlturaDocumento]);

  useEffect(() => {
    atualizarAlturaDocumento();
  }, [atualizarAlturaDocumento, heightDepsKey]);

  const renderContent = useMemo(() => {
    if (error) {
      return errorContent ?? null;
    }
    if (isEmpty) {
      return emptyContent ?? null;
    }
    return children;
  }, [children, emptyContent, error, errorContent, isEmpty]);

  const mergedSpinProps = {
    spinning: isLoading,
    ...spinProps,
  };

  const shouldShowWatermark =
    showWatermark && !error && !isEmpty && alturaDocumento > 0;

  return (
    <div
      className={joinClassNames("relatorio-visualizacao", className)}
      ref={containerRef}
    >
      {shouldShowWatermark && (
        <div className="relatorio-visualizacao__watermark">
          <WatermarkPrevia alturaDocumento={alturaDocumento} icon={watermarkIcon} />
        </div>
      )}

      <div
        className={joinClassNames(
          "relatorio-visualizacao__content",
          contentClassName
        )}
      >
        <div className="relatorio-visualizacao__header">
          <Title
            level={3}
            className={joinClassNames(
              "relatorio-visualizacao__title",
              titleClassName
            )}
          >
            {title}
          </Title>

          {(headerActions || onBack) && (
            <div className="relatorio-visualizacao__header-actions">
              {headerActions}
              {onBack && (
                <button
                  type="button"
                  className={joinClassNames(
                    "btn btn-outline-success",
                    backButtonClassName
                  )}
                  onClick={onBack}
                >
                  {backButtonLabel}
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={joinClassNames(
            "relatorio-visualizacao__body",
            bodyClassName
          )}
        >
          <Spin {...mergedSpinProps}>{renderContent}</Spin>
        </div>
      </div>
    </div>
  );
};

