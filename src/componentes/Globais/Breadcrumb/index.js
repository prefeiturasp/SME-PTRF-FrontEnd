import React from 'react';
import './style.scss';

const BreadcrumbComponent = ({ items }) => {
    return (
      <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li class="breadcrumb-item">
          <i className="pi pi-home"></i>
          <a href="/">Início</a>
        </li>
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.url ? <a href={item.url}>{item.label}</a> : item.label}
          </li>
        ))}
      </ol>
    </nav>
    );
};

export default BreadcrumbComponent;
