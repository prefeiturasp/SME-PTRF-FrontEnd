export const Steps = ({ currentStep, stepList }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div id="timeline">&nbsp;</div>
        <div className="d-flex justify-content-between mb-3">
          {stepList.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const circuloClass = `circulo ${isActive ? "circulo-ativo" : ""}`;
            const textClass = isActive || isCompleted ? "" : "texto-inativo";

            return (
              <div key={index} className="container-circulo">
                <span className={circuloClass} data-qa={step.qa}>
                  {stepNumber}
                </span>
                <p className={`mt-2 ${textClass}`}>
                  <strong>{step.label}</strong>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
