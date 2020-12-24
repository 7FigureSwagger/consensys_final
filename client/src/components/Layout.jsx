import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: "100vh",
		width: "100vw",
	},
	mainDiv: {
		height: "100vh",
		width: "100vw",
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	footer: {
    left: 0,
    botttom: 0,
		position: "fixed",
		textAlign: "center",
	},
}));

export default function Layout(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<AppBar position="static">
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
						News
					</Typography>
					<Button color="inherit">Login</Button>
				</Toolbar>
			</AppBar>
			<div className={classes.mainDiv}>{props.children}</div>
      <div >
			<footer style={{ bottom: 0, position: "fixed", textAlign: "center", backgroundColor: "#694343", width: "100%"}}>Vires In Numeris</footer>

      </div>
		</div>
	);
}
