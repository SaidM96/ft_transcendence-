


class Animal{
    Name : string = "";
    constructor(_name : string) {
        this.Name = _name;
    }
    move(dis : number = 0){
        console.log (`${this.Name} moved ${dis}m.`);
    }
}
class Snake extends Animal{
    constructor(_name : string){
        super(_name);
    }
    move(dis : number){
        console.log("snake ...");
        super.move(dis);
    }
}

class Horse extends Animal{
    constructor(_name : string){
        super(_name);
    }
    move(dis : number){
        console.log("horse ...");
        super.move(dis);
    }
}

const L3iba = () =>{
    let horse = new Horse("homed");
    let snake = new Snake("python");
    horse.move(45);
    snake.move(10);
    return(
        <div className="h-screen bg-slate-300 p-4">hello world</div>
    );

}

export default L3iba;