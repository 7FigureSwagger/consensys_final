import React, { Component, useEffect, useState } from "react";
import "fontsource-roboto";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { makeStyles } from "@material-ui/core/styles";
import getWeb3 from "./getWeb3";
import "./App.css";
import Layout from "./components/Layout";
import { Button, Card, CardContent, Divider, Grid, Typography } from "@material-ui/core";
import Web3 from "web3";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: "100vh",
		width: "100vw",
	},
	contractCard: {
		display: 'flex',
		height: 500,
		width: 400,
		textAlign: "-webkit-center",
		marginTop: 50,
		backgroundColor: "#413f46",
		border: 'solid',
		borderWidth: 'thin',
		borderColor: "#e947ff",
	},
	cardTitle: {
		fontSize: 'inherit',
		color: '#ffffff'
	}
}));

function App(props) {
	const [state, setState] = useState({
		storageValue: 0,
		web3: null,
		accounts: null,
		contract: null,
	});
	const [loader, setLoader] = useState(false);
	const [number, setNumber] = useState(0);
	const [getNum, setGetNum] = useState("0");
	const classes = useStyles();



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
				const accounts = res;

				// Get the contract instance.
				// const networkId = web3.eth.net.getId();
				// const deployedNetwork = SimpleStorageContract.networks[networkId];
				const instance = new web3.eth.Contract(
					SimpleStorageContract["abi"],
					SimpleStorageContract["networks"][5777]["address"]
				);

				// Set web3, accounts, and contract to the state
				setState({ web3, accounts, contract: instance });
			});
		});
	}, []);

	const numberSet = async (t) => {
		t.preventDefault();
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const gas = await state.contract.methods.set(number).estimateGas();
		const post = await state.contract.methods.set(number).send({
			from: account,
			gas,
		});
	};

	const numberGet = async (t) => {
		t.preventDefault();
		const post = await state.contract.methods.get().call();
		setGetNum(post);
	};

	if (!state.web3 || !state.contract) {
		return <div>Loading Web3, accounts, and contract...</div>;
	} else {
		return (
			<>
				<div className="App">
					<Layout
						state={state}
						web3Hook={web3Hook}
						// appAddress={sContract}
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
									<Grid container spacing={1}>
										<Grid item xs sm lg xl style={{ display: 'flex', justifyContent: "center"}}>
											<Card className={classes.contractCard} raised='true'>
												<CardContent>
													<Typography variant='overline' className={classes.cardTitle}>
														Contract Deposit Balances:
													</Typography>
													<Divider style={{ background: '#ffffff' }}/>
												</CardContent>
											</Card>
										</Grid>
										<Grid item xs sm lg xl>
											<h1>Welcome</h1>
										</Grid>
										<Grid item xs sm lg xl></Grid>
									</Grid>
								</Grid>
								<Grid item xs sm lg={12} xl>
									<div className="main">
										<div className="card">
											<form className="form" onSubmit={numberSet}>
												<label>
													Set your uint256:
													<input
														className="input"
														type="text"
														name="name"
														onChange={(t) => setNumber(t.target.value)}
													/>
												</label>
												<button
													className="button"
													type="submit"
													value="Confirm"
												>
													Confirm
												</button>
											</form>
											<br />
											<button
												className="button"
												onClick={numberGet}
												type="button"
											>
												Get your uint256
											</button>
											{getNum}
										</div>
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
