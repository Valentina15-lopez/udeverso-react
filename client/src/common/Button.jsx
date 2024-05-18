export const Button = ({ children, onClick, testId, type = "submit" }) => {
  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      className="w-full py-2 px-8 text-xl bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
    >
      {children}
    </button>
  );
};
