import React, { Fragment, useState, useEffect } from "react";

const Tabs = ({ tabs, initialActiveTab, onTabClick, identifier = "nav" }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  function handleTabClick(tabId, index) {
    setActiveTab(tabId);
    onTabClick && onTabClick(tabId, index);
  }

  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  return (
    <nav>
      <div
        className="nav nav-tabs mb-3 menu-interno-dre-prestacao-de-contas"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <Fragment key={index}>
            <a
              onClick={() => handleTabClick(tab.uuid, index)}
              className={`nav-link btn-escolhe-acao ${
                activeTab === tab.uuid ? "btn-escolhe-acao-active" : ""
              }`}
              id={`${identifier}-${tab.uuid}-tab`}
              data-toggle="tab"
              href={`#${identifier}-${tab.uuid}`}
              role="tab"
              aria-controls={`${identifier}-${tab.uuid}`}
              aria-selected={activeTab === tab.uuid ? "true" : "false"}
            >
              {tab.label}
            </a>
          </Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Tabs;
