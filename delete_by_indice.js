var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://user:password@address.com',
  log: 'trace',
  apiVersion: '7.x'
});

let indice = ['Indice-here'];
let type = '_doc';


queryPages();

async function queryPages() {
  try {
      const resultTotalPages = await countPages();
      let currentDate = new Date();
      if (resultTotalPages.count > 10) {
        let pagesTotal = Math.round(resultTotalPages.count / 10);
        let page = 1;
        while (pagesTotal > page) {
          let resultForPage;
          try {
            console.log("*********READ*******")
            resultForPage = await (readPages(page)).hits.hits;
            resultForPage.forEach(async element => {
              console.log("***********************")
              console.log(element._id);
              console.log("***********************")
              let result = await dateDiference(element._id, currentDate);
              console.log(result)
              if (Math.round(result) > 15) {
                console.log('iterou')
  
                if (await checkElementById(element._id)) {
                  console.log(element._id);
                  await deleteDocumentByQuery(element._id)
                  return true;
                }
                console.log("Parou no ID:", element._id);
                return false;
              }
              stop();
              console.log("Data a Menor!")
  
            });
            break;
          } catch (error) {
            console.log(error);
          }
          page++;
        }
      }
      console.log("Conditional Negative")
      
  } catch (error) {
    console.log("Erro on Query! ")
  }
}

async function checkElementById(id) {
  try {
    const auxiliar = await client.get({
      index: indice,
      type: type,
      id: id
    });
    if (auxiliar.found) {
      console.log('Status of verification:', id, '=', auxiliar.found)
      await deleteDocumentByQuery(id)
      return true;
    }
    console.log('Status of verification:', id, '=', auxiliar.found);
    return false;
  } catch (error) {
    console.log(id, " nothing here!!")
  }
}

async function dateDiference(element, currentDate) {
  let oldDate = new Date(JSON.stringify(element._source['@timestamp']).substring(1, 11));
  let result = ((((currentDate - oldDate) / 1000) / 60) / 60) / 24;
  return result;
}

async function deleteDocumentByQuery(id) {
  console.log("ID of Document:", id)
  return await client.delete({
    index: indice,
    type: type,
    id: id
  });
}

async function countPages() {
  return await client.count({
    index: indice,
    type: type,
  });
}

async function readPages(page) {
  return await client.search({
    index: indice,
    type: type,
    from: page,
    timeout: '120m'
  });
}


