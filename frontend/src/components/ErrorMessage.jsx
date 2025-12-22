// components/ErrorMessage.jsx
import React from "react";

/**
 * Reusable error message.
 * Props:
 *  - message: string | null
 *  - id: optional id for aria-describedby linking
 *  - className: optional extra classes
 */
const ErrorMessage = ({ message, id, className = "" }) => {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={`pl-2 mt-1 text-sm text-red-500 ${className}`}
      aria-live="polite"
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
