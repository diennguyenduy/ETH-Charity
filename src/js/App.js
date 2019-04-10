App = {
    web3Provider: null,
    contract: null,
  
    init: function() {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
  
      App.initContract();
    },
  
    initContract: function() {
      var charityContract = web3.eth.contract([
        {
            "constant": false,
            "inputs": [],
            "name": "refund",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "requestToWithdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "sendMoney",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_requiredFund",
                    "type": "uint256"
                },
                {
                    "name": "_receiverAddress",
                    "type": "address"
                },
                {
                    "name": "_time",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "checkInvalid",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "deadLine",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "enoughFund",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "fundSended",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getTotalSender",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "isSended",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "receiverAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "requestBool",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "requiredFund",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "senders",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "start",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "timeRemain",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalFund",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]); //abi of the contract 
      App.contract = charityContract.at("0x1df24c2e1c6ae86b2831175360d6d6d57f484a9b") // address of the contract
      
        $(document).on('click', '.submit', App.giveFund); // call App.giveFund() function after 'click' on button  class 'submit'
        $(document).on('click', '.refund', App.refund);
        $(document).on('click', '.withdraw', App.withdraw);

        setInterval(App.updateState, 1000); // call updateState function each 1s
    },
  
    updateState: function() {
      let contract = App.contract;
      let coinbase = web3.eth.coinbase;

      web3.eth.getBalance(coinbase, function (err, result) {
        if (!err) {
          $("#coinbase").text(coinbase + " (Số dư: " + web3.fromWei(result.toNumber()) + " ETH)");
        }
        else console.error(err);
      });

      contract.receiverAddress(function(err, result){
        if(!err) {
            $("#receiver-address").text(result);
        } else
        console.error(err);
      });

      contract.owner(function(err, result){
        if(!err) {
            $("#contract-owner").text(result);
        } else
        console.error(err);
      });

      contract.requiredFund(function (err, result) {
        if (!err) {
          $("#required-fund").text(result.toNumber());
        }
        else console.error(err);
      });

      contract.totalFund(function (err, result) {
        if (!err) {
          result = result.toNumber()
          $("#total-fund").text(result);
        }
        else console.error(err);
      });
  
      contract.timeRemain(function (err, result) {
          if(result == 0) {
            $("#time-remain").text('0');
          }
          if (!err) { 
              $("#time-remain").text(result);
            } 
        else {
            console.error(err);
        }
      });

      contract.getTotalSender(function (err, result) {
        if(!err) {
            $("#total-senders").text(result);
        } else
        console.error(err);
      });

      contract.checkInvalid(function(err, result) {
          if(!result) {
              $(".refund").hide();
          } else {
              $(".submit").hide();
          }
      });

      contract.enoughFund(function(err, result) {
        if(!result) {
            $(".with-draw").hide();
            $(".form-group").show();
        } else {
            $(".form-group").hide();
            $(".with-draw").show();
        }
      });
    },
  
    giveFund: function() {
        var money = parseInt(document.getElementById("money").value); 
        let contract = App.contract;
        contract.sendMoney(money, { value: web3.toWei(money, 'ether') }, function (err, result) {
         if (!err) console.log(result);
         else console.error(err);
     })
    },

    withdraw: function() {
        let contract = App.contract;

        contract.requestToWithdraw(function(err, result) {
            if(!err) {
                console.log(result);
            } else {
                console.log(err);
            }
        })
    },

    refund: function() {
        let contract = App.contract;

        contract.refund(function(err, result) {
            if(!err) {
                $('#refund-warning').text('Completed!');
            }
            else {
                $('#refund-warning').text(err);
            }
        })
    }
}
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
