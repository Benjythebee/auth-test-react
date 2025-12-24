
import React from 'react';
import ImageForm from './components/form';

import { Renderer } from './components/renderer';

const App: React.FC = () => {

  return (
    <div className="flex h-screen">
      {/* Left side - Form */}
      <div className="grow flex-1 p-8 bg-base-200 border-r border-base-300">
        <h2 className="text-2xl font-bold mb-6">Upload Form</h2>
        <ImageForm />
      </div>

      {/* Right side - Responsive div with 2.16:1 ratio */}
      <div className="flex-1 p-8 flex justify-center items-center">
        <Renderer />
      </div>
    </div>
  );
};

export default App;