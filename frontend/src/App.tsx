import './App.css'
import {useEffect, useRef} from "react"

const App = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.addEventListener('mousedown', (e) => {
                context.beginPath();
                context.arc(e.clientX, e.clientY, 30, 0, Math.PI * 2);
                context.fill();
            })
        }

        draw()
    }, [])


    return (
        <canvas ref={canvasRef}>
            Canvas
        </canvas>
    )
};

export default App
