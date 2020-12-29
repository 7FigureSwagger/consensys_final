import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {
	Dialog,
	DialogTitle,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	Modal,
	Tooltip,
	withStyles,
} from "@material-ui/core";
import Wallet from "./Wallet";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: "100vh",
		width: "100vw",
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	buttons: {
		color: "#9265e6",
		borderColor: "#e947ff",
		"&:hover": {
			color: "#ffffff",
			backgroundColor: "#5f1a7d",
		},
	},
	footer: {
		left: 0,
		botttom: 0,
		position: "fixed",
		textAlign: "center",
	},
}));

export default function Layout(props) {
	const [state, setState] = useState(props.state);
	const [openWallet, setOpenWallet] = useState(false);
	const classes = useStyles();

	const toggleWallet = () => {
		setOpenWallet(!openWallet);
	};

	return (
		<>
			<AppBar
				position="static"
				style={{
					backgroundColor: "#1c0c3d",
					boxShadow: "0px 5px 10px -5px #af37bf",
					position: "sticky",
				}}
			>
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						DumpETH
					</Typography>
					<Button
						color="inherit"
						variant="outlined"
						size='small'
						className={classes.buttons}
						onClick={() => toggleWallet()}
					>
						Wallet
					</Button>
				</Toolbar>
			</AppBar>
			<div className={classes.root}>{props.component}</div>
			<footer
				style={{
					bottom: 0,
					position: "fixed",
					textAlign: "left",
					color: "#fff",
					backgroundColor: "#1c0c3d",
					width: "100%",
					height: "4vh",
					boxShadow: "#af37bf 5px 0px 10px 0px",
				}}
			>
				<Grid container spacing={1}>
					<Grid item xs sm md lg={2}>
						<Typography variant="subtitle1" children={"Vires In Numeris"} />
					</Grid>
					<Grid item xs sm md lg={10}>
						<Grid container spacing={1} direction="row">
							<Grid item lg={6}>
								<Typography
									variant="subtitle1"
									children={
										"Contract Address: " + (state["contract"] ? state["contract"]["_address"]: <></>)
									}
								/>
							</Grid>
							<Grid item lg={6}>
								<Typography variant="subtitle1" children={
									"Wallet Address: " + (state["accounts"] ? state["accounts"][0] : <></>)
								}>
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</footer>
			<Dialog open={openWallet} onBackdropClick={() => toggleWallet()}>
				<Wallet state={state} />
			</Dialog>
		</>
	);
}
