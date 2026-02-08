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
    return false;
  }

  return true;
}

function calcularBaseProporcional() { // AJUSTAR ESSA FUNÇÃO TEM ALGUMAS COISAS PARA RESOLVER
  let proporcional = 0;

  const salarioBruto = inSalarioBruto.value;

  const [adAno, adMes, adDia] = inDataAdmissao.value.split("-");
  const [desAno, desMes, desDia] = inDataDesligamento.value.split("-");

  let dataAdmissao = new Date(adAno, adMes - 1, adDia);
  dataAdmissao.setHours(0, 0, 0, 0);

  let dataDesligamento = new Date(desAno, desMes - 1, desDia);
  dataDesligamento.setHours(0, 0, 0, 0);

  if (adMes == desMes && adAno == desAno) {
    //Caso o mês e ano de admissão e demissão seja o mesmo, precisamos validar se houve 15 dias de trabalho, para saber se irá ter um mês de 13º proporcional
    if (desDia - adDia + 1 >= 15) {
      proporcional = (salarioBruto / 12) * 1;
    }
  }

  if (adAno < desAno) {
    //Se a pessoa não entrou no ano de desligamento
    if (desDia >= 15) {
      proporcional = (salarioBruto / 12) * desMes;
    } else {
      proporcional = (salarioBruto / 12) * (desMes - 1);
    }
  } else {

    //Caso o ano de desligamento seja o mesmo de admissão
    let meseValidos = 0;
    if (adDia <= 15) {
      meseValidos += 1;
    }

    if (desDia >= 15) {
        proporcional = (salarioBruto / 12) * (desMes - adMes + meseValidos);
    } else {
      if (meseValidos < 1) {
        proporcional = (salarioBruto / 12) * (desMes - adMes - 1);
      } else {
        proporcional = (salarioBruto / 12) * (desMes - adMes);
      }
    }
  }
  return proporcional
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

  if (!validarDatas()) {
    return;
  }
  console.log(calcularBaseProporcional())

  let verbasRescisorias = 0;
  let descontos = 0;
  let resultadoTotal = 0;

  if(inFormaDesligamento.value !== "comJustaCausa"){
    verbasRescisorias += calcularBaseProporcional()
  }
  

});
