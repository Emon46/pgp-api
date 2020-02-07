pragma solidity ^0.5.8;

contract Certificate {

    address[] certificateIndexes;

    struct UserCertificate {
            address userAddress;
            string userDomain;
            string userMail;
            uint trustValue;
            string periodOfValidity;
            string signature;
            string version;
            uint   totalCertified;
            uint   index;
            bool   isAvailable;
    }

    mapping(address => UserCertificate) UserCertificates;

    function calculateTrustValue(uint send, uint returned)
    public
    returns(uint trust){

        trust = (returned*10)/send;
        if(trust>10) trust = 10;
        return trust;
    }

    // ****************NEW***CERTIFICATE***********

    function newCertificate( address userAddress,
                              string memory userDomain,
                              string memory userMail,
                              string memory periodOfValidity,
                              string memory signature)
    public
    returns(bool success){

          bool certficateExist = isCertificateExist(userAddress);
          if(certficateExist == true )return false;

          UserCertificates[userAddress].userMail          = userMail;
          UserCertificates[userAddress].userDomain        = userDomain;
          UserCertificates[userAddress].periodOfValidity  = periodOfValidity;
          UserCertificates[userAddress].trustValue        = 0;
          UserCertificates[userAddress].version           = "0.0.1";
          UserCertificates[userAddress].signature         = signature;
          UserCertificates[userAddress].isAvailable       = true;
          UserCertificates[userAddress].index             = certificateIndexes.push(userAddress)-1;
          UserCertificates[userAddress].totalCertified    = 0;

          return true;
    }

    // ****GET***CERTIFICAT****INFORMATION***

    function getUserCertificate(address userAddress)
    public
    view
    returns(
            string memory userDomain,
             string memory userMail,
             uint    trustValue,
             uint totalCertified,
             string memory periodOfValidity,
             string memory signature,
             string memory version) {


                    return(
                            UserCertificates[userAddress].userDomain,
                            UserCertificates[userAddress].userMail,
                            UserCertificates[userAddress].trustValue,
                            UserCertificates[userAddress].totalCertified,
                            UserCertificates[userAddress].periodOfValidity,
                            UserCertificates[userAddress].signature,
                            UserCertificates[userAddress].version);
             }



    //*********CHECK**IF**CERTIFICATE**CREATED******

    function isCertificateExist(address userAddress)
    public
    view
    returns( bool isCertificateValid ){
              if(certificateIndexes.length == 0) return false;
              if(certificateIndexes[ UserCertificates[userAddress].index ] == userAddress)return true;
              else return false;
            }


    //********UPDATE***TRUST****VALUE*****

    function updateTrustValue( address userAddress, uint aTrustValue )
    public
    returns(bool success){
               uint totalTrustValue =( UserCertificates[userAddress].trustValue*UserCertificates[userAddress].totalCertified )  + aTrustValue;
               UserCertificates[userAddress].totalCertified = UserCertificates[userAddress].totalCertified +1;
               UserCertificates[userAddress].trustValue =  totalTrustValue / UserCertificates[userAddress].totalCertified ;
               return true;
    }


    //*****REQUEST******PART****


    struct CertifyBy {
        address certifyByAddress;
        uint receiveAmount;
        uint returnedAmount;
        bool returned;

    }
    mapping(address => CertifyBy[]) certifyBypeoples;

    function requestCertificationTo(address certifyForAddress, address byAddress, uint amountGiven)
    public payable
    returns(bool success){
        payMethod(certifyForAddress,amountGiven);
        CertifyBy memory singleCertifier;
        singleCertifier.certifyByAddress =byAddress;
        singleCertifier.receiveAmount = amountGiven;
        singleCertifier.returnedAmount = 0;
        singleCertifier.returned =false;
        certifyBypeoples[certifyForAddress].push(singleCertifier);
        return true;
    }

    function backEtherForCertification(address certifyForAdd, address byAdd, uint amountGivenBack)
    public payable
    returns(bool success){

        for (uint i = 0; i < certifyBypeoples[certifyForAdd].length; i++) {

            if(certifyBypeoples[certifyForAdd][i].certifyByAddress == byAdd){
                payMethod(byAdd,amountGivenBack);
                certifyBypeoples[certifyForAdd][i].returnedAmount = amountGivenBack;

                uint send = certifyBypeoples[certifyForAdd][i].receiveAmount;
                uint returned = certifyBypeoples[certifyForAdd][i].returnedAmount;
                uint newTrusValue = calculateTrustValue(send,returned);
                bool succ = updateTrustValue(certifyForAdd,newTrusValue);
                return succ;


            }
        }

        return false;


    }

        function payMethod(address rec,uint amount) public payable {

        address payable receiver = address(uint160(rec));
        receiver.transfer(amount);
    }


}
