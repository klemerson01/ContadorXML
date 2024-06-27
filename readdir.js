const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

const isPackaged = typeof process.pkg !== "undefined";

const basePath = isPackaged ? path.dirname(process.execPath) : __dirname;
const pasta = path.join(basePath, "NFCe");

var novoArray = [];
var semLer = [];
let countNFCeProblema = 0;

const LerArquivoXML = async (xml) => {
  const parser = new xml2js.Parser();
  return new Promise((resolve, erro) => {
    fs.readFile(path.join(pasta, xml), (err, data) => {
      if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
      }
      parser.parseString(data, (err, result) => {
        if (err) {
          console.error("Erro ao processar o arquivo XML:", err);
          return;
        }
        try {
          let tagModNfe = result.nfeProc.NFe[0].infNFe[0].ide[0].mod;
          var tagNumNFe = result.nfeProc.NFe[0].infNFe[0].ide[0].nNF;

          tagModNfe == "65" ? resolve(Number(tagNumNFe[0])) : error;
        } catch (error) {
          resolve(0);
          console.log("Não foi possivel ler o arquivo: ", xml);
          semLer.push(xml);
          countNFCeProblema++;
        }
      });
    });
  });
};

const TodosXMLs = fs.readdirSync(pasta);

if (TodosXMLs.length == 0) {
  fs.writeFileSync("Resultado.txt", "Sem XMLs na pasta !!");
  console.log("Sem XMLs na pasta !!");
  while (1 == 1) {}
}

let countNFCeExistente = 0;
(async () => {
  await Promise.all(
    TodosXMLs.map(async (xml) => {
      const NumNFe = await LerArquivoXML(xml);
      if (NumNFe > 0) {
        novoArray.push(NumNFe);
        countNFCeExistente++;
      }
    })
  );

  novoArray.sort((a, b) => a - b);
  console.log("=======================================");
  console.log("NFCe existentes na pasta: ", novoArray);
  console.log("Contador NFCe existentes: ", countNFCeExistente);
  console.log("=======================================");

  let notasFaltantes = [];
  let countNFCeFaltantes = 0;

  for (
    let index = novoArray[0];
    index <= novoArray[novoArray.length - 1];
    index++
  ) {
    const found = novoArray.find((element) => element == index);
    if (found == undefined) {
      notasFaltantes.push(index);
      countNFCeFaltantes++;
    }
  }
  console.log("NFCe faltantes: ", notasFaltantes);
  console.log("Contador faltantes: ", countNFCeFaltantes);

  const data = {
    NFe_ou_Nfce_Problema: semLer,
    Qtd_Problemas: countNFCeProblema,
    Notas_Faltantes: notasFaltantes,
    Qtd_faltantes: countNFCeFaltantes,
  };

  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync("Resultado.txt", jsonData);

  while (1 == 1) {}
})();
