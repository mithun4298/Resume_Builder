import React from "react";

interface MobileFabNavigatorProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  steps: { key: string; label: string; icon: string }[];
  currentStep: string;
  onStepClick: (step: string) => void;
}

const MobileFabNavigator: React.FC<MobileFabNavigatorProps> = ({
  open,
  onOpen,
  onClose,
  steps,
  currentStep,
  onStepClick,
}) => {
  // Movable FAB state
  const [fabPosition, setFabPosition] = React.useState({ x: 20, y: window.innerHeight - 120 });
  const fabRef = React.useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [mouseDragging, setMouseDragging] = React.useState(false);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (fabRef.current && e.touches.length > 0) {
      const rect = fabRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        setDragOffset({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
        setDragging(true);
      }
    }
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setMouseDragging(true);
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    if (touch) {
      let newX = touch.clientX - dragOffset.x;
      let newY = touch.clientY - dragOffset.y;
      // Clamp to viewport
      newX = Math.max(0, Math.min(window.innerWidth - 56, newX));
      newY = Math.max(0, Math.min(window.innerHeight - 56, newY));
      setFabPosition({ x: newX, y: newY });
    }
  };

  // Handle mouse move
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDragging) return;
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      newX = Math.max(0, Math.min(window.innerWidth - 56, newX));
      newY = Math.max(0, Math.min(window.innerHeight - 56, newY));
      setFabPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => {
      setMouseDragging(false);
    };
    if (mouseDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseDragging, dragOffset]);

  // Handle touch end
  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <>
      {/* Movable Floating Action Button (FAB) */}
      <button
        ref={fabRef}
        className="fixed z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl hover:bg-blue-700 transition-all duration-200 lg:hidden"
        onClick={onOpen}
        aria-label="Quick Section Navigation"
        style={{
          left: fabPosition.x,
          top: fabPosition.y,
          opacity: 0.85,
          position: "fixed",
          display: open ? "none" : "flex",
          touchAction: "none",
          cursor: mouseDragging ? "grabbing" : "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <span>
          {/* Charging icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 21v-6H7.5a1 1 0 0 1-.8-1.6l5-7A1 1 0 0 1 14 7v6h3.5a1 1 0 0 1 .8 1.6l-6 8A1 1 0 0 1 11 21z"/>
          </svg>
        </span>
      </button>

      {/* Modal for section navigation */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={onClose}
          />
          <div className="bg-white rounded-t-2xl shadow-lg w-full max-w-md mx-auto p-6 relative z-10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Quick Section Navigation</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {steps.map((step) => (
                <button
                  key={step.key}
                  onClick={() => onStepClick(step.key)}
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 border ${
                    currentStep === step.key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <span>{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFabNavigator;
