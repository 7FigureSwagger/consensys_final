import { Grid, Paper } from "@material-ui/core";
import React, { useState } from "react";

const Wallet = (props) => {
	const [state, setState] = useState();

	return (
		<div>
			<Grid container spacing={1}>
				<Grid item xs sm lg xl>
						{props.state.accounts}
				</Grid>
			</Grid>
		</div>
	);
};

export default Wallet;
