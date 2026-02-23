class Camera {
    x: number;
    y: number;
    zoom: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 0;
    }
}

const camera = new Camera();
export const getCamera = () => camera;
export const moveCamera = (x: number, y: number) => {
    camera.x += x;
    camera.y += y;
}
