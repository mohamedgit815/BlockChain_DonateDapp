import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from "web3/dist/web3.min";
import './App.css';
import DonateContract from "./abi/Volunteer.json";

function App() {
  const _providerChange = (provider)=>{
    provider.on("accountsChanged",()=>{window.location.reload()});
    provider.on("chainChanged",()=>{window.location.reload()});
  }

  const [ web3 , setWeb3 ] = useState({
    web3: null , 
    account: null , 
    provider: null ,
    networkId: null
  });
  useEffect(() => {
    const _loadContract = async ()=>{
      const _provider = await detectEthereumProvider();

      if(_provider) {
        _providerChange(_provider);

        const _web3 = await new Web3(_provider);
        const _account = await _web3.eth.getAccounts();
        const _netWorkId = await _web3.eth.net.getId();     

          setWeb3({
            web3: _web3 ,
            account: _account[0] ,
            provider: _provider , 
            networkId: _netWorkId
          });

      } else {
        window.alert("Enter your Wallet MetaMask");
      }


    }
      _loadContract();
  },[]);

  const [voluntterContract , setVolunteerContract] = useState({
    contract: null , 
    checkContract: undefined , 
    balanceUser: 0 ,
    idUsers: 0 ,
    ownerContract: null ,
    balanceContract: 0
  });
  useEffect(() => {
    const _loadContract = async () => {

      const _contractObject = await DonateContract.networks[web3.networkId];

      if( _contractObject ) {
        const _contractAddress = await DonateContract.networks[web3.networkId].address;
        
        const _deployedContract = await new web3.web3.eth.Contract(
          DonateContract.abi,_contractObject && _contractAddress);

        const _balance = await web3.web3.eth.getBalance(web3.account);

        const _idUsers = await _deployedContract.methods.countId().call();

        const _ownerContract = await _deployedContract.methods.owner().call();

        const _balanceContract = await _deployedContract.methods.getBalanceAddress().call();
        

        setVolunteerContract({
          contract: _deployedContract ,
          checkContract: true ,
          balanceUser: _balance , 
          idUsers: _idUsers ,
          balanceContract: _balanceContract ,
          ownerContract: _ownerContract
        });

      } 

    }

     web3.account && _loadContract();

  },[web3.account]);


  const _reqAccoubtsFunc = async () => {
   return await web3.web3.eth.requestAccounts();
  }

  const _donateButton = async () => {
    const _toWei = await web3.web3.utils.toWei("0.02","ether")
    return await voluntterContract.contract.methods.donate().send({
     from: web3.account ,
     value: _toWei
    });
  }

  /*
  const _withdrawFunc = async () => {
    const _toWei = await web3.web3.utils.toWei("1.0","ether")

    return await voluntterContract.contract.methods.withdraw(_toWei).send({
      from: web3.account , 
      value: _toWei
    });
  }
  */


  
  return (
    <div className="App">
      <header className="App-header">

      <div className='text-blue-300'>
        <p>Donate To Our Project Contract To Help Poor People</p>
      </div>

      <div className='flex'>
        <h3>My Wallet Address:</h3>
        <div className='mx-2'>
          <h3>{
          !web3.provider ? 
          <div className='text-red-400'>
            <a href='https://www.bing.com/'> install Metamask </a>
          </div >
          :
          web3.account ? 
           <div className="text-blue-300">
             {web3.account}
           </div>
          : 
          <div>
             <button onClick={_reqAccoubtsFunc} className="text-green-400">
               Connect with your Wallet
               </button>
           </div>
         }</h3>
        </div>
      </div>


        {
        voluntterContract.checkContract ? 
        <div className='flex '>
         <h3>My Blance:</h3>
         <div>
           <h3 className='px-3'>
             {web3.web3.utils.fromWei(voluntterContract.balanceUser.toString(),"ether")} ETH</h3> 
           </div>
         </div>
        :
        null
        }



        {
        voluntterContract.checkContract ? 
        <div className='flex '>
         <h3>The Volunteers :</h3>
         <div>
           <h3 className='px-3'>
             {voluntterContract.idUsers} Volunteer</h3> 
           </div>
         </div>
        :
        null
        }   


    


      
        <div className='bg-blue-500 p-2 m-2 rounded-lg'>
        <h3>Contract Balances</h3>
          <h3>{voluntterContract.balanceContract} ETH </h3>
        </div>
      



     
        <div className='bg-blue-500 p-2 m-2 rounded-lg' onClick={!web3.account? _reqAccoubtsFunc : _donateButton}>
        <button>
          Donate 0.02 ETH 
        </button>
      </div>


     
        
      

      </header>
    </div>
  );
}

/*
<div className='bg-blue-500 p-2 m-2 rounded-lg' onClick={_withdrawFunc}>
        <button>
          withdraw 1.0 ETH
        </button>
      </div>
*/

export default App;
