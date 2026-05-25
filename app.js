const URL_SCRIPT =
"https://script.google.com/macros/s/AKfycbxuVYiI_CawQea9B4CSh9v3xStfSR-D3bH-rSLfdyxHXbq5DYzbsRBPeYbCv2IUXQmYDw/exec";

let historicoPedidos = [];

let carrinho = [];

let editandoPedido = null;

function gerarNumeroPedido(){

return Math.floor(
10000 + Math.random() * 90000
);

}

function verificarPagamento(){

let pagamento =
document.getElementById("pagamento").value;

let trocoDiv =
document.getElementById("trocoDiv");

if(pagamento === "Dinheiro"){

trocoDiv.classList.remove("hidden");

}else{

trocoDiv.classList.add("hidden");

document.getElementById("troco").value="";

}

}

function verificarRefri(){

let refri =
document.getElementById("refrigerante").value;

let tipoDiv =
document.getElementById("tipoRefriDiv");

if(refri === "Sim"){

tipoDiv.classList.remove("hidden");

}else{

tipoDiv.classList.add("hidden");

document.getElementById("tipoRefri").value="";

}

}

function pegarDadosFormulario(){

let adicionais = [];

document
.querySelectorAll(".adicional:checked")
.forEach(el=>{

adicionais.push(el.value);

});

return {

tipo:
document.getElementById("arroz").value,

misturas:
document.getElementById("misturas").value,

adicionais,

refrigerante:
document.getElementById("refrigerante").value === "Sim"
? document.getElementById("tipoRefri").value
: "Não",

valor:
parseFloat(
document.getElementById("total").value || 0
)

};

}

function adicionarCarrinho(){

let item = pegarDadosFormulario();

carrinho.push(item);

atualizarCarrinho();

limparCamposPrato();

}

function atualizarCarrinho(){

let div =
document.getElementById("carrinho");

div.innerHTML = "";

let total = 0;

carrinho.forEach((item,index)=>{

total += item.valor;

div.innerHTML += `

<div class="item-carrinho">

<b>
🍱 Quentinha ${index + 1}
</b>

<hr>

<b>${item.tipo}</b><br><br>

${item.misturas}<br><br>

<b>Adicionais:</b><br>
${item.adicionais.length > 0
? item.adicionais.join(", ")
: "Nenhum"
}

<br><br>

<b>Refri:</b>
${item.refrigerante}

<br><br>

<b>
R$ ${item.valor.toFixed(2)}
</b>

<button onclick="removerCarrinho(${index})">
Remover
</button>

</div>

`;

});

document.getElementById(
"totalCarrinho"
).innerHTML = `
TOTAL:
R$ ${total.toFixed(2)}
`;

}

function removerCarrinho(index){

carrinho.splice(index,1);

atualizarCarrinho();

}

async function salvarPedidoGoogle(pedido){

await fetch(URL_SCRIPT,{

method:"POST",

body:JSON.stringify(pedido)

});

}

async function finalizarPedido(){

if(carrinho.length === 0){

alert("Adicione ao menos um pratinho!");
return;

}

let nome =
document.getElementById("nome").value;

let endereco =
document.getElementById("endereco").value;

let pagamento =
document.getElementById("pagamento").value;

let troco =
document.getElementById("troco").value;

let observacao =
document.getElementById("observacao").value;

if(nome === "" || endereco === ""){

alert("Preencha nome e endereço!");
return;

}

let numeroPedido =
gerarNumeroPedido();

let data =
new Date().toLocaleString();

let totalGeral = 0;

carrinho.forEach(item=>{

totalGeral += item.valor;

});

let pedido = {

numero:numeroPedido,
nome,
endereco,
pagamento,
troco,
itens:carrinho,
observacao,
total:totalGeral.toFixed(2),
data

};

historicoPedidos.push(pedido);

await salvarPedidoGoogle(pedido);

atualizarHistorico();

imprimirPedido(pedido);

carrinho=[];

atualizarCarrinho();

limparFormulario();

}

