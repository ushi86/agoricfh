let web3;
let userAccount;
let userNFTs = [];

const products = [
    { id: 1, name: "NFT Art 1", price: 0.01 },
    { id: 2, name: "NFT Art 2", price: 0.02 },
];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = await web3.eth.getAccounts();
        document.getElementById('message').innerText = `Connected: ${userAccount[0]}`;
        loadProducts();
    } else {
        alert('Please install A Wallet!');
    }
}

function loadProducts() {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''; 
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>Price: ${product.price} ETH</p>
            <button onclick="purchaseNFT(${product.id})">Purchase</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

async function purchaseNFT(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const transactionParameters = {
        to: 'dummy address',
        from: userAccount[0],
        value: web3.utils.toHex(web3.utils.toWei(product.price.toString(), 'ether')),
        data: 'contract for trans'
    };

    try {
        const txHash = await web3.eth.sendTransaction(transactionParameters);
        document.getElementById('message').innerText = `Transaction successful: ${txHash.transactionHash}`;
        userNFTs.push(product); // Add NFT to user's collection
    } catch (error) {
        console.error(error);
        document.getElementById('message').innerText = `Transaction failed: ${error.message}`;
    }
}

function viewMyNFTs() {
    const nftsDiv = document.createElement('div');
    nftsDiv.className = 'nfts';
    nftsDiv.innerHTML = '<h2>Your NFTs</h2>';
    
    if (userNFTs.length === 0) {
        nftsDiv.innerHTML += '<p>You have no NFTs.</p>';
    } else {
        userNFTs.forEach(nft => {
            nftsDiv.innerHTML += `<p>${nft.name}</p>`;
        });
    }

    document.body.appendChild(nftsDiv);
}

function collectNFT() {
    const randomNFT = products[Math.floor(Math.random() * products.length)];
    userNFTs.push(randomNFT);
    document.getElementById('message').innerText = `Collected: ${randomNFT.name}`;
}

function connectWithAgoric() {
    alert("Redirecting you to a super cool portal to manage your NFT");
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('viewNFTs').addEventListener('click', viewMyNFTs);
document.getElementById('collectNFT').addEventListener('click', collectNFT);
document.getElementById('connectAgoric').addEventListener('click', connectWithAgoric);