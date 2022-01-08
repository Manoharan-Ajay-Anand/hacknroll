export function capFirst(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getRandomInt(min:number, max:number) {
  	return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function generateName(){
	var first_name = ["abandoned","able","absolute","adorable","citric","mee","Ugandan","smoke weed"];

	var last_name = ["people","history","way","art","world","phelgm","mawrrrr","knuckles","everyday"];

	var name = capFirst(first_name[getRandomInt(0, first_name.length)]) + ' ' + capFirst(last_name[getRandomInt(0, last_name.length)]);
    // document.getElementById("random_name").innerHTML = name;
    return name;
}