import './App.css';
import {useEffect, useRef} from 'react';

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ws = useRef<WebSocket | null>(null);
    const isDrawing = useRef<boolean>(false);
    const drawingPixels = useRef<Array<{ x: number; y: number }>>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/canvas');

        ws.current.onclose = () => console.log('Connection closed');

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;

            if (data.type === 'INIT') {
                data.pixels.forEach((pixel: { x: number; y: number }) => {
                    drawPixel(context, pixel.x, pixel.y);
                });
            }
            if (data.type === 'DRAW') {
                data.pixels.forEach((pixel: { x: number; y: number }) => {
                    drawPixel(context, pixel.x, pixel.y);
                });
            }
        };

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        const startDrawing = (e: MouseEvent) => {
            isDrawing.current = true;
            draw(e);
        };


        const stopDrawing = () => {
            if (!isDrawing.current) return;
            isDrawing.current = false;


            if (ws.current) {
                ws.current.send(JSON.stringify({type: 'DRAW', pixels: drawingPixels.current}));
            }
        };

        const draw = (e: MouseEvent) => {
            if (!isDrawing.current) return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            drawPixel(context, x, y);

            drawingPixels.current.push({x, y});
        };

        const drawPixel = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.arc(x,y, 15, 0, Math.PI * 2);
            ctx.fill()
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);

        return;
    }, []);

    return <canvas ref={canvasRef}>Canvas</canvas>;
};

export default App;
