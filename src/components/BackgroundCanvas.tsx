import { useEffect } from "react";
import { createNoise2D } from "simplex-noise";

interface BackgroundCanvasProps {
    uid: string,
    chunkiness?: number,
    x_min?: number,
    x_max?: number
}
export function BackgroundCanvas(props: BackgroundCanvasProps){

    
    useEffect(() => {
        let canvas = document.getElementById(props.uid) as HTMLCanvasElement;
        let boundingRect = canvas.getBoundingClientRect();
        let canvas_width = boundingRect.right - boundingRect.left;
        let canvas_height = boundingRect.bottom - boundingRect.top;
        let width = 1000;
        let height = 1000 * canvas_height / canvas_width;
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        let noise = createNoise2D();

        let frameCount = 0;

        function animate(){
            console.log(frameCount);
            if(ctx){
                ctx.clearRect(0, 0, 1000, 1000);
                const RECT_SIZE = props.chunkiness || 20;
                for(let x = 0; x <= canvas.width; x += RECT_SIZE * 4){
                    for(let y = 0; y <= canvas.height; y += RECT_SIZE * 4){
                        let weight = ((noise((x / canvas.width * 30) + 3/7, ((y) / canvas.height * 30  - frameCount / 60) - 2/11) + 1) / 2.5)**4 * (((x - width/2)**2 + (y - height/2)**2))/400000;
                        let color = noise(x / canvas_width + 0.22132, frameCount / 99 + x/canvas_width * 2) + 1 * (255 / 4) + 255/2;
                        ctx.fillStyle = `rgba(0, 0, ${color}, ${weight})`;
                        ctx.fillRect(x, y, RECT_SIZE, RECT_SIZE);
                    }
                }
            }        
            frameCount++;
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }, []);

    return <canvas id={props.uid} style={{width: "100%", height: "100%", zIndex: "-1", pointerEvents: "none"}}/>
}