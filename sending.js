const util = require('ethereumjs-util');
let Tx= require('ethereumjs-tx').Transaction;
const Web3= require('web3');
const url='https://ropsten.infura.io/v3/88adcf4f4a60430eb9cd886f9b732d85'
const web3 =new Web3(url);

//this one is sender account
const sender_address = '0x5B6ea74EBd8B2ba3f12EbFAB6f76EEfCe5F48b12';
//private key of first account
const privatekey1 = new Buffer('EB7EE675AB78019FA4202D52040B8B3F5185F8E6E387E6AD5D87FBBAEE045C3F','hex');

//receiver account
//const account2='0x23046814c8a98605FDE5a22CBb750e639c5Fa631';

var sendEthereum = function(receiver_address,amount_of_ether){


  //here i am checking the balance
  web3.eth.getBalance(sender_address, (err, wei) => {
    balance = web3.utils.fromWei(wei, 'ether')
    console.log(balance)
  })


  //here we can generate the public key with the private key;
  const fromAddress = '0x' + util.privateToAddress(privatekey1).toString('hex');
  //console.log(fromAddress)


  //here we are getting the tx count
  web3.eth.getTransactionCount(sender_address, (err,txCount)=>{

    console.log(txCount);

    //Build the transaction
    const txObject ={
      nonce : web3.utils.toHex(txCount),
      to : receiver_address,
      value : web3.utils.toHex(web3.utils.toWei(amount_of_ether,"ether")),
      gasLimit : web3.utils.toHex(21000),
      gasPrice : web3.utils.toHex(web3.utils.toWei('100',"gwei"))
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

                    return 'successs';
}

module.exports = sendEthereum;
