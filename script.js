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

const outSalario = document.querySelector("#outSalario");

const outFerias = document.querySelector("#outFerias");

const outDecimoProp = document.querySelector("#outDecimoProp");

const outAvisoPrevio = document.querySelector("#outAvisoPrevio");
const outAvisoPrevioDesconto = document.querySelector("#outAvisoPrevioDesconto");

const outTotalReceber = document.querySelector("#outTotalReceber");

const outInss = document.querySelector("#outInss");
const outInss13 = document.querySelector("#outInss13");
const outIrrf = document.querySelector("#outIrrf");
const outTotalDescontos = document.querySelector("#outTotalDescontos");

const outDepositosFgts = document.querySelector("#outDepositosFgts");
const outFgtsProp = document.querySelector("#outFgtsProp");
const outMulta = document.querySelector("#outMulta");
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

function moedaBR(valor) { //Formtar os resultados em moeda pt-br
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);
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

function calcularFerias() {
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

  if (
    formaDesligamento === "comJustaCausa" || 
    formaDesligamento === "tempoDeterminado" || 
    avisoPrevio === "dispensando" || 
    avisoPrevio === "naoSeAplica"
  ) {
    return 0;
  }

  if (formaDesligamento === "acordoMutuo") {
    return avisoPrevio === "trabalhado" ? salarioBruto : salarioBruto / 2;
  }

  if (avisoPrevio === "trabalhado" || avisoPrevio === "indenizado" || avisoPrevio === "descontado") {
    return salarioBruto;
  }

  return 0;
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

function fgtsDepositado() {
    const salario = Number(inSalarioBruto.value);
    const adm = new Date(inDataAdmissao.value);
    const des = new Date(inDataDesligamento.value);

    const ALIQUOTA = 0.08;
    const TAXA_MENSAL = 0.0025;

    let saldo = 0;

    function diasNoMes(data) {
        return new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
    }

    function aplicarMes(deposito) { //Acrescimemo mensal de rendimento do FGTS
        saldo *= (1 + TAXA_MENSAL); // rendimento do saldo acumulado
        saldo += deposito;          // depósito do mês
    }

    // Adm e Des no mesmo mês e ano
    if (
        adm.getFullYear() === des.getFullYear() &&
        adm.getMonth() === des.getMonth()
    ) {
        const diasMes = diasNoMes(adm);
        const diasTrabalhados = des.getDate() - adm.getDate() + 1;
        const fgtsMes = (salario / diasMes) * diasTrabalhados * ALIQUOTA;

        aplicarMes(fgtsMes);
        return saldo;
    }

    // primeiro mês (proporcional)
    const diasMesAdm = diasNoMes(adm);
    const diasTrabalhadosAdm = diasMesAdm - adm.getDate() + 1;
    const fgtsMesAdm = (salario / diasMesAdm) * diasTrabalhadosAdm * ALIQUOTA;

    aplicarMes(fgtsMesAdm);

    // meses completos
    let cursor = new Date(adm.getFullYear(), adm.getMonth() + 1, 1);

    while (
        cursor.getFullYear() < des.getFullYear() ||
        (cursor.getFullYear() === des.getFullYear() && cursor.getMonth() < des.getMonth())
    ) {
        const fgtsMesCheio = salario * ALIQUOTA;
        aplicarMes(fgtsMesCheio);
        cursor.setMonth(cursor.getMonth() + 1);
    }

    // último mês (proporcional)
    const diasMesDes = diasNoMes(des);
    const diasTrabalhadosDes = des.getDate();
    const fgtsMesDes = (salario / diasMesDes) * diasTrabalhadosDes * ALIQUOTA;

    aplicarMes(fgtsMesDes);

    return saldo;
}

function fgtsDecimoTerceiro(){
  const formaDesligamento = inFormaDesligamento.value;
  let fgtsDecimoTerceiro = 0;

  if(formaDesligamento === "comJustaCausa"){
    return fgtsDecimoTerceiro
  } else{
    fgtsDecimoTerceiro += calcularBaseProporcional() * 0.08
    return fgtsDecimoTerceiro
  }
}

function multaFgts(){
  const formaDesligamento = inFormaDesligamento.value;
  let multaFgts = 0

  if(formaDesligamento === "semJustaCausa" || formaDesligamento === "rescisaoIndireta"){
    multaFgts += fgtsDepositado() * 0.4;
    return multaFgts

  } else if(formaDesligamento === "acordoMutuo"){
    multaFgts += fgtsDepositado() * 0.2;
    return multaFgts

  } else {
    return multaFgts
  }
}

              //funções para calcular os totais dos calculos
function calcularVerbasRescisorias(){
  let verbasRescisorias = 0;

  verbasRescisorias += calcularFerias();
  verbasRescisorias += calcularBaseProporcional(); //Decimo terceiro
  if(inAvisoPrevio.value === "descontado"){
    verbasRescisorias -= calcularAviso();
  }
  

  return verbasRescisorias;
}

function calcularDescontos(){
  let descontos = 0;

  descontos += calcularInss();
  descontos += calcularInssDecimoTerceiro();
  descontos += calcularIrrf();

  return descontos;
}

function calcularValoresFGTS(){
  let fgtsTotal = 0;

  fgtsTotal += fgtsDepositado();
  fgtsTotal += fgtsDecimoTerceiro();
  fgtsTotal += multaFgts();

  return fgtsTotal;
}

function totalReceber(){
  let totalReceber = 0;

  totalReceber += calcularSaldoSalario();
  totalReceber += calcularFerias();
  totalReceber += calcularBaseProporcional();
    if(inAvisoPrevio.value === "descontado"){
    totalReceber -= calcularAviso();
  }
  
  return totalReceber;
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

  if (valorEscolhido === "acordoMutuo"){
    inAvisoPrevio.querySelector('option[value="descontado"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="dispensando"]').disabled = true;
    inAvisoPrevio.querySelector('option[value="naoSeAplica"]').disabled = true;
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

  const quadroResultados = document.querySelector(".Sessao-02-resultado");
  quadroResultados.style.display = "flex"

  outVerbas.innerText = moedaBR(calcularVerbasRescisorias());
  outDescontos.innerText = moedaBR(calcularDescontos())
  outTotal.innerText = moedaBR(calcularVerbasRescisorias() - calcularDescontos())


  outSalario.innerText = moedaBR(calcularSaldoSalario());
  outFerias.innerText = moedaBR(calcularFerias());
  outDecimoProp.innerText = moedaBR(calcularBaseProporcional());

  const valorAviso = calcularAviso();
  const receberAvisoRow = document.querySelector("#receberAviso");
  const descontarAvisoRow = document.querySelector("#descontarAviso");

  if (inAvisoPrevio.value === "descontado") {
    receberAvisoRow.style.display = "none";
    descontarAvisoRow.style.display = "grid";
    
    outAvisoPrevioDesconto.innerText = moedaBR(valorAviso);
    outAvisoPrevio.innerText = moedaBR(0);
  } else {
    descontarAvisoRow.style.display = "none";
    receberAvisoRow.style.display = "grid";

    outAvisoPrevio.innerText = moedaBR(valorAviso);
    outAvisoPrevioDesconto.innerText = moedaBR(0);
  }
  console.log(valorAviso)
  outTotalReceber.innerText = moedaBR(totalReceber());


  outInss.innerText = moedaBR(calcularInss());
  outInss13.innerText = moedaBR(calcularInssDecimoTerceiro());
  outIrrf.innerText = moedaBR(calcularIrrf());
  outTotalDescontos.innerText = moedaBR(calcularDescontos());


  outDepositosFgts.innerText = moedaBR(fgtsDepositado());
  outFgtsProp.innerText = moedaBR(fgtsDecimoTerceiro());
  outMulta.innerText = moedaBR(multaFgts());
  outTotalFgts.innerText = moedaBR(calcularValoresFGTS());
});

form.addEventListener("reset", () => {
  const quadroResultados = document.querySelector(".Sessao-02-resultado");
  quadroResultados.style.display = "none"
});