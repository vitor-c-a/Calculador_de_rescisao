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


              //Funções de validação
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


              //Funções para calcular verbas rescisórias

function calcularSaldoSalario(){
  const salarioBruto = Number(inSalarioBruto.value);

  let saldoSalario = 0;
  const [adAno, adMes, adDia] = inDataAdmissao.value.split("-").map(Number);
  const [desAno, desMes, desDia] = inDataDesligamento.value.split("-").map(Number);

  if(adAno === desAno && adMes === desMes){
    const diasTrabalhados = (desDia - adDia) + 1;
    saldoSalario += (salarioBruto / 30) * diasTrabalhados;

    return saldoSalario
  }

  saldoSalario += (salarioBruto / 30) * desDia;

  return saldoSalario
}

function calcularBaseProporcional() {
  let proporcional = 0;

  const salarioBruto = Number(inSalarioBruto.value);

  const [adAno, adMes, adDia] = inDataAdmissao.value.split("-").map(Number);
  const [desAno, desMes, desDia] = inDataDesligamento.value.split("-").map(Number);

  //Cenário se o ano de admissão for anterior ao ano de desligamento
  if (adAno < desAno) {
    if (adDia >= 15) {
      proporcional = (salarioBruto / 12) * desMes;
    } else {
      proporcional = (salarioBruto / 12) * (desMes - 1);
    }
  } else {
    if (adMes === desMes) {
      if (desDia - adDia + 1 >= 15) {
        proporcional = (salarioBruto / 12) * 1;
      }
    } else {
      let mesValido = 0;

      if (adDia <= 15) {
        mesValido += 1;
      }
      let qtdMeses = desMes - adMes;

      if (desDia < 15) {
        qtdMeses = qtdMeses - 1;
      }

      proporcional = (salarioBruto / 12) * (mesValido + qtdMeses);
    }
  }
  return proporcional;
}

function calculoFerias() {
  const salarioBruto = Number(inSalarioBruto.value);
  const feriasVencidas = document.querySelector("input[name='inFeriasVencida']:checked").value;
  let valorFerias = 0;

  if (feriasVencidas === "sim") {
    valorFerias += salarioBruto + salarioBruto / 3;
  }

  if (inFormaDesligamento.value !== "comJustaCausa") {
    const baseProporcional = calcularBaseProporcional();
    valorFerias += baseProporcional + (baseProporcional / 3);
  }

  return valorFerias;
}

function calcularAviso() {
  const salarioBruto = Number(inSalarioBruto.value);
  const formaDesligamento = inFormaDesligamento.value;
  const avisoPrevio = inAvisoPrevio.value;

  let valorAvisoPrevio = 0
  
  if(formaDesligamento === "comJustaCausa" || formaDesligamento === "tempoDeterminado"){
    return valorAvisoPrevio
  }

  if(formaDesligamento === "acordoMutuo"){
    if(avisoPrevio === "trabalhado"){
      valorAvisoPrevio += salarioBruto
      return valorAvisoPrevio
    } else {
      valorAvisoPrevio += salarioBruto / 2
      return valorAvisoPrevio
    }
  }

  if(avisoPrevio === "trabalhado" || avisoPrevio === "indenizado"){
    valorAvisoPrevio += salarioBruto;
    return valorAvisoPrevio
  }

  if(avisoPrevio === "dispensando" || avisoPrevio === "naoSeAplica"){
    return valorAvisoPrevio
  }

  if(avisoPrevio === "descontado"){
    valorAvisoPrevio += - salarioBruto;
    return valorAvisoPrevio
  }
}

              //Funções para calcular descontos

function calcularInss(){
  const TETO_INSS = 8475.55;
  const salarioBruto = Number(inSalarioBruto.value);
  const salario = Math.min(salarioBruto, TETO_INSS);
    
    const faixas = [
        { limite: 1621.00, aliquota: 0.075 },
        { limite: 2902.84, aliquota: 0.09 },
        { limite: 4354.27, aliquota: 0.12 },
        { limite: 8475.55, aliquota: 0.14 }
    ];

    let totalDesconto = 0;
    let limiteAnterior = 0;

    for (const faixa of faixas) {
        if (salario > limiteAnterior) {
            const baseCalculoFaixa = Math.min(salario, faixa.limite) - limiteAnterior;
            totalDesconto += baseCalculoFaixa * faixa.aliquota;
            limiteAnterior = faixa.limite;
        } else {
            break;
        }
    }

    return totalDesconto;
}

