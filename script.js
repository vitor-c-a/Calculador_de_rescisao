/*Constantes de entradas >>>>>*/
const form = document.querySelector("form");

const inSalarioBruto = document.querySelector("#inSalarioBruto");
const inDataAdmissao = document.querySelector("#inDataAdmissao");
const inDependentes = document.querySelector("#inDependentes");

const inDataDesligamento = document.querySelector("#inDataDesligamento");

const inFormaDesligamento = document.querySelector("#inFormaDesligamento");
const inAvisoPrevio = document.querySelector("#inAvisoPrevio");
const inFerias = document.querySelector('input[name="inFerias"]:checked');

/*Constantes de saida >>>>>*/
const outVerbas = document.querySelector("#outVerbas");
const outDescontos = document.querySelector("#outDescontos");
const outTotal = document.querySelector("#outTotal");

const outDiaSalario = document.querySelector("#outDiaSalario");
const outSalario = document.querySelector("#outSalario");

const outMesesFeriasProp = document.querySelector("#outMesesFeriasProp");
const outFeriasProp = document.querySelector("#outFeriasProp");
const outFeriasVencida = document.querySelector("#outFeriasVencida");

const outMesesDecimo = document.querySelector("#outMesesDecimo");
const outDecimoProp = document.querySelector("#outDecimoProp");

const outAvisoPrevio = document.querySelector("#outAvisoPrevio");

const outTotalRescisorios = document.querySelector("#outTotalRescisorios");

const outInss = document.querySelector("#outInss");
const outInss13 = document.querySelector("#outInss13");
const outIrrf = document.querySelector("#outIrrf");
const outTotalDescontos = document.querySelector("#outTotalDescontos");

const outMesesFgts = document.querySelector("#outMesesFgts");
const outDepositosFgts = document.querySelector("#outDepositosFgts");
const outFgtsSalario = document.querySelector("#outFgtsSalario");
const outFgtsProp = document.querySelector("#outFgtsProp");
const outMulta40 = document.querySelector("#outMulta40");
const outTotalFgts = document.querySelector("#outTotalFgts");

const entradas = [
  inSalarioBruto,
  inDataAdmissao,
  inDataDesligamento,
  inFormaDesligamento,
  inAvisoPrevio,
];

function validarEntradas() {
  const entradasVazias = entradas.filter(
    (entrada) => !entrada.value || entrada.value.trim() === "",
  );

  const msgErro = document.querySelector(".msgErro");

  if (entradasVazias.length > 0) {
    entradasVazias.forEach((input) => input.classList.add("erro"));
    msgErro.style.display = "inline";
    return false;
  }

  msgErro.style.display = "none";
  return true;
}

function validarDatas() {
  const [adAno, adMes, adDia] = inDataAdmissao.value.split("-");
  const [desAno, desMes, desDia] = inDataDesligamento.value.split("-");

  let dataAdmissao = new Date(adAno, adMes - 1, adDia);
  dataAdmissao.setHours(0, 0, 0, 0);

  let dataDesligamento = new Date(desAno, desMes - 1, desDia);
  dataDesligamento.setHours(0, 0, 0, 0);

  if (dataAdmissao > dataDesligamento) {
    document.querySelector("#modalErro").showModal();
    return false
  }

  return true
}

entradas.forEach((input) => {
  //Faz com que as bordas em vermleho suma se o campo estiver preenchido
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.remove("erro");
    }
  });
});


form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validarEntradas()) {
    return;
  }

  if(!validarDatas()){
    return
  }

});



  

  