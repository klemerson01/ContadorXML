# ContadorXML
Este projeto é uma ferramenta em Node.js para verificar se há lacunas em uma sequência numérica de arquivos XML NFCe em uma pasta especificada. Ele lê todos os arquivos XML NFCe na pasta, extrai os números dos arquivos e identifica qualquer lacuna na sequência numérica.

## Funcionalidades

- **Leitura de Diretório:** Lê todos os arquivos do diretório NFCe.
- **Filtragem de Arquivos XML:** Filtra apenas os arquivos com a extensão `.xml`.
- **Extração de Números:** Extrai os números da Nota Fiscal (NFCe) dos arquivos XML.
- **Verificação de Lacunas:** Verifica se há alguma numeração faltante na sequência de arquivos XML.

## Como Usar

1. **Clone o Repositório:**

    ```sh
    git clone https://github.com/klemerson01/ContadorXML.git
    cd ContadorXML
    ```
    
2. **Configure o Diretório:**

    Na pasta `NFCe`, inclua todos os arquivos XML que você deseja verificar.

        
3. **Execute o aplicativo:**

    ```sh
    ContadorXML.exe
    ```

5. **Resultados:**

    O executavel imprimirá no console qualquer número faltante na sequência de arquivos XML, e irá criar um arquivo `Resultado.txt` com os dados extraídos.

## Exemplo de Uso

Dada uma pasta com os seguintes arquivos XML:

```sh
  1.xml
  2.xml
  4.xml
  5.xml
```

O script identificará que o arquivo `3.xml` está faltando na sequência.

