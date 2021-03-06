import React, { Component, useEffect, useState } from "react";
import "fontsource-roboto";
import DumpEth from "./contracts/DumpEth.json";
import { makeStyles } from "@material-ui/core/styles";
import getWeb3 from "./getWeb3";
import "./App.css";
import Layout from "./components/Layout";
import {
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	TextField,
	Typography,
	withStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: "100vh",
		width: "100vw",
	},
	buttons: {
		color: "#9265e6",
		borderColor: "#e947ff",
		"&:hover": {
			color: "#ffffff",
			backgroundColor: "#5c5a61",
		},
	},
	contractCard: {
		display: "flex",
		height: 500,
		width: 400,
		textAlign: "-webkit-center",
		marginTop: 50,
		backgroundColor: "#413f46",
		borderColor: "#e947ff",
	},
	cardContent: {
		width: "-webkit-fill-available",
	},
	cardTitle: {
		fontSize: "inherit",
		color: "#ffffff",
	},
	input: {
		color: "#e947ff",
	},
}));

const CustomTextField = withStyles({
	root: {
		"& label.Mui-focused": {
			color: "#e947ff",
		},
		"& .MuiInput-root:after": {
			borderBottomColor: "#9265e6",
		},
	},
})(TextField);

function App(props) {
	const [state, setState] = useState({
		storageValue: 0,
		web3: null,
		accounts: null,
		contract: null,
	});
	const [loader, setLoader] = useState(false);
	const [withdrawAmt, setWithdrawAmt] = useState("");
	const [depositAmt, setDepositAmt] = useState("");
	const [contractEth, setContractEth] = useState("");
	const [contractTokens, getContractTokens] = useState(0);
	const classes = useStyles();

	// Get network web3 instance.
	async function web3Hook() {
		const web3 = getWeb3();
		return web3;
	}

	useEffect(() => {
		// Resolve promise returned from async func to get the user's accounts.
		web3Hook().then((web3) => {
			web3.eth.getAccounts().then((res) => {
				const accounts = res;

				// Get the contract instance and address to put into state
				const instance = new web3.eth.Contract(
					DumpEth["abi"],
					DumpEth["networks"][5777]["address"]
				);

				// Set web3, accounts, and contract to the state
				setState({ web3, accounts, contract: instance });
			});
		});
	}, []);


	// Deposit Eth in contract
	const deposit = async (t) => {
		const { contract, accounts } = state;
		let value = depositAmt * 1000000000000000000;

		// Calculate estimated gas needed
		const gas = await contract.methods
			.deposit()
			.estimateGas({ from: accounts[0], value }, (err, val) => {
				console.log(err ? (err, val) : val);
			});

		// Send built transaction
		let post = await contract.methods.deposit().send(
			{
				from: accounts[0],
				gas,
				value,
			},
			(err, val) => {

				// Reset state
				setDepositAmt(""); 
				console.log(err, val);
			}
		);
	};


	// Withdraw Eth from contract
	const withdraw = async (t) => {
		const { contract, accounts } = state;
		let value = withdrawAmt * 1000000000000000000;

		const gas = await contract.methods
			.withdraw(value.toString())
			.estimateGas({ from: accounts[0]}, (err, val) => {
				console.log(err ? (err, val) : val);
			});
		await contract.methods.withdraw(value.toString()).send(
			{
				from: accounts[0],
				gas,
			},
			(err, val) => {
				console.log(err, val);
				setWithdrawAmt("");
			}
		);
	};

	// Retrieve balance of Eth from contract
	const getBalance = async (t) => {
		const { contract, accounts } = state;

		try {
			await contract.methods
				.getContractBalance()
				.call({ from: accounts[0] }, (err, val) => {
					console.log(err, val);
					setContractEth((val / 1000000000000000000).toString());
				});
		} catch (err) {
			console.log("function failed.");
		}
	};


	// Make sure web3 and contract instance is loaded for proper rendering
	if (!state.web3 || !state.contract) {
		return <div>Loading Web3, accounts, and contract...</div>;
	} else {
		return (
			<>
				<div className="App">
					<Layout
						state={state}
						web3Hook={web3Hook}
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
										<Grid
											item
											lg
											xl
											style={{ display: "flex", justifyContent: "center" }}
										>
											<Card
												className={classes.contractCard}
												raised="true"
												variant="outlined"
											>
												<CardContent className={classes.cardContent}>
													<Grid
														container
														spacing={1}
														style={{ height: "-webkit-fill-available" }}
													>
														<Grid container item spacing={1}>
															<Grid item xs sm md={12} lg={12}>
																<Typography
																	variant="overline"
																	className={classes.cardTitle}
																>
																	Contract Deposit Balances:
																</Typography>
																<Divider style={{ background: "#ffffff" }} />
															</Grid>
														</Grid>
														<Grid container item spacing={1}>
															<Grid item sm md lg={12}>
																<Grid container spacing={1}>
																	<Grid item lg={6} xl={6}>
																		<Typography
																			variant="h6"
																			style={{ color: "#9265e6" }}
																		>
																			Eth: {contractEth ? contractEth : "-"}
																		</Typography>
																	</Grid>
																	<Grid item lg={6} xl={6}>
																		<Button
																			variant="outlined"
																			className={classes.buttons}
																			size="small"
																			onClick={() => getBalance()}
																		>
																			{" "}
																			{contractEth ? "Refresh" : "Load"}
																		</Button>
																	</Grid>
																</Grid>
															</Grid>
															<Grid item sm md lg={12}>
																<Grid container spacing={1}>
																	<Grid item lg={6} xl={6}>
																		<Typography
																			variant="h6"
																			style={{ color: "#9265e6" }}
																		>
																			Tokens:{" "}
																			{contractTokens ? contractTokens : "-"}
																		</Typography>
																	</Grid>
																	<Grid item lg={6} xl={6}>
																		<Button
																			variant="outlined"
																			className={classes.buttons}
																			size="small"
																		>
																			{contractTokens ? "Refresh" : "Load"}
																		</Button>
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
														<Grid container item spacing={1}>
															<Grid item sm md lg>
																<form
																	noValidate
																	autoComplete="off"
																	style={{
																		display: "flex",
																		flexDirection: "column",
																	}}
																>
																	<CustomTextField
																		id="deposit-field"
																		label="Eth to deposit"
																		size="small"
																		margin="dense"
																		onChange={(e) =>
																			setDepositAmt(e.target.value)
																		}
																	/>
																	&nbsp;
																	<Button
																		variant="outlined"
																		className={classes.buttons}
																		size="small"
																		onClick={() => deposit()}
																	>
																		Deposit
																	</Button>
																	<CustomTextField
																		id="deposit-field"
																		label="Eth to withdraw"
																		size="small"
																		margin="dense"
																		onChange={(e) =>
																			setWithdrawAmt(e.target.value)
																		}
																	/>
																	&nbsp;
																	<Button
																		variant="outlined"
																		className={classes.buttons}
																		size="small"
																		onClick={() => withdraw(withdrawAmt)}
																	>
																		Withdraw
																	</Button>
																</form>
															</Grid>
														</Grid>
													</Grid>
												</CardContent>
											</Card>
										</Grid>
										<Grid item xs sm lg xl>
											<h1>Welcome</h1>
										</Grid>
										<Grid item xs sm lg xl></Grid>
									</Grid>
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
