export const Button = ({
  children,
  onClick,
  testId,
  type = "submit",
  isLight = false,
}) => {
  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${
        isLight
          ? "bg-blue-200 text-blue-900 hover:bg-blue-300"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {children}
    </button>
  );
};
