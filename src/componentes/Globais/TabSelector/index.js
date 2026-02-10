import React from 'react';

const TabSelector = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          style={{
            ...styles.tab,
            ...(activeTab === tab.id && styles.activeTab),
            ...(index === 0 && { borderRadius: '5px 0px 0px 5px', borderRight: '0px' }),
            ...(index === tabs.length - 1 && { borderRadius: '0px 5px 5px 0px' }),
            ...(index !== 0 && index !== tabs.length - 1 && { borderRadius: '0px', borderRight: '0px' }),
          }}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

const styles = {
  tabContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#f0f0f0',
    overflowX: 'auto',
    borderRadius: '5px',
    color: "#858a8d",
    fontWeight: 'bold',
  },
  tab: {
    flex: 1,
    padding: '5px 25px',
    cursor: 'pointer',
    textAlign: 'center',
    borderBottom: '2px solid transparent',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    border: '1px solid var(--color-primary)',
  },
  activeTab: {
    color: "var(--color-primary)",
    backgroundColor: '#fff',
    fontWeight: 'bold',
  },
};

export default TabSelector;