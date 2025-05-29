const LoadingBubble = () => {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="loader"></div>
      <p className="text-muted-foreground text-sm mt-2">
        Letting the wise ones chew on this...
      </p>
    </div>
  );
};
export default LoadingBubble;
