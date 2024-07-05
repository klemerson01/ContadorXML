const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

const isPackaged = typeof process.pkg !== "undefined";

const basePath = isPackaged ? path.dirname(process.execPath) : __dirname;
const pasta = path.join(basePath, "NFCe");

var novoArray = [];
var semLer = [];
let countNFCeProblema = 0;

const extrairNumeroSerieNFCe = (data, xml) => {
  const parser = new xml2js.Parser();
  return new Promise((resolve, erro) => {
    parser.parseString(data, (err, result) => {
      if (err) {
        console.error("Erro ao processar o arquivo XML:", err);
        return;
      }

      try {
        let tagModNfce = result.nfeProc.NFe[0].infNFe[0].ide[0].mod;
        var tagNumNFce = result.nfeProc.NFe[0].infNFe[0].ide[0].nNF;
        let tagSerieNfce = result.nfeProc.NFe[0].infNFe[0].ide[0].serie;

        tagModNfce == "65"
          ? resolve({ NumeroNFCe: tagNumNFce[0], SerieNFCe: tagSerieNfce[0] })
          : "error teste";
      } catch (error) {
        resolve(0);
        console.log("Não foi possivel ler o arquivo", xml);
        semLer.push(xml);
        countNFCeProblema++;
      }
    });
  });
};

const LerArquivoXML = async (xml) => {
  var retornoReadFile;
  return new Promise(async (resolve, erro) => {
    retornoReadFile = fs.readFileSync(path.join(pasta, xml));
    const resultadoExtrair = await extrairNumeroSerieNFCe(retornoReadFile, xml);
    resolve(resultadoExtrair);
  });
};

const TodosXMLs = fs.readdirSync(pasta);

if (TodosXMLs.length == 0) {
  fs.writeFileSync("Resultado.txt", "Sem XMLs na pasta !!");
  console.log("Sem XMLs na pasta !!");
  while (1 == 1) {}
}

let countNFCeExistente = 0;
let arraySeries = [];
let notasFaltantes = [];
let countNFCeFaltantes = 0;

const addUniqueElement = (element) => {
  if (!arraySeries.includes(element)) {
    arraySeries.push(element);
  }
};

(async () => {
  await Promise.all(
    TodosXMLs.map(async (xml) => {
      const dados = await LerArquivoXML(xml);
      if (Number(dados.SerieNFCe) > 0) {
        addUniqueElement(Number(dados.SerieNFCe));
      }

      novoArray.push(dados);
      countNFCeExistente++;
    })
  );

  for (let index = 0; index < arraySeries.length; index++) {
    const serieAtual = arraySeries[index];
    const filtroSerie = novoArray.filter((element) => {
      return element.SerieNFCe == serieAtual;
    });
    filtroSerie.sort((a, b) => a - b);

    for (
      let i = filtroSerie[0].NumeroNFCe;
      i <= filtroSerie[filtroSerie.length - 1].NumeroNFCe;
      i++
    ) {
      const found = filtroSerie.find((element) => element.NumeroNFCe == i);
      if (found == undefined) {
        notasFaltantes.push({ NumeroNFCe: i, SerieNFCe: serieAtual });
        countNFCeFaltantes++;
      }
    }
  }

  console.log("Contador notas com problemas:", countNFCeProblema);
  console.log("=======================================");
  console.log("NFCe faltantes: ", notasFaltantes);
  console.log("Contador faltantes: ", countNFCeFaltantes);
  console.log("=======================================");
  console.log("Contador NFCe existentes: ", countNFCeExistente);

  const data = {
    Nfce_Problema: semLer,
    Qtd_Problemas: countNFCeProblema,
    Notas_Faltantes: notasFaltantes,
    Qtd_faltantes: countNFCeFaltantes,
  };

  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync("Resultado.txt", jsonData);

  while (1 == 1) {}
})();
