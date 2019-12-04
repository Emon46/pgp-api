const express = require('express');
const router = express.Router();
const util = require('ethereumjs-util');
let Tx= require('ethereumjs-tx').Transaction;
const Web3= require('web3');
const url='https://ropsten.infura.io/v3/88adcf4f4a60430eb9cd886f9b732d85'
const web3 =new Web3(url);
const contractAbi =
[{"constant":false,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"aTrustValue","type":"uint256"}],"name":"updateTrustValue","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"getUserCertificate","outputs":[{"internalType":"string","name":"userDomain","type":"string"},{"internalType":"string","name":"userMail","type":"string"},{"internalType":"uint256","name":"trustValue","type":"uint256"},{"internalType":"uint256","name":"totalCertified","type":"uint256"},{"internalType":"string","name":"periodOfValidity","type":"string"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"string","name":"version","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"certifyForAdd","type":"address"},{"internalType":"address","name":"byAdd","type":"address"},{"internalType":"uint256","name":"amountGivenBack","type":"uint256"}],"name":"backEtherForCertification","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"send","type":"uint256"},{"internalType":"uint256","name":"returned","type":"uint256"}],"name":"calculateTrustValue","outputs":[{"internalType":"uint256","name":"trust","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"isCertificateExist","outputs":[{"internalType":"bool","name":"isCertificateValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"certifyForAddress","type":"address"},{"internalType":"address","name":"byAddress","type":"address"},{"internalType":"uint256","name":"amountGiven","type":"uint256"}],"name":"requestCertificationTo","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"string","name":"userDomain","type":"string"},{"internalType":"string","name":"userMail","type":"string"},{"internalType":"string","name":"periodOfValidity","type":"string"},{"internalType":"string","name":"signature","type":"string"}],"name":"newCertificate","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const contractAddress = '0x1046fe9aac779d440cd61b3729cf79639b97d919';

var certificateContract = new web3.eth.Contract(contractAbi , contractAddress );

//zhanda


var sendEthereum = function(sender_address,privateKey,receiver_address,amount_of_ether){

  var transactionDoneFlag=1;

  //here we are getting the tx count
  web3.eth.getTransactionCount(sender_address, (err,txCount)=>{
    //Build the transaction
    const txObject ={
      nonce : web3.utils.toHex(txCount),
      to : receiver_address,
      value : web3.utils.toHex(web3.utils.toWei(amount_of_ether,"ether")),
      gasLimit : web3.utils.toHex(21000),
      gasPrice : web3.utils.toHex(web3.utils.toWei('10',"wei"))
    }
    //sign the transaction
    const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'});
    tx.sign(privateKey);
    const serializeTransaction = tx.serialize();
    const raw= '0x'+ serializeTransaction.toString('hex');
    //send the transaction to ethereum network

    await web3.eth.sendSignedTransaction(raw, function(err, hash) {
                      if (!err) {
                        transactionDoneFlag=1;
                              console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                            } else {
                              console.log(err)
                            }
                      });

                    });

                    return transactionDoneFlag;
}


async router.post('/', (req, res, next)=> {
  const certifyForAddress = req.body.certifyForAddress;
  const byAddress = req.body.byAddress;
  const privateKey = new Buffer( req.body.PrivateKey,'hex');
  const amount =  req.body.amount;
  var flag=1;
   flag = sendEthereum(byAddress,privateKey,certifyForAddress,amount);
  if(flag === 1){
    //here we are getting the tx count
    web3.eth.getTransactionCount(byAddress, (err,txCount) => {

      var data = certificateContract.methods.requestCertificationTo(certifyForAddress,byAddress,web3.utils.toWei(req.body.amount, 'ether')).encodeABI();

      //console.log(txCount);

      //Build the transaction
      const txObject ={
        nonce : web3.utils.toHex(txCount),
        to : contractAddress,
        gasLimit : web3.utils.toHex(4800000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10',"wei")),
        data : data
      }


      //sign the transaction
      const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'});
      tx.sign(privateKey);

      const serializeTransaction = tx.serialize();
      const raw= '0x'+ serializeTransaction.toString('hex');

      //send the transaction to ethereum network
      web3.eth.sendSignedTransaction(raw, function(err, hash) {
                        if (!err) {
                          const response = {
                              success : true,
                              error: null,
                              hash: hash
                            }
                            console.log(hash);
                            res.status(201).json(response);
                              } else {
                                const response = {
                                    success : false,
                                    error: error,
                                    data: null
                                  }
                                  res.status(500).json(response);
                              }
                        });

    })
  }
})


router.post('/send-back', (req, res, next)=> {
  const certifyForAddress = req.body.certifyForAddress;
  const privateKey = new Buffer( req.body.PrivateKey,'hex');
  const byAddress = req.body.byAddress;
  const amountGivenBack = req.body.amount;
  var flag=1;
  // flag = sendEthereum(certifyForAddress,privateKey,byAddress,amountGivenBack);
  if(flag === 1){
    //here we are getting the tx count
    web3.eth.getTransactionCount(certifyForAddress, (err,txCount) => {

      var data = certificateContract.methods.backEtherForCertification(certifyForAddress,byAddress, web3.utils.toWei(amountGivenBack, 'ether')).encodeABI();

      //console.log(txCount);

      //Build the transaction
      const txObject ={
        nonce : web3.utils.toHex(txCount),
        to : contractAddress,
        gasLimit : web3.utils.toHex(4800000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10',"wei")),
        data : data
      }


      //sign the transaction
      const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'});
      tx.sign(privateKey);

      const serializeTransaction = tx.serialize();
      const raw= '0x'+ serializeTransaction.toString('hex');

      //send the transaction to ethereum network
      web3.eth.sendSignedTransaction(raw, function(err, hash) {
                        if (!err) {
                          const response = {
                              success : true,
                              error: null,
                              hash: hash
                            }
                            console.log(hash);
                            res.status(201).json(response);
                              } else {
                                const response = {
                                    success : false,
                                    error: error,
                                    data: null
                                  }
                                  res.status(500).json(response);
                              }
                        });

    })
  }

})

module.exports = router;
