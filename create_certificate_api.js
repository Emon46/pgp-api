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

const contractAddress = '0xcb22C0a0e7bC7BA821F241AFe89f463a87042CFC';

var certificateContract = new web3.eth.Contract(contractAbi , contractAddress );



router.post('/', (req, res, next)=> {

  certificateContract.methods.isCertificateExist(req.body.address).call((err,result)=> {
    if(result === false){

        var certificate_address = req.body.address;
        var userDomain = req.body.userDomain;
        var userMail = req.body.userMail;
        var periodOfValidity = req.body.periodOfValidity;
        var privatekeyOfUser = new Buffer( req.body.privateKey,'hex');


        //here we are getting the tx count
        web3.eth.getTransactionCount(certificate_address, (err,txCount) => {

          var data = certificateContract.methods.newCertificate(certificate_address,userDomain,userMail,periodOfValidity,'test-signature').encodeABI();

          console.log(txCount);

          //Build the transaction
          const txObject ={
            nonce : web3.utils.toHex(txCount),
            to : contractAddress,
            gasLimit : web3.utils.toHex(4800000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10',"gwei")),
            data : data
          }


          //sign the transaction
          const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'});
          tx.sign(privatekeyOfUser);

          const serializeTransaction = tx.serialize();
          const raw= '0x'+ serializeTransaction.toString('hex');

          //send the transaction to ethereum network
          web3.eth.sendSignedTransaction(raw, function(err, hash) {
                            if (!err) {
                              const response = {
                                  success : true,
                                  error: null,
                                  data: data,
                                  hash: hash
                                }
                                console.log(hash);
                                res.status(201).json(response);
                                     // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
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
    else {
      res.status(500).json({
        success : false,
        error: "certificate already available"
      });
    }
  })

})


router.get('/:address', (req, res, next)=> {
  const address = req.params.address;
  certificateContract.methods.isCertificateExist(address).call((err,result)=> {
    if(result === true){
      certificateContract.methods.getUserCertificate(address).call((err,result)=> {
          const data = {
            address : address,
            userDomain : result.userDomain,
            userMail : result.userMail,
            trustValue : result.trustValue,
            periodOfValidity : result.periodOfValidity,
            signature: result.signature,
            version: result.version
          }
          const response = {
              success : true,
              error: null,
              data: data
            }
          res.status(200).json(response);
    })

   }
   else {

       res.status(500).json({
         success : false,
         error: "no certificate available"
       });
   }
  });

});


module.exports = router;
