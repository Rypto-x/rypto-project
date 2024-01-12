import contractABI from "./assets/abi/abi.json" assert {type:"json"};

/* Contract Info */
const contractAddress = '0xfF9378b0F64E15154437BFb5b63598ab30fF4cbc'; 
const tokenSymbol = "RYPX";
const tokenDecimals = 18;
const tokenImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_E-DV13mK-KaW5RRuTZwiCzsqjStGeMTBzA&usqp=CAU";

let userAddress = '';
let contract;

async function addTokenMetamask(){
  try{
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: contractAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image:tokenImage
        },
      },
    });
    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("RPYX was not added :(");
    }
  }catch(error){
    console.log(error);
  }
}

document.getElementById("addTokenMetamask").addEventListener('click', (e) => {
  e.preventDefault();
  if (window.ethereum) {
  addTokenMetamask();
  } else {
    alert("Install Metamask!");
  }
});
// Función que se llama cuando se hace clic en el botón de inicio de sesión
async function loginWithMetaMask(event) {
  event.preventDefault();
  try {
    // Verificar si MetaMask está instalado
    if (window.ethereum) {

      const web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      userAddress = accounts[0];
      contract = new web3.eth.Contract(contractABI, contractAddress);

      console.log("Conectado con MetaMask. Dirección de la cuenta:", userAddress);
      
      updateLoginNavItem(userAddress);
      updateLoginWithMetamask(userAddress);
      refreshWeb3PageData(); 

    } else {
      console.error("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión con MetaMask:", error);
  }
}

if (window.ethereum) {
  // Usa la instancia de Web3 proporcionada por MetaMask
  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(contractABI, contractAddress);

  // Verifica si hay cuentas conectadas
  web3.eth.getAccounts()
    .then(function(accounts) {
      if (accounts.length > 0) {
        // Si hay cuentas, toma la primera cuenta para actualizar los datos
        userAddress = accounts[0];
        console.log("Conectado con MetaMask. Dirección de la cuenta:", userAddress);

        updateLoginNavItem(userAddress);
        updateLoginWithMetamask(userAddress);
        refreshWeb3PageData();
      } else {
        console.log("No hay cuentas conectadas. Esperando autorización del usuario...");
        userAddress = '';
      }
    })
    .catch(function(error) {
      console.error("Error al obtener cuentas conectadas:", error);
    });
} else {
  console.error("MetaMask is not installed. Please install it to continue.");
}

function updateLoginNavItem(userAddress) {
  const loginNavItem = document.getElementById('loginNavItem');
  if (userAddress != ''){
    const truncatedAddress = userAddress.substring(0, 7) + '...';
    loginNavItem.innerHTML = `<a href="#">Logged: ${truncatedAddress}</a>`;
  } else {
    loginNavItem.innerHTML = `<a href="#" id="loginButton">Loggin</a>`;
  }
}

function updateLoginWithMetamask(userAddress){
  const loginNavItem = document.getElementById('loginMetamaskContainer');
  if (userAddress != ''){
    const truncatedAddress = userAddress.substring(0, 7) + '...';
    loginNavItem.innerHTML = `<a href="#" style="color:green;" class="special">Logged: ${truncatedAddress}</a>`;
  } else {
    loginNavItem.innerHTML = `<a href="#" style="color:white;" class="special" id="loginWithMetamask" >Login With Metamask</a>`;
  }
}


async function refreshWeb3PageData() {
  try {
    updateTokenPrice();
    updateTotalSupply();
    getOperationalWindowStatus();
    getContractBalance();
    updatePurchaseRequests();
    updateWithdrawalRequests();
    getLatestEvents();
    getUserBalance();
  } catch (error) {
    console.error('Error updating page values with web3:', error);
  }
}

// Manejar cambios de cuenta
if (window.ethereum) {
  ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length > 0) {
      const newAccount = accounts[0];
      console.log(`Cuenta cambiada a: ${newAccount}`);
      userAddress = newAccount;
      updateLoginNavItem(userAddress);
      updateLoginWithMetamask(userAddress);
      refreshWeb3PageData();
    } else {
      console.log('Usuario desconectado');
      userAddress = '';
      updateLoginNavItem(userAddress);
      updateLoginWithMetamask(userAddress);
      document.getElementById('loginButton').addEventListener('click', loginWithMetaMask);
      document.getElementById('loginWithMetamask').addEventListener('click', loginWithMetaMask);
    }
  });
}

