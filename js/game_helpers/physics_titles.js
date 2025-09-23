const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

export class Physics {
    static GAME_WIDTH;

    #ground;

    constructor(canvas) {
        
        // create an engine
        this.engine = Engine.create();
        
        // create a renderer
        this.render = Render.create({
            canvas: canvas,
            context: canvas.getContext("2d"),
            engine: this.engine,
        });
        this.resize();
        // create two boxes and a ground
        var boxA = Bodies.rectangle(Physics.GAME_WIDTH * 0.5, 200, 80, 80);
        var boxB = Bodies.rectangle(Physics.GAME_WIDTH * 0.55, 50, 80, 80);
        this.#ground = Bodies.rectangle(Physics.GAME_WIDTH * 0.5, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true });
        
        // add all of the bodies to the world
        Composite.add(this.engine.world, [boxA, boxB, this.#ground]);
        
        // run the renderer
        Render.run(this.render);
        
        // create runner
        this.runner = Runner.create();
        
        // run the engine
        Runner.run(this.runner, this.engine);
    }

    resize() {
        Physics.GAME_WIDTH = this.render.canvas.parentElement.clientWidth;
        Render.setSize(this.render, Physics.GAME_WIDTH, window.innerHeight);
    }
}