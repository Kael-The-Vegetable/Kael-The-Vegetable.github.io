const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

export class Physics {
    
    constructor() {
        
        // create an engine
        this.engine = Engine.create();
        
        // create a renderer
        this.render = Render.create({
            element: document.body,
            engine: this.engine
        });
        
        // create two boxes and a ground
        var boxA = Bodies.rectangle(400, 200, 80, 80);
        var boxB = Bodies.rectangle(450, 50, 80, 80);
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        
        // add all of the bodies to the world
        Composite.add(this.engine.world, [boxA, boxB, ground]);
        
        // run the renderer
        Render.run(this.render);
        
        // create runner
        this.runner = Runner.create();
        
        // run the engine
        Runner.run(this.runner, this.engine);
    }
}