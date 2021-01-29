import React, { Component } from 'react'
import Web3 from 'web3'
import axios from 'axios'
import './App.css'
const API_URL = 'http://localhost:4000';


class App extends Component {
  componentWillMount() { 
    this.getTokenBalance()
  }
 
  async getTokenBalance() {

    // variables to operate
    var tokenBalance;
    var tokenPrice;
    var userTokenFiat;

    var url = "https://mainnet.infura.io/v3/678c785c061d4c7e96d3075711ed838c";
    var web3 = new Web3(url);
    
    const userAcc = "0xc91795a59f20027848bc785678b53875934792a1";
    const contractABI = [{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
    const contractAddress = "0x4c327471C44B2dacD6E90525f9D629bd2e4f662C";    
    this.setState({contractAddress : contractAddress })
    this.setState({userAcc : userAcc})
    
    var deployedContract = new web3.eth.Contract (contractABI, contractAddress);
    deployedContract.methods.totalSupply().call((err, result) => {
      console.log("Total supply: "+result)
    })
    deployedContract.methods.symbol().call((err, result) => {
      console.log("Symbol "+result)
    })
    deployedContract.methods.balanceOf(userAcc).call((err, result) => {
      tokenBalance = web3.utils.fromWei(result, 'ether');
      console.log("Balance of: "+ tokenBalance)      
      this.setState({balance : tokenBalance})
      
    })
     
   //********************* GET EXCHANGE DATA*********************** */
    const res = await axios.get(`${API_URL}/api/getBCData`);
   // console.log("res : "+ JSON.stringify(res));
   
    var crypto = res.data.data.GHOST;
    console.log("res : "+ JSON.stringify(crypto));
   // console.log("DATA : "+ JSON.stringify(crypto.name));
    this.setState({name : crypto.name })
    this.setState({symbol : crypto.symbol })
    this.setState({price : crypto.quote.USD.price })
    this.setState({loading : false })

    // fiat calculation
    tokenPrice = crypto.quote.USD.price;
    console.log("tokenPrice float : "+ parseFloat(tokenPrice));
    console.log("tokenBalance float : "+ parseFloat(tokenBalance));
    userTokenFiat = parseFloat(tokenPrice) * parseFloat(tokenBalance);
    console.log("userTokenFiat: " + userTokenFiat);
    this.setState({userTokenFiat : userTokenFiat});
  }

  constructor(props) {
    super(props)
    this.state = {
      contractAddress: '',
      userAcc: '',
      balance: '',
      userTokenFiat: '',
      currency: 'USD',
      symbol: null,
      price: null,
      name: null,
      loading: true
    }
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <main role="main" className="col-lg-12 justify-content-center">
              <h2>DISPLAY TOKEN BALANCE IN FIAT</h2>
            <h4>TOKEN DETAILS</h4>
              <ul id="crypto" className="list-unstyled">
                <li><span>Address:</span> {this.state.contractAddress}</li>
                <li><span>Name:</span> {this.state.name}</li>
                <li><span>Symbol:</span> {this.state.symbol}</li>
                <li><span>Price:</span> {this.state.price} {this.state.currency}</li>
              </ul> 
              <hr/> 
              <h4>ACCOUNT DETAILS</h4> 
              <ul id="account" className="list-unstyled">
                    <li><span>Account:</span> {this.state.userAcc}</li>
                    <li><span>Balance:</span> {this.state.balance} {this.state.symbol}</li>
                    <li CLASS="spl">USD: {this.state.userTokenFiat} {this.state.currency}</li>
                  </ul>
                
              
              
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
