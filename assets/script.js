const baseURL = "http://localhost:3000/frutas";
const msgAlert = document.querySelector(".msg-alert");

async function findAllFrutas() {
  const response = await fetch(`${baseURL}/all-frutas`);

  const frutas = await response.json();

  frutas.forEach(function (fruta) {
    document.querySelector("#frutaList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="FrutaListaItem" id="FrutaListaItem_${fruta._id}">
        <div>
            <div class="FrutaListaItem__nome">${fruta.nome}</div>
            <div class="FrutaListaItem__preco">R$ ${fruta.preco}</div>
            <div class="FrutaListaItem__descricao">${fruta.descricao}</div>

            <div class="FrutaListaItem__acoes Acoes">
              <button class="Acoes__editar btn" onclick="abrirModal('${fruta._id}')">Editar</button> 
              <button class="Acoes__apagar btn" onclick="abrirModalDelete('${fruta._id}')">Apagar</button> 
            </div>
        </div>
        
        <img class="FrutaListaItem__foto" src="${fruta.foto}" alt="Fruta de ${fruta.nome}" />

        
    </div>
    `
    );
  });
}

async function findByIdFrutas() {
  const id = document.querySelector("#idFruta").value;
  if (id == "") {
    localStorage.setItem("message", "Digite um Id para pesquisar!");
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMessageAlert();
    return;
  }

  const response = await fetch(`${baseURL}/one-fruta/${id}`);
  const fruta = await response.json();

  if (fruta.message != undefined) {
    localStorage.setItem("message", fruta.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return;
  }

  const frutaEscolhidaDiv = document.querySelector("#frutaEscolhida");

  frutaEscolhidaDiv.innerHTML = `
  <div class="FrutaCardItem" id="FrutaListaItem_${fruta._id}">
  <div>
      <div class="FrutaCardItem__nome">${fruta.nome}</div>
      <div class="FrutaCardItem__preco">R$ ${fruta.preco}</div>
      <div class="FrutaCardItem__descricao">${fruta.descricao}</div>
      
      <div class="FrutaListaItem__acoes Acoes">
          <button class="Acoes__editar btn" onclick="abrirModal('${fruta._id}')">Editar</button> 
          <button class="Acoes__apagar btn" onclick="abrirModalDelete('${fruta._id}')">Apagar</button> 
      </div>
  </div>
  <img class="FrutaCardItem__foto" src="${fruta.foto}" alt="Fruta de ${fruta.nome}" />
</div>`;
}

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Fruta";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-fruta/${id}`);
    const fruta = await response.json();

    document.querySelector("#nome").value = fruta.nome;
    document.querySelector("#preco").value = fruta.preco;
    document.querySelector("#descricao").value = fruta.descricao;
    document.querySelector("#foto").value = fruta.foto;
    document.querySelector("#id").value = fruta._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Fruta";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#nome").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
  document.querySelector("#preco").value = 0;
}

async function createFruta() {
  const id = document.querySelector("#id").value;
  const nome = document.querySelector("#nome").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const fruta = {
    id,
    nome,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = id != "";

  const endpoint =
    baseURL + (modoEdicaoAtivado ? `/update-fruta/${id}` : `/create-fruta`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(fruta),
  });

  const novaFruta = await response.json();

  
  if (novaFruta.message != undefined) {
    localStorage.setItem("message", novaFruta.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return
  }
  if (modoEdicaoAtivado) {
    localStorage.setItem("message", "Fruta atualizada com sucesso!");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Fruta criada com sucesso!");
    localStorage.setItem("type", "success");
  }
  document.location.reload(true);
  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes");

  btnSim.addEventListener("click", function () {
    deleteFruta(id);
  });
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteFruta(id) {
  const response = await fetch(`${baseURL}/delete-fruta/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();
  localStorage.setItem("message",result.message);
  localStorage.setItem("type", "success");
  document.location.reload(true);

  fecharModalDelete();
}

function closeMessageAlert() {
  setTimeout(() => {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();
findAllFrutas();
