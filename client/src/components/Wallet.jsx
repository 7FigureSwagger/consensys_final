import {
	Collapse,
	DialogTitle,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Paper,
	Tooltip,
} from "@material-ui/core";
import React, { useState } from "react";

const Wallet = (props) => {
	const [state, setState] = useState({});
	const [collapse, setCollapse] = useState(false);
	const { web3, accounts } = props.state;

	return (
		<div>
			<Grid container spacing={1}>
				<Grid item xs sm lg xl>
					<List
						component="nav"
						subheader={
							<ListSubheader component="div">Wallet Information</ListSubheader>
						}
					>
						<Divider />
						<Tooltip
							title="Click for balances."
							placement="right-end"
							style={{ fontSize: 14 }}
						>
							<ListItem
								button
								onClick={() => {
									setCollapse(!collapse);
									web3.eth
										.getBalance(accounts[0])
										.then((res) =>
											setState({ ethBalance: res / 1000000000000000000 })
										);
								}}
							>
								<ListItemText>
									Address: &nbsp;
									{props.state.accounts}
								</ListItemText>
							</ListItem>
						</Tooltip>
					</List>
					<Collapse in={collapse} component="div">
						<List>
							<ListItem>
								<ListItemText>
									<Grid container spacing={1}>
										<Grid item xs sm md lg>
										</Grid>
										<Grid item xs sm md lg>
											ETH:{" "}
											{state.ethBalance ? state.ethBalance : <> loading...</>}
										</Grid>
									</Grid>
								</ListItemText>
							</ListItem>
						</List>
					</Collapse>
				</Grid>
			</Grid>
		</div>
	);
};

export default Wallet;
