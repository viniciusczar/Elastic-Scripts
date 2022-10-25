var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://user:password@address.com',
  log: 'trace',
  apiVersion: '7.x'
});

let arrayIndicesGreen = [];
let arrayIndicesYellow = [];
let arrayIndicesRed = [];

queryIndices();

async function queryIndices(){

    try {
        let listAll = await listAllIndices();
        listAll.forEach(element => {
            verifyHealthOfIndice(element);
        });
        console.log("Finalizado!")
        console.log(arrayIndicesGreen);
    } catch (error) {
        console.log(error)
    }
}

async function listAllIndices(){
    return client.cat.indices({
        format: 'json'
       }); 
}

async function verifyHealthOfIndice(element){
    if(element.health == "green"){
        console.log(element.index, element.health);
        return arrayIndicesGreen.push(element.index);
    }
    else if(element.health == "yellow"){
        console.log(element.index, element.health);
        return arrayIndicesYellow.push(element.index);
    }
    else if(element.health == "red"){
        console.log(element.index, element.health);
        return arrayIndicesRed.push(element.index)
    }
    else {
        console.log("indefinido")
        return console.log(element.index, element.health);
    }
}
