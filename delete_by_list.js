var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://user:password@address.com',
  log: 'trace',
  apiVersion: '7.x'
});


let type = '_doc';
let arrayIndicesGreen = [];
let arrayIndicesYellow = [];
let arrayIndicesRed = [];


queryPages();

async function queryPages() {
  try {
    await queryIndices();
    arrayIndicesGreen.forEach(numberOfIndice => {
      const resultTotalPages = countPages(numberOfIndice);
// Debug Here
//      console.log(numberOfIndice)
//
      let currentDate = new Date();
      if (resultTotalPages.count > 10) {
        let pagesTotal = Math.round(resultTotalPages.count / 10);
        let page = 1;
        while (pagesTotal > page) {
          let resultForPage;
          try {
            resultForPage = await (readPages(numberOfIndice.index, page)).hits.hits;
            resultForPage.forEach(async element => {
  
              let result = await dateDiference(element._id, currentDate);
              if (Math.round(result) > 15) {
                console.log('iterou')
  
                if (await checkElementById(numberOfIndice.index, element._id)) {
                  console.log(element._id);
                  return true;
                }
                console.log("Parou no ID:", element._id);
                return false;
              }
              stop();
              console.log("Data a Menor!")
  
            });
  
          } catch (error) {
            console.log(error);
          }
          page++;
        }
      }
      console.log("Condicional Negativa")
    })
  } catch (error) {
    console.log("Erro na Query! ")
  }
}

async function checkElementById(indice, id) {
  try {
    const auxiliar = await client.get({
      index: indice,
      type: type,
      id: id
    });
    if (auxiliar.found) {
      console.log('Status da Verificação:', id, '=', auxiliar.found)
      await deleteDocumentByQuery(id)
      return true;
    }
    console.log('Status da verificação:', id, '=', auxiliar.found);
    return false;
  } catch (error) {
    console.log(id, " não consta!!")
  }
}

async function dateDiference(element, currentDate) {
  let oldDate = new Date(JSON.stringify(element._source['@timestamp']).substring(1, 11));
  let result = ((((currentDate - oldDate) / 1000) / 60) / 60) / 24;
  return result;
}

async function deleteDocumentByQuery(indice, id) {
  console.log("ID do Document:", id)
  return await client.delete({
    index: indice,
    type: type,
    id: id
  });
}

async function countPages(indice) {
  return await client.count({
    index: indice,
    type: type,
  });
}

async function readPages(indice, page) {
  return await client.search({
    index: indice,
    type: type,
    from: page,
    timeout: '120m'
  });
}

async function queryIndices(){
  try {
      let listAll = await listAllIndices();
      listAll.forEach(element => {
          verifyHealthOfIndice(element);
      });
      console.log("Finalizado!")
  } catch (error) {
      console.log(error)
  }
}

async function listAllIndices(){
  return await client.cat.indices({
      format: 'json'
     }); 
}

async function verifyHealthOfIndice(element){
  if(element.health == "green"){
      return arrayIndicesGreen.push(element.index);
  }
  else if(element.health == "yellow"){
      return arrayIndicesYellow.push(element.index);
  }
  else if(element.health == "red"){
      return arrayIndicesRed.push(element.index)
  }
  else {
      console.log("indefinido")
      return console.log(element.index, element.health);
  }
}

