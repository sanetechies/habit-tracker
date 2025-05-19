import React from 'react';
export const Card = ({ children }) => {
    return (
      <div className="border border-gray-200 rounded shadow-sm bg-white p-4">
        {children}
      </div>
    );
  };
  
  export const CardContent = ({ children, className = "" }) => {
    return <div className={`space-y-2 ${className}`}>{children}</div>;
  };