import React, { Component, useEffect, useState } from "react";
import "fontsource-roboto";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import Layout from "./components/Layout";
import { Grid } from "@material-ui/core";

function App(props) {
	const [state, setState] = useState({
		storageValue: 0,
		web3: null,
		accounts: null,
		contract: null,
	});
	const [loader, setLoader] = useState(false);

	async function web3Hook() {
		// Get network provider and web3 instance.
		const web3 = getWeb3();
		return web3;
	}

	useEffect(() => {
		web3Hook().then((web3) => {
			// Use web3 to get the user's accounts.
			// const accounts = web3.eth.getAccounts();
			web3.eth.getAccounts().then((res) => {
				console.log(res); 
				const accounts = res;
				
				// Get the contract instance.
				const networkId = web3.eth.net.getId();
				const deployedNetwork = SimpleStorageContract.networks[networkId];
				const instance = new web3.eth.Contract(
					SimpleStorageContract.abi,
					deployedNetwork && deployedNetwork.address
					);
					
					// Set web3, accounts, and contract to the state, and then proceed with an
					// example of interacting with the contract's methods.
					setState({ web3, accounts, contract: instance });
				})
		});
	}, []);

	if (state.web3 == null) {
		return <div>Loading Web3, accounts, and contract...</div>;
	} else {
		return (
			<>
				<div className="App">
					<Layout
						state={state}
						component={
							<Grid
								container
								spacing={1}
								style={{
									height: "-webkit-fill-available",
									backgroundColor: "#2e2c33",
								}}
							>
								<Grid item xs sm lg={12} xl>
									<h1>Welcome</h1>
								</Grid>
								<Grid item xs sm lg={12} xl>
									<div>
										Please connect a wallet to get started!
									</div>
								</Grid>
							</Grid>
						}
					></Layout>
				</div>
			</>
		);
	}
}

export default App;
