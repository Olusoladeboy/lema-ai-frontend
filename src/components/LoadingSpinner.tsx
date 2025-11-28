const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