// Asociar la función con el evento click del botón
document.getElementById('loginButton').addEventListener('click', loginWithMetaMask);
document.getElementById('loginWithMetamask').addEventListener('click', loginWithMetaMask);

function updateTokenPrice() {
  // Llamar a la función getTokenPrice del contrato
  contract.methods
    .getTokenPrice()
    .call()
    .then((resultInWei) => {
      // Convertir de Wei a Ether
      const resultInEther = window.web3.utils.fromWei(resultInWei, 'ether');

      // Formatear el número para mostrar al menos 3 dígitos después de la coma
      const formattedResult = parseFloat(resultInEther).toFixed(3);

      // Actualizar el elemento HTML con el nuevo precio
      document.getElementById("currentPrice").innerText = formattedResult + " MATIC";
    })
    .catch((error) => {
      console.error('Error al llamar a la función:', error);
    });
}

function updateTotalSupply() {
  contract.methods
    .totalSupply()
    .call()
    .then((resultInWei) => {
      // Convertir de Wei a Ether
      const resultInEther = window.web3.utils.fromWei(resultInWei, 'ether');

      // Formatear el número para mostrar al menos 5 dígitos después de la coma
      const formattedResult = parseFloat(resultInEther).toFixed(3);

      document.getElementById("totalCoinsEmitted").innerText = formattedResult + " RYPX";
    })
    .catch((error) => {
      console.error('Error al llamar a la función totalSupply:', error);
    });
}

function getContractBalance() {
  contract.methods
    .getContractBalance()
    .call()
    .then((resultInWei) => {
      // Convert from Wei to Ether
      const resultInEther = window.web3.utils.fromWei(resultInWei, 'ether');

      // Format the number to display at least 5 digits after the decimal point
      const formattedResult = parseFloat(resultInEther).toFixed(3);

      document.getElementById("contractBalance").innerText = formattedResult + " MATIC";
    })
    .catch((error) => {
      console.error('Error calling the function:', error);
    });
}

function getUserBalance() {
  if (userAddress!= ""){
  contract.methods
  .balanceOf(userAddress)
  .call({ from: userAddress })
  .then((resultInWei) => {
      // Convertir de Wei a Ether
      const resultInEther = window.web3.utils.fromWei(resultInWei, 'ether');

      // Formatear el número para mostrar al menos 5 dígitos después de la coma
      const formattedResult = parseFloat(resultInEther).toFixed(3);

      document.getElementById("balance").innerText = formattedResult + " RYPX";
  })
  .catch((error) => {
      console.error('Error al llamar a la función:', error);
  });
}
}


document.addEventListener('DOMContentLoaded', async () => {
  if (window.ethereum) {
    refreshWeb3PageData();
    document.getElementById("contractAddress").innerText = contractAddress;
  }
});

/*
document.addEventListener('DOMContentLoaded', async () => {



    // active account 
    // document.getElementById("account").innerText = userAddress;

    contract.methods
    .balanceOf(userAddress)
    .call({ from: userAddress })
    .then((resultInWei) => {
        // Convertir de Wei a Ether
        const resultInEther = window.web3.utils.fromWei(resultInWei, 'ether');

        // Formatear el número para mostrar al menos 5 dígitos después de la coma
        const formattedResult = parseFloat(resultInEther).toFixed(3);

        document.getElementById("balance").innerText = formattedResult + " RYPX";
    })
    .catch((error) => {
        console.error('Error al llamar a la función:', error);
    });


    // Rypto -x Contract Balance
    contract.methods
    .getContractBalance()
    .call({ from: userAddress })
    .then((resultInWei) => {
        // Convertir de Wei a Ether
        const resultInEther = window.web3.utils.fromWei(resultInWei, 'ether');

        // Formatear el número para mostrar al menos 5 dígitos después de la coma
        const formattedResult = parseFloat(resultInEther).toFixed(3);

        document.getElementById("contractBalance").innerText = formattedResult + " MATIC";
    })
    .catch((error) => {
        console.error('Error al llamar a la función:', error);
    });


    //updatePurchaseRequests();
    //updateWithdrawalRequests();
    getLatestEvents();  
    getAndRenderPriceData();


});
*/
async function getOperationalWindowStatus() {
  try {
    // Llamada a la función en el contrato
    const status = await contract.methods.getOperationalWindowStatus().call();
    document.getElementById("getOperationalWindow").innerText = status;
  } catch (error) {
    console.error("Error fetching Operational Window Status:", error);
  }
}

