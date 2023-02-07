import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  if (error && Array.isArray(error.message)) {
    return (
      error && (
        <div className="alert alert-danger m-2">
          Errors:
          <ul>
            {error.message.map((msg) => (
              <li>{msg}</li>
            ))}
          </ul>
        </div>
      )
    );
  }
  return (
    error && (
      <div className="alert alert-danger m-2">Error: {error.message}</div>
    )
  );
}

export default ErrorAlert;
