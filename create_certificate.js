const util = require('ethereumjs-util');
let Tx= require('ethereumjs-tx').Transaction;
const Web3= require('web3');
const url='https://ropsten.infura.io/v3/88adcf4f4a60430eb9cd886f9b732d85'
const web3 =new Web3(url);

const contractAbi = [{"constant":false,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"aTrustValue","type":"uint256"}],"name":"updateTrustValue","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"getUserCertificate","outputs":[{"internalType":"string","name":"userDomain","type":"string"},{"internalType":"string","name":"userMail","type":"string"},{"internalType":"uint256","name":"trustValue","type":"uint256"},{"internalType":"string","name":"periodOfValidity","type":"string"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"string","name":"version","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"certifyForAdd","type":"address"},{"internalType":"address","name":"byAdd","type":"address"},{"internalType":"uint256","name":"amountGivenBack","type":"uint256"}],"name":"backEtherForCertification","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"isCertificateExist","outputs":[{"internalType":"bool","name":"isCertificateValid","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"certifyForAddress","type":"address"},{"internalType":"address","name":"byAddress","type":"address"},{"internalType":"uint256","name":"amountGiven","type":"uint256"}],"name":"requestCertificationTo","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"string","name":"userDomain","type":"string"},{"internalType":"string","name":"userMail","type":"string"},{"internalType":"string","name":"periodOfValidity","type":"string"},{"internalType":"string","name":"signature","type":"string"}],"name":"newCertificate","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalTrustValue","type":"uint256"}],"name":"check","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalTrustValue","type":"uint256"}],"name":"check1","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalTrustValue","type":"uint256"}],"name":"check2","type":"event"}]

const contractAddress = '0x27AE6cA33b61Fd10d73775721Ab1394D7fDeA944';

var certificateContract = new web3.eth.Contract(contractAbi , contractAddress );

//this one is sender account
const sender_address = '0x5B6ea74EBd8B2ba3f12EbFAB6f76EEfCe5F48b12';
//private key of first account
const privatekey1 = new Buffer('EB7EE675AB78019FA4202D52040B8B3F5185F8E6E387E6AD5D87FBBAEE045C3F','hex');


//here we are getting the tx count
web3.eth.getTransactionCount(sender_address, (err,txCount)=>{

  var data = certificateContract.methods.newCertificate(sender_address,'emon.edu','test@gmail.com','24-12-22','test-signature').encodeABI();

  console.log(txCount);

  //Build the transaction
  const txObject ={
    nonce : web3.utils.toHex(txCount),
    to : contractAddress,
    gasLimit : web3.utils.toHex(4800000),
    gasPrice : web3.utils.toHex(web3.utils.toWei('100',"gwei")),
    data : data
  }


  //sign the transaction
  const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'});
  tx.sign(privatekey1);

  const serializeTransaction = tx.serialize();
  const raw= '0x'+ serializeTransaction.toString('hex');

  //send the transaction to ethereum network
  web3.eth.sendSignedTransaction(raw, function(err, hash) {
                    if (!err) {
                            console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                          } else {
                            console.log(err)
                          }
                    });

                  })