async function updatePurchaseRequests() {

    const purchaseRequestsTable = document.getElementById('purchaseRequestsTable');
    const tbody = purchaseRequestsTable.querySelector('tbody');
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
  
    try {
      const purchaseRequestDetails = await contract.methods.getPurchaseRequesters().call();

      // Para cada solicitud de compra, agrega una fila a la tabla
      purchaseRequestDetails.forEach((requestDetail) => {
        const { buyer, amount } = requestDetail;
        const amountInEth = window.web3.utils.fromWei(amount.toString(), 'ether');
        // Formatear el valor a tres dígitos después de la coma
        const formattedAmount = parseFloat(amountInEth).toFixed(5);
        const row = tbody.insertRow();
        const cellAddress = row.insertCell(0);
        const cellAmount = row.insertCell(1);
        const cellCancel = row.insertCell(2);
    
        cellAddress.innerHTML = `${buyer}`;
        cellAmount.innerHTML = `${formattedAmount}`;

        const cancelButton = document.createElement('a');
        cancelButton.href = '#';
        cancelButton.classList.add('button', 'small', 'fit');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', (e) => {
          e.preventDefault();
          cancelPurchase(buyer)
        });
        cellCancel.appendChild(cancelButton);
      });
    } catch (error) {
      // Manejar el error si la solicitud de compra falla
      if (error.message.includes("The Operational Window is currently closed. Please wait for the server to activate it again")) {
        // Muestra una alerta indicando que el Operational Window está cerrado
        alert("El Operational Window está actualmente cerrado. Espera a que el servidor lo active nuevamente.");
      } else {
        // Manejar otros errores
        console.error('Error requesting purchase:', error);
      }
    }
}

async function updateWithdrawalRequests() {
    const withdrawalRequestsTable = document.getElementById('withdrawalRequestsTable');
    const tbody = withdrawalRequestsTable.querySelector('tbody');
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
  
    // Obtén la lista de solicitudes de retiro desde el contrato
    const withdrawalRequestDetails = await contract.methods.getWithdrawalRequesters().call();
  
    // Para cada solicitud de retiro, agrega una fila a la tabla
    withdrawalRequestDetails.forEach((requestDetail) => {
      const { owner, amount } = requestDetail;
      const amountInEth = window.web3.utils.fromWei(amount.toString(), 'ether');
        // Formatear el valor a tres dígitos después de la coma
        const formattedAmount = parseFloat(amountInEth).toFixed(5);
      const row = tbody.insertRow();
      const cellAddress = row.insertCell(0);
      const cellAmount = row.insertCell(1);
      const cellCancel = row.insertCell(2);
  
      cellAddress.innerHTML = `${owner}`;
      cellAmount.innerHTML = `${formattedAmount}`;
  
      const cancelButton = document.createElement('a');
      cancelButton.href = '#';
      cancelButton.classList.add('button', 'small', 'fit');
      cancelButton.textContent = 'Cancel';
      cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        cancelWithdrawal()
      });
      cellCancel.appendChild(cancelButton);
    });
}

document.getElementById("requestPurchase").addEventListener('click', (e) => {
  e.preventDefault();
  requestPurchase()
});

