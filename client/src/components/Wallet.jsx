import {
	DialogTitle,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	Paper,
	Tooltip,
} from "@material-ui/core";
import React, { useState } from "react";

const Wallet = (props) => {
	const [state, setState] = useState();
	const { web3, accounts } = props.state;

	console.log(web3)

	return (
		<div>
			<Grid container spacing={1}>
				<Grid item xs sm lg xl>
					<List>
						<DialogTitle>Wallet Information</DialogTitle>
						<Divider />
						<Tooltip
							title="Click for balances."
							placement="right-end"
							style={{ fontSize: 14 }}
						>
							<ListItem button onClick={() => {web3.eth.getBalance(accounts[0]).then(console.log)}}>
								<ListItemText>
									Address: &nbsp;
									{props.state.accounts}
								</ListItemText>
							</ListItem>
						</Tooltip>
					</List>
				</Grid>
			</Grid>
		</div>
	);
};

export default Wallet;