function imprimirPedido(pedido){

let htmlItens = "";

pedido.itens.forEach((item,index)=>{

htmlItens += `

<div class="item-print">

<h3>
🍱 QUENTINHA ${index + 1}
</h3>

<hr>

<p>
<b>Arroz:</b><br>
${item.tipo}
</p>

<p>
<b>Misturas:</b><br>
${item.misturas}
</p>

<p>
<b>Adicionais:</b><br>
${item.adicionais.length > 0
? item.adicionais.join(", ")
: "Nenhum"
}
</p>

<p>
<b>Refrigerante:</b><br>
${item.refrigerante}
</p>

<div class="total">
R$ ${item.valor.toFixed(2)}
</div>

</div>

<hr class="linha-separadora">

`;

});

document.getElementById(
"printArea"
).innerHTML = `

<div class="cupom">

<div class="topo">

<img
src="https://firebasestorage.googleapis.com/v0/b/diarista-online-f269c.appspot.com/o/meu%20pratinho%20(12).png?alt=media&token=6fd58604-2e08-4786-9017-ee065d268453"
class="logo">

<h2>MEU PRATINHO</h2>

<p>
Pedido #${pedido.numero}
</p>

<p>
${pedido.data}
</p>

</div>

<hr>

<p>
<b>Cliente:</b><br>
${pedido.nome}
</p>

<p>
<b>Endereço:</b><br>
${pedido.endereco}
</p>

<p>
<b>Pagamento:</b><br>
${pedido.pagamento}
</p>

${pedido.pagamento === "Dinheiro"
? `
<p>
<b>Troco para:</b><br>
R$ ${pedido.troco}
</p>
`
: ""
}

<hr>

${htmlItens}

<h3>
📝 Observação
</h3>

<p>
${pedido.observacao || "Sem observações"}
</p>

<hr>

<div class="total">
TOTAL GERAL<br>
R$ ${pedido.total}
</div>

<p class="rodape">
❤️ Obrigado pela preferência
<br>
Genesis Apps
</p>

</div>
`;

setTimeout(()=>{

window.print();

},300);

}

function atualizarHistorico(){

let lista =
document.getElementById("listaPedidos");

lista.innerHTML="";

historicoPedidos.forEach((pedido,index)=>{

lista.innerHTML += `

<div
class="item-historico"
onclick="abrirPedido(${index})"
>

<b>
#${pedido.numero}
</b>

- ${pedido.nome}

- R$ ${pedido.total}

<br>

<small>
${pedido.data}
</small>

</div>

`;

});

}

function abrirPedido(index){

let pedido =
historicoPedidos[index];

let opcao =
prompt(
"Digite:\n1 = Reimprimir\n2 = Editar"
);

if(opcao == "1"){

imprimirPedido(pedido);

}

if(opcao == "2"){

editarPedido(index);

}

}

function editarPedido(index){

let pedido =
historicoPedidos[index];

document.getElementById("nome").value =
pedido.nome;

document.getElementById("endereco").value =
pedido.endereco;

document.getElementById("pagamento").value =
pedido.pagamento;

document.getElementById("troco").value =
pedido.troco;

document.getElementById("observacao").value =
pedido.observacao;

carrinho = pedido.itens;

atualizarCarrinho();

editandoPedido = index;

}

function salvarHistorico(){

let texto =
JSON.stringify(
historicoPedidos,
null,
2
);

let blob =
new Blob([texto],{
type:"text/plain"
});

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"historico.txt";

link.click();

}

function imprimirHistorico(){

let total = 0;

let html = `
<div class="cupom">
<h2>Histórico</h2>
<hr>
`;

historicoPedidos.forEach(p=>{

total += parseFloat(p.total);

html += `

<p>
<b>
Pedido #${p.numero}
</b>
</p>

<p>
${p.nome}
</p>

<p>
R$ ${p.total}
</p>

<hr>

`;

});

html += `
<h2>
TOTAL:
R$ ${total.toFixed(2)}
</h2>
</div>
`;

document.getElementById(
"printArea"
).innerHTML = html;

window.print();

}

function limparHistorico(){

historicoPedidos=[];

atualizarHistorico();

}

function limparFormulario(){

document.getElementById("nome").value="";
document.getElementById("endereco").value="";
document.getElementById("troco").value="";
document.getElementById("observacao").value="";

limparCamposPrato();

}

function limparCamposPrato(){

document.getElementById("misturas").value="";
document.getElementById("total").value="";
document.getElementById("tipoRefri").value="";

document
.querySelectorAll(".adicional")
.forEach(el=>{

el.checked=false;

});

}