function requestPurchase() {
  if (userAddress != ""){
      
      const purchaseAmountInput = document.getElementById('purchaseAmount');
      const amount = purchaseAmountInput.value.trim();
      const gasLimit = 300000;  
      const gasPrice = 1000000000; 
    
      // Validación simple para asegurarse de que la cantidad sea un número positivo
      if (!amount ||  isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Please enter a valid positive number for the purchase amount.');
        return;
      }
    
    
      // Lógica para realizar la solicitud de compra llamando al método requestPurchase en el contrato
      const weiAmount = window.web3.utils.toWei(amount, 'ether'); // Convertir la cantidad a Wei
      contract.methods.requestPurchase().send({ from: userAddress, value: weiAmount,gas: gasLimit,gasPrice: gasPrice })
        .on('transactionHash', (hash) => {
          console.log('Transaction Hash:', hash);
          // Puedes realizar acciones adicionales cuando se confirma la transacción
        })
        .on('receipt', (receipt) => {
          console.log('Transaction Receipt:', receipt);
          // Puedes realizar acciones adicionales cuando se recibe el recibo de la transacción
          updatePurchaseRequests(); // Actualizar la tabla de solicitudes después de una compra exitosa
        })
        .on('error', (error) => {
          // Verificar si el error indica que el Operational Window está cerrado
          if (error.message.includes("Operational window is currently closed")) {
            // Muestra una alerta indicando que el Operational Window está cerrado
            alert("The Operational Window is currently closed. Please wait for the server to activate it again");
          }else {
            // Manejar otros errores
            console.error('Error requesting purchase:', error);
          }
        });
    } else {
      alert("Please link your account");
    }
}

function cancelPurchase() {
    if(userAddress != ""){
    // Lógica para cancelar la compra llamando al método cancelPurchase en el contrato
    contract.methods.cancelPurchase().send({ from: userAddress })
    .on('transactionHash', (hash) => {
        console.log('Transaction Hash:', hash);
        // Puedes realizar acciones adicionales cuando se confirma la transacción
    })
    .on('receipt', (receipt) => {
        console.log('Transaction Receipt:', receipt);
        // Puedes realizar acciones adicionales cuando se recibe el recibo de la transacción
        updatePurchaseRequests(); // Actualizar la tabla de solicitudes después de la cancelación exitosa
    })
    .on('error', (error) => {
        console.error('Error canceling purchase:', error);
    });
  }else {
    alert("Please link your account");
  }
}
  
function cancelWithdrawal() {
  if(userAddress != ""){
  // Lógica para cancelar la compra llamando al método cancelPurchase en el contrato
  contract.methods.cancelWithdrawal().send({ from: userAddress })
  .on('transactionHash', (hash) => {
      console.log('Transaction Hash:', hash);
      // Puedes realizar acciones adicionales cuando se confirma la transacción
  })
  .on('receipt', (receipt) => {
      console.log('Transaction Receipt:', receipt);
      // Puedes realizar acciones adicionales cuando se recibe el recibo de la transacción
      updateWithdrawalRequests(); // Actualizar la tabla de solicitudes después de la cancelación exitosa
  })
  .on('error', (error) => {
      console.error('Error canceling purchase:', error);
  });
  }else {
    alert("Please link your account");
  }
}

document.getElementById("requestWithdrawal").addEventListener('click', (e) => {
  e.preventDefault();
  requestWithdrawal()
});

function requestWithdrawal() {
  if (userAddress != ""){
    const withdrawalAmountInput = document.getElementById('withdrawalAmount');
    const amount = withdrawalAmountInput.value;
    const gasLimit = 300000;  
    const gasPrice = 1000000000; 

    // Validación simple para asegurarse de que la cantidad sea un número positivo
    if (isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Please enter a valid positive number for the withdrawal amount.');
        return;
    }

    // Lógica para realizar la solicitud de retiro llamando al método requestWithdrawal en el contrato
    const weiAmount = window.web3.utils.toWei(amount, 'ether'); // Convertir la cantidad a Wei
    contract.methods.requestWithdrawal(weiAmount).send({ from: userAddress, gas: gasLimit,gasPrice: gasPrice })
        .on('transactionHash', (hash) => {
        console.log('Transaction Hash:', hash);
        // Puedes realizar acciones adicionales cuando se confirma la transacción
        })
        .on('receipt', (receipt) => {
        console.log('Transaction Receipt:', receipt);
        // Puedes realizar acciones adicionales cuando se recibe el recibo de la transacción
        updateWithdrawalRequests(); // Actualizar la tabla de solicitudes de retiro después de una solicitud exitosa
        })
        .on('error', (error) => {
        console.error('Error requesting withdrawal:', error);
        });
  } else {
    alert("Please link your account");
  }
}
  