function calcularInssDecimoTerceiro(){
  const TETO_INSS = 8475.55;
  const decimoProporcional = calcularBaseProporcional();
  const decimo = Math.min(decimoProporcional, TETO_INSS);
    
    const faixas = [
        { limite: 1621.00, aliquota: 0.075 },
        { limite: 2902.84, aliquota: 0.09 },
        { limite: 4354.27, aliquota: 0.12 },
        { limite: 8475.55, aliquota: 0.14 }
    ];

    let totalDesconto = 0;
    let limiteAnterior = 0;

    for (const faixa of faixas) {
        if (decimo > limiteAnterior) {
            const baseCalculoFaixa = Math.min(decimo, faixa.limite) - limiteAnterior;
            totalDesconto += baseCalculoFaixa * faixa.aliquota;
            limiteAnterior = faixa.limite;
        } else {
            break;
        }
    }

    return totalDesconto;
}

function calcularIrrf() {
const salarioBruto = Number(inSalarioBruto.value);
const numDependentes = Number(inDependentes.value);
const DESCONTO_DEPENDENTE = 189.59;
const DESCONTO_SIMPLIFICADO_2026 = 607.20; // Valor padrão de 2026

const baseLegal = salarioBruto - calcularInss() - (numDependentes * DESCONTO_DEPENDENTE);

const baseSimplificada = salarioBruto - DESCONTO_SIMPLIFICADO_2026;

const baseCalculo = Math.min(baseLegal, baseSimplificada);

const faixas = [
    { limite: 2824.00, aliquota: 0, deducao: 0 },
    { limite: 3751.05, aliquota: 0.075, deducao: 211.80 },
    { limite: 4664.68, aliquota: 0.15, deducao: 493.13 },
    { limite: 5839.45, aliquota: 0.225, deducao: 842.98 },
    { limite: Infinity, aliquota: 0.275, deducao: 1134.95 }
];

let faixa = faixas.find(f => baseCalculo <= f.limite);

const imposto = (baseCalculo * faixa.aliquota) - faixa.deducao;
return imposto > 0 ? parseFloat(imposto.toFixed(2)) : 0;
}

              //Funções para calcular verbas do FGTS

function fgtsDepositado(){     //PARAMOS AQUI >>>>>>>>>>>>>>>>>>>>

}



              //Interatividade em tempo real com o formulário
entradas.forEach((input) => {
  //Faz com que as bordas em vermleho suma se o campo estiver preenchido
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.remove("erro");
    }
  });
});

inFormaDesligamento.addEventListener("change", () => {
  //Bloqueia algumas opções de aviso prévio dependendo da forma de rescisão
  const valorEscolhido = inFormaDesligamento.value;

  for (let i = 0; i < inAvisoPrevio.options.length; i++) {
    inAvisoPrevio.options[i].disabled = false;
  }

  if (valorEscolhido === "comJustaCausa" || valorEscolhido === "tempoDeterminado") {
    inAvisoPrevio.querySelector('option[value="trabalhado"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="indenizado"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="descontado"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="dispensando"]').disabled = true;

    inAvisoPrevio.value = "naoSeAplica";
  }

  if (valorEscolhido === "rescisaoIndireta"){
    inAvisoPrevio.querySelector('option[value="trabalhado"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="descontado"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="dispensando"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="naoSeAplica"]').disabled = true;

    inAvisoPrevio.value = "indenizado";
  }

});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validarEntradas()) {
    return;
  }

  if (!validarDatas()) {
    return;
  }

  let verbasRescisorias = 0;
  let descontos = 0;
  let resultadoTotal = 0;
  console.log(calcularInss())
  console.log(calcularIrrf())
});





/*
function calcularVerbasRescisorias() {
  let verbasRescisorias = 0;

  verbasRescisorias += calcularSaldoSalario();

  if(inFormaDesligamento.value !== "comJustaCausa"){
    verbasRescisorias += calcularBaseProporcional()
  }

  verbasRescisorias += calculoFerias();

  verbasRescisorias += calcularAviso();
}
*/