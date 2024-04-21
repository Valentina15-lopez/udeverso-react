import classNames from "classnames";

export const Button = ({
  children,
  onClick,
  testId,
  className, // Cambiado a opcional
  type = "submit",
}) => {
  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      className={classNames(
        "bg-rose-400 p-2 rounded-lg hover:bg-rose-600 text-white",
        className || "" // Asegurando que className no sea undefined
      )}
    >
      {children}
    </button>
  );
};
