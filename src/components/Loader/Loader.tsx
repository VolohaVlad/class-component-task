export const Loader = () => {
  return (
    <div className="flex justify-center items-center p-10" data-testid="loader">
      <span className="animate-spin rounded-full border-4 border-blue-400 border-t-transparent h-8 w-8 mr-2"></span>
      <span>Loading...</span>
    </div>
  );
};
