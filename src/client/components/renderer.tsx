import { useRef } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { useUpload } from "../context/upload.context";

export const Renderer: React.FC = () => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const { uploadData, setTriggerData, triggerData } = useUpload();

  const handleDrag = (
    e: DraggableEvent,
    data: {
      node: HTMLElement;
      x: number;
      y: number;
    }
  ) => {
    const node = data.node;
    const parent = node.offsetParent as HTMLElement;
    const nodeRect = node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // Data.x and Data.y are the pixel positions within the parent relative to the CENTER
    // i.e x and y = 0 is the center of the parent element

    data.x = data.x + parentRect.width / 2;
    data.y = data.y + parentRect.height / 2;

    const maxX = parentRect.width - nodeRect.width;
    const maxY = parentRect.height - nodeRect.height;

    const percentX = (data.x / maxX) * 100;
    const percentY = (data.y / maxY) * 100;

    const position = {
      left: Math.min(100, Math.max(0, percentX)),
      top: Math.min(100, Math.max(0, percentY)),
    };
    console.log("Drag stopped at position:", position);
    setTriggerData((prev) => {
      const parentElement = draggableRef.current?.parentElement;
      if (!parentElement) return prev;

      return {
        ...prev,
        position: { x: position.left, y: position.top },
      };
    });
  };
  return (
    <div className="relative w-full max-w-2xl aspect-[1/2.16] max-h-[90vh] bg-base-300 border-2 border-dashed border-base-content/30 rounded-lg flex items-center justify-center">
      {uploadData.imageUrl ? (
        <img
          src={uploadData.imageUrl}
          alt="Preview"
          className="absolute inset-0 max-w-full max-h-full object-contain rounded-lg"
        />
      ) : null}
      <Draggable nodeRef={draggableRef} onStop={handleDrag} bounds="parent">
        <div ref={draggableRef}>
          {triggerData.type === "zone" ? (
            <div className="border-2 border-primary rounded-full bg-primary/20 w-24 h-24 flex items-center justify-center cursor-move">
              <span className="text-primary font-semibold">Hotzone</span>
            </div>
          ) : triggerData.type === "button" ? (
            <div className="btn btn-primary cursor-move">
              {triggerData.label || "Button"}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </Draggable>
    </div>
  );
};
