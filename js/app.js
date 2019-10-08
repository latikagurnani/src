App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',


init: function() {
    return App.initWeb3();
  },

initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },



  initContract: function() {
    $.getJSON("Certificate.json", function(certificate) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Certificate = TruffleContract(certificate);
      // Connect provider to interact with contract
      App.contracts.Certificate.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },







render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    //content.hide();

    // Load account data
    // web3.eth.getAccounts().then(function (result){
    //   //return result[0]
    //   App.account=result[0]
    //   $("#accountAddress").html("Your Account: " + result[0]);
    //   });

      //web3.eth.getA
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        //var account = web3.eth.accounts[1];
        App.account = account;
        //web3.eth.getAccounts(accounts => console.log(accounts[0])).
        $("#accountAddress").html("Your Account: " + account);
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },


  addStudent: function() {
      
      $("#loader").hide();
      var first_name = $('#first_name').val();
      var last_name = $('#last_name').val();
      var class_std = $('#class').val();
      var rank = $('#rank').val();
      var field = $('#field').val();

      $("#first_name_disp").html("Your name " + first_name);

      App.contracts.Certificate.deployed().then(function(instance) {
      return instance.addStudent(first_name,last_name,class_std,rank,field, { from: App.account,gas:300000 });
    }).then(function(result) {
      // Wait for votes to update
      // $("#content").hide();
      $("#loaders").hide();
    }).catch(function(err) {
      console.error(err);
    });



    // var candidateId = $('#candidatesSelect').val();
    // App.contracts.Election.deployed().then(function(instance) {
    //   return instance.vote(candidateId, { from: App.account });
    // }).then(function(result) {
    //   // Wait for votes to update
    //   $("#content").hide();
    //   $("#loader").show();
    // }).catch(function(err) {
    //   console.error(err);
    // });
  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
