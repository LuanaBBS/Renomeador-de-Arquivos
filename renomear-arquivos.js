const { app, BrowserWindow } = require("electron");
const path = require("path");

function renomearArquivos() {
  const fileInput = document.getElementById("fileInput");
  const prefixoInput = document.getElementById("prefixoInput");
  const files = fileInput.files;
  const prefixo = prefixoInput.value.trim();
  const tableBody = document.querySelector("#fileTable tbody");

  // Limpar tabela
  tableBody.innerHTML = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const novoNome = prefixo + "-" + file.name;

    // Adicionar linha à tabela
    const newRow = tableBody.insertRow();
    const cellOriginal = newRow.insertCell(0);
    const cellNovoNome = newRow.insertCell(1);
    const cellAcoes = newRow.insertCell(2);

    cellOriginal.textContent = file.name;
    cellNovoNome.textContent = novoNome;

    // Adicionar campo de entrada para novo nome
    const inputNovoNome = document.createElement("input");
    inputNovoNome.type = "text";
    inputNovoNome.value = novoNome;
    cellNovoNome.appendChild(inputNovoNome);

    // Adicionar botão de download
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Baixar";
    downloadButton.addEventListener("click", () =>
      baixarArquivo(file, inputNovoNome.value)
    );
    cellAcoes.appendChild(downloadButton);
  }
}

async function baixarArquivo(file, novoNome) {
  try {
    const response = await fetch(URL.createObjectURL(file));
    const blob = await response.blob();

    // Criar um link para download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = novoNome;

    // Abrir uma nova janela com o link
    const newWindow = window.open("", "_blank");
    newWindow.document.body.appendChild(downloadLink);
    downloadLink.click();

    // Limpar o link da memória
    setTimeout(() => {
      URL.revokeObjectURL(downloadLink.href);
      newWindow.close();
    }, 100);
  } catch (error) {
    console.error("Erro ao baixar o arquivo:", error);
  }
}

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
