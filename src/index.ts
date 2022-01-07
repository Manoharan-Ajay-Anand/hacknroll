import './style.css'
import { RenderEngine } from './engine/render'
import { PhysicsEngine } from './engine/physics';

const renderEngine = new RenderEngine(
    document.querySelector('canvas.webgl'), 
    { width: window.innerWidth, height: window.innerHeight }
);

const physicsEngine = new PhysicsEngine(renderEngine);

window.addEventListener('resize', () => {
    renderEngine.resize({ width: window.innerWidth, height: window.innerHeight });
});

renderEngine.init().then(() => {
    startAnimation(); 
});

function startAnimation() {
    physicsEngine.animate();
    window.requestAnimationFrame(startAnimation);
}