async function getAndRenderPriceData() {
  try {
    // Obtener los últimos eventos 'TokenPriceUpdated' (al menos los últimos 100)
    const events = await contract.getPastEvents('TokenPriceUpdated', {
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    // Extraer solo los precios de los eventos
    const prices = events.map(event => event.returnValues.newPrice);

    // Calcular la evolución relativa dividiendo cada precio por el primero
    const relativePrices = prices.map((price, index) => price / prices[0]);

    // Obtener el contexto del gráfico
    const ctx = document.getElementById('priceChart').getContext('2d');

    // Crear el gráfico
    const priceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: relativePrices.length }, (_, i) => i + 1),
        datasets: [{
          label: 'Relative Token Prices',
          data: relativePrices,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false,
        }],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Event Index',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Relative Token Price',
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error retrieving and rendering price data:', error);
  }
}

async function getLatestEvents() {
    try {
      console.log("events!")
      // Obtener el número de bloque más reciente
      const latestBlockNumber = await web3.eth.getBlockNumber();
      console.log(latestBlockNumber);
      // Obtener los últimos 10 eventos desde el bloque más reciente
      const events = await contract.getPastEvents('allEvents', {
        fromBlock: latestBlockNumber - 200, // Desde los últimos 10 bloques
        toBlock: 'latest', // Hasta el bloque más reciente
      });
      events.reverse();
      displayEvents(events);
      // Aquí puedes manejar los eventos recuperados
    } catch (error) {
      console.error('Error retrieving events:', error);
    }
}
  
  async function displayEvents(events) {
    console.log(events)
    const eventLog = document.getElementById('eventLog');
  
    // Limpiar el contenido actual del elemento eventLog
    eventLog.innerHTML = '';
  
    // Para cada evento, crear un elemento de párrafo y agregarlo al eventLog
    events.forEach((event) => {
      const eventElement = document.createElement('p');
      if (event.event == "PurchaseRequested"){
        eventElement.textContent = `Event: ${event.event}, Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}, Address: ${event.returnValues.buyer}, Amount: ${event.returnValues.amount}, Total Amount: ${event.returnValues.totalAmount}`;  
      } else if (event.event == "ContractFunded") {
        eventElement.textContent = `Event: ${event.event}, Funder: ${event.returnValues.funder}, Amount: ${event.returnValues.amount}, Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      } else if (event.event == "TokenPriceUpdated") {
        eventElement.textContent = `Event: ${event.event}, New Price: ${event.returnValues.newPrice},  Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      }else if (event.event == "PurchaseCancelled") {
        eventElement.textContent = `Event: ${event.event}, Buyer: ${event.returnValues.buyer},  Amount: ${event.returnValues.amountRefunded}, Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      } else  if (event.event == "WithdrawalRequested"){
        eventElement.textContent = `Event: ${event.event}, Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}, Address: ${event.returnValues.owner}, Amount: ${event.returnValues.amountRequested}, Total Amount: ${event.returnValues.totalAmount}`;  
      }else if (event.event == "WithdrawalCancelled") {
        eventElement.textContent = `Event: ${event.event}, Owner: ${event.returnValues.owner}, Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      }else if (event.event == "WithdrawalExecuted") {
        eventElement.textContent = `Event: ${event.event}, Owner: ${event.returnValues.recipient}, Amount Token: ${event.returnValues.tokenAmountWithdrawn}, Amount: ${event.returnValues.amountWithdrawn}  Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      }else if (event.event == "PurchaseExecuted") {
        eventElement.textContent = `Event: ${event.event}, Owner: ${event.returnValues.buyer}, Amount Token: ${event.returnValues.tokenAmount}, Amount: ${event.returnValues.amountSpent}, Change: ${event.returnValues.change},  Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      }else if (event.event == "OperationalWindowToggled") {
        eventElement.textContent = `Event: ${event.event}, Status: ${event.returnValues.newStatus},  Block: ${event.returnValues.blockNumber}, Timestamp: ${event.returnValues.timestamp}`;
      }
      eventLog.appendChild(eventElement);
    });
  }
  // Llamar a la función cada 10 segundos
  //setInterval(getLatestEvents, 10000);