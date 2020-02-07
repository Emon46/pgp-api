const express = require('express');
const router = express.Router();
const util = require('ethereumjs-util');
let Tx= require('ethereumjs-tx').Transaction;
const Web3= require('web3');
const url='https://ropsten.infura.io/v3/88adcf4f4a60430eb9cd886f9b732d85'
const web3 =new Web3(url);
const contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "userAddress",
				"type": "address"
			},
			{
				"name": "aTrustValue",
				"type": "uint256"
			}
		],
		"name": "updateTrustValue",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserCertificate",
		"outputs": [
			{
				"name": "userDomain",
				"type": "string"
			},
			{
				"name": "userMail",
				"type": "string"
			},
			{
				"name": "trustValue",
				"type": "uint256"
			},
			{
				"name": "totalCertified",
				"type": "uint256"
			},
			{
				"name": "periodOfValidity",
				"type": "string"
			},
			{
				"name": "signature",
				"type": "string"
			},
			{
				"name": "version",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "certifyForAdd",
				"type": "address"
			},
			{
				"name": "byAdd",
				"type": "address"
			},
			{
				"name": "amountGivenBack",
				"type": "uint256"
			}
		],
		"name": "backEtherForCertification",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "send",
				"type": "uint256"
			},
			{
				"name": "returned",
				"type": "uint256"
			}
		],
		"name": "calculateTrustValue",
		"outputs": [
			{
				"name": "trust",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "rec",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "payMethod",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "isCertificateExist",
		"outputs": [
			{
				"name": "isCertificateValid",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "certifyForAddress",
				"type": "address"
			},
			{
				"name": "byAddress",
				"type": "address"
			},
			{
				"name": "amountGiven",
				"type": "uint256"
			}
		],
		"name": "requestCertificationTo",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "userAddress",
				"type": "address"
			},
			{
				"name": "userDomain",
				"type": "string"
			},
			{
				"name": "userMail",
				"type": "string"
			},
			{
				"name": "periodOfValidity",
				"type": "string"
			},
			{
				"name": "signature",
				"type": "string"
			}
		],
		"name": "newCertificate",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

//const contractAddress = '0xa105a7885b64df6fa6824864a0fc50c4392cef18';
const contractAddress = '0xcb22C0a0e7bC7BA821F241AFe89f463a87042CFC';

var certificateContract = new web3.eth.Contract(contractAbi , contractAddress );

//zhanda


router.post('/', (req, res, next)=> {
  const certifyForAddress = req.body.certifyForAddress;
  const byAddress = req.body.byAddress;
  const privateKey = new Buffer( req.body.PrivateKey,'hex');
  const amount =  req.body.amount;

  //here we are getting the tx count
  web3.eth.getTransactionCount(byAddress, (err,txCount) => {

    var data = certificateContract.methods.requestCertificationTo(certifyForAddress,byAddress,web3.utils.toWei(req.body.amount, 'ether')).encodeABI();

    //Build the transaction
    const txObject ={
      nonce : web3.utils.toHex(txCount),
      to : contractAddress,
      value : web3.utils.toHex(web3.utils.toWei(req.body.amount,"ether")),
      gasLimit : web3.utils.toHex(4800000),
      gasPrice : web3.utils.toHex(web3.utils.toWei('50',"gwei")),
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
                                  error: err,
                                  data: null
                                }
                                res.status(500).json(response);
                            }
                      });

  });

})


router.post('/send-back', (req, res, next)=> {
  const certifyForAddress = req.body.certifyForAddress;
  const privateKey = new Buffer( req.body.PrivateKey,'hex');
  const byAddress = req.body.byAddress;
  const amountGivenBack = req.body.amount;

  web3.eth.getTransactionCount(certifyForAddress, (err,txCount) => {

    var data = certificateContract.methods.backEtherForCertification(certifyForAddress,byAddress, web3.utils.toWei(amountGivenBack, 'ether')).encodeABI();

    //console.log(txCount);

    //Build the transaction
    const txObject ={
      nonce : web3.utils.toHex(txCount),
      to : contractAddress,
      value : web3.utils.toHex(web3.utils.toWei(amountGivenBack,"ether")),
      gasLimit : web3.utils.toHex(4800000),
      gasPrice : web3.utils.toHex(web3.utils.toWei('50',"gwei")),
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
                                  error: err,
                                  data: null
                                }
                                res.status(500).json(response);
                            }
                      });

  });

})

module.exports = router;
