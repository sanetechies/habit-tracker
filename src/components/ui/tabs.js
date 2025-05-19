import React from "react";

export const Tabs = ({ children, defaultValue, onValueChange }) => {
  const [active, setActive] = React.useState(defaultValue);

  const handleClick = (value) => {
    setActive(value);
    onValueChange(value);
  };

  return (
    <div className="flex space-x-2 mb-4">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          active: child.props.value === active,
          onClick: () => handleClick(child.props.value),
        })
      )}
    </div>
  );
};

export const Tab = ({ children, active, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );
};