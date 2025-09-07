import { useEffect, useRef } from 'react';
import * as bwipjs from 'bwip-js';

interface PDF417BarcodeProps {
  data: string;
  width?: number;
  height?: number;
}

export default function PDF417Barcode({ data, width = 300, height = 100 }: PDF417BarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: 'pdf417',
        text: data,
        scale: 2,
        height: 10,
        includetext: false,
        backgroundcolor: 'ffffff',
        color: '000000'
      });
    } catch (error) {
      console.error('Error generating PDF417 barcode:', error);
    }
  }, [data]);

  return (
    <div className="barcode-container flex flex-col items-center my-4 px-4">
      <canvas 
        ref={canvasRef}
        style={{ maxWidth: width, height: height }}
        data-testid="pdf417-barcode"
        className="border border-gray-200 rounded-sm shadow-sm"
      />
    </div>
  );
}