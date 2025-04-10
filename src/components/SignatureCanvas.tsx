
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eraser, Pen } from "lucide-react";
import { motion } from "framer-motion";

interface SignatureCanvasProps {
  onSave: (signatureData: string) => void;
  width?: number;
  height?: number;
}

const SignatureCanvas = ({ onSave, width = 500, height = 200 }: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (context) {
      context.lineWidth = 2;
      context.lineCap = "round";
      context.strokeStyle = strokeColor;
      context.fillStyle = "transparent";
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle line to indicate where to sign
      context.strokeStyle = "#e5e7eb";
      context.beginPath();
      context.moveTo(10, height - 30);
      context.lineTo(width - 10, height - 30);
      context.stroke();
      
      // Reset to selected color
      context.strokeStyle = strokeColor;
    }
  }, [height, width, strokeColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    context.beginPath();
    context.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
    setHasDrawn(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (hasDrawn) {
      // Automatically save the signature when drawing ends
      saveSignature();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the signature line
    context.strokeStyle = "#e5e7eb";
    context.beginPath();
    context.moveTo(10, height - 30);
    context.lineTo(width - 10, height - 30);
    context.stroke();
    
    // Reset to selected color
    context.strokeStyle = strokeColor;
    setHasDrawn(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL("image/png");
    onSave(signatureData);
  };

  const colorOptions = [
    { color: "#000000", name: "Black" },
    { color: "#2563eb", name: "Blue" },
    { color: "#7c3aed", name: "Purple" },
    { color: "#059669", name: "Green" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="flex border rounded-md p-0.5 bg-muted/30">
            {colorOptions.map((option) => (
              <button
                key={option.color}
                onClick={() => setStrokeColor(option.color)}
                className="w-6 h-6 rounded-sm flex items-center justify-center"
                title={option.name}
              >
                <span 
                  className={`w-4 h-4 rounded-sm ${strokeColor === option.color ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                  style={{ backgroundColor: option.color }}
                />
              </button>
            ))}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground gap-1 ml-2">
            <Pen className="h-3 w-3" />
            <span>Sign using mouse or touch</span>
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden p-0 border border-input bg-background hover:bg-accent/5 transition-colors">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseOut={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="touch-none cursor-crosshair bg-transparent"
          />
          
          {!hasDrawn && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground text-center pointer-events-none"
            >
              <Pen className="h-6 w-6 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Draw your signature here</p>
            </motion.div>
          )}
        </div>
      </Card>
      
      <div className="flex justify-end mt-3 gap-2">
        <Button 
          type="button" 
          onClick={clearCanvas} 
          variant="outline" 
          size="sm"
          className="gap-1"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
