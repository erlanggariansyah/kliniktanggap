import React from 'react';

const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`loading ${sizeClasses[size]}`}></div>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Loading;