const form = document.querySelector("form");

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



form.addEventListener("submit", (e) => {

  e.preventDefault();
        /*Entradas >>>>>*/

  const inSalarioBruto = document.querySelector("#inSalarioBruto");
  const inDataAdmissao = document.querySelector("#inDataAdmissao");
  const inDependentes = document.querySelector("#inDependentes");
  
  const inDataDesligamento = document.querySelector("#inDataDesligamento");
  const inFormaDesligamento = document.querySelector("#inFormaDesligamento");
  const inAvisoPrevio = document.querySelector("#inAvisoPrevio");
  const inFerias = document.querySelector('input[name="inFerias"]:checked');

  const entradas = [

    inSalarioBruto,
    inDataAdmissao,
    inDependentes,
    inDataDesligamento,
    inFormaDesligamento,
    inAvisoPrevio,
  ];
  const verificandoEntradas = entradas.every(entrada => entrada.value !== "");
  

  
});
