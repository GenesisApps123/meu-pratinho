const URL_SCRIPT =
"https://script.google.com/macros/s/AKfycbxuVYiI_CawQea9B4CSh9v3xStfSR-D3bH-rSLfdyxHXbq5DYzbsRBPeYbCv2IUXQmYDw/exec";

function gerarNumeroPedido(){

return Math.floor(
10000 + Math.random() * 90000
);

}

async function salvarPedido(pedido){

await fetch(URL_SCRIPT,{

method:"POST",
body:JSON.stringify(pedido)

});

}

async function finalizarPedido(){

let nome =
document.getElementById("nome").value;

let endereco =
document.getElementById("endereco").value;

let pagamento =
document.getElementById("pagamento").value;

let troco =
document.getElementById("troco").value;

let arroz =
document.getElementById("arroz").value;

let misturas =
document.getElementById("misturas").value;

let total =
document.getElementById("total").value;

let observacao =
document.getElementById("observacao").value;

let refri =
document.getElementById("refrigerante").value;

let tipoRefri =
document.getElementById("tipoRefri").value;

if(nome === "" || total === ""){

alert("Preencha nome e total");
return;

}

let adicionais = [];

document
.querySelectorAll(".adicional:checked")
.forEach(el=>{

adicionais.push(el.value);

});

let numeroPedido =
gerarNumeroPedido();

let data =
new Date().toLocaleString();

let pedido = {

numeroPedido,
nome,
endereco,
pagamento,
troco,
arroz,
misturas,
adicionais:
adicionais.join(", "),

refrigerante:
refri === "Sim"
? tipoRefri
: "Não",

total,
observacao,
data

};

await salvarPedido(pedido);

document.getElementById(
"printArea"
).innerHTML = `

<div class="cupom">

<div class="topo">

<h2>MEU PRATINHO</h2>

<p>Pedido #${numeroPedido}</p>

<p>${data}</p>

</div>

<hr>

<p>
<b>Cliente:</b><br>
${nome}
</p>

<p>
<b>Endereço:</b><br>
${endereco}
</p>

<hr>

<p>
<b>Pagamento:</b>
${pagamento}
</p>

<p>
<b>Tipo:</b>
${arroz}
</p>

<p>
<b>Misturas:</b><br>
${misturas}
</p>

<p>
<b>Adicionais:</b><br>
${adicionais.join(", ")}
</p>

<p>
<b>Refrigerante:</b>
${refri === "Sim"
? tipoRefri
: "Não"}
</p>

<hr>

<div class="total">
R$ ${parseFloat(total).toFixed(2)}
</div>

<hr>

<p>
${observacao || ""}
</p>

<p style="text-align:center;">
Genesis Apps
</p>

</div>
`;

setTimeout(()=>{

window.print();

},300);

limparFormulario();

}

function limparFormulario(){

document.getElementById("nome").value="";
document.getElementById("endereco").value="";
document.getElementById("troco").value="";
document.getElementById("misturas").value="";
document.getElementById("total").value="";
document.getElementById("observacao").value="";
document.getElementById("tipoRefri").value="";

document
.querySelectorAll(".adicional")
.forEach(el=>{

el.checked=false;

});

}
