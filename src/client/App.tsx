
import React from 'react';
import ImageForm from './components/form';
import { useUpload } from './context/upload.context';
import Draggable from 'react-draggable';
import {type DraggableEvent} from 'react-draggable';

const App: React.FC = () => {

  const {uploadData, triggerData, setTriggerData} = useUpload();
  const draggableRef = React.useRef<HTMLDivElement>(null);


  const handleDrag = (e: DraggableEvent, data: {
    node: HTMLElement;
    x: number;
    y: number;
  }) => {

  const node = data.node;
  const parent = node.offsetParent as HTMLElement;
  const nodeRect = node.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  // Data.x and Data.y are the pixel positions within the parent relative to the CENTER
  // i.e x and y = 0 is the center of the parent element
  
  data.x = data.x + (parentRect.width / 2);
  data.y = data.y + (parentRect.height / 2);

  const maxX = parentRect.width - nodeRect.width;
  const maxY = parentRect.height - nodeRect.height;


  const percentX = (data.x / maxX) * 100;
  const percentY = (data.y/ maxY) * 100;

  const position = {
    left: Math.min(100, Math.max(0, percentX)),
    top: Math.min(100, Math.max(0, percentY)),
  }
    console.log('Drag stopped at position:', position);
    setTriggerData((prev)=>{
      const parentElement = draggableRef.current?.parentElement;
      if (!parentElement) return prev;
    
      return {
        ...prev,
        position: {x: position.left, y: position.top}
      }
    })

  };

  return (
    <div className="flex h-screen">
      {/* Left side - Form */}
      <div className="grow flex-1 p-8 bg-base-200 border-r border-base-300">
        <h2 className="text-2xl font-bold mb-6">Upload Form</h2>
        <ImageForm />
      </div>

      {/* Right side - Responsive div with 2.16:1 ratio */}
      <div className="flex-1 p-8 flex justify-center items-center">
        <div className="relative w-full max-w-2xl aspect-[1/2.16] max-h-[90vh] bg-base-300 border-2 border-dashed border-base-content/30 rounded-lg flex items-center justify-center">
          {uploadData.imageUrl? <img
            src={uploadData.imageUrl}
            alt="Preview"
            className="absolute inset-0 max-w-full max-h-full object-contain rounded-lg"
          /> : null}
          <Draggable nodeRef={draggableRef} onStop={handleDrag} bounds="parent" >
            <div ref={draggableRef}>
              {triggerData.type === 'zone' ? (
                <div className="border-2 border-primary rounded-full bg-primary/20 w-24 h-24 flex items-center justify-center cursor-move">
                  <span className="text-primary font-semibold">Hotzone</span>
                </div>
              ) : triggerData.type === 'button' ? (
                <div className="btn btn-primary cursor-move">
                  {triggerData.label || 'Button'}
                </div>
              ) : <div></div>}
            </div>

          </Draggable>
        </div>
      </div>
    </div>
  );
};

export default App;