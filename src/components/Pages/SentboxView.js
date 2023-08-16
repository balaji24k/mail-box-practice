import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { Button } from "react-bootstrap";
import classes from "./InboxView.module.css";

const SentboxView = () => {
    console.log(classes,"classes sentview")
	const userEmail = localStorage.getItem("email");
	const userName = userEmail.split("@")[0]
	const {id} = useParams();

	const [mail,setMail] = useState({});
	// console.log(mail,"mail total mail")

	useEffect(() => {
		fetch(
			`https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box/${userName}/sentbox/${id}.json`
		)
		.then(response => {
			return response.json()
		})
		.then(data => {
			// console.log(data,"total mail");
			setMail(data);
		})
	}, [id, userName])

	const toMail = `<${mail.toMail}>`;

	const backSymbol = "<-"

	return (
		<div className={classes.box}>
			<NavLink to="/sentbox" className={classes.navlink}>
				<Button style={{marginBottom:"20px", padding:"5px"}}> {backSymbol}Go Back</Button>
			</NavLink>
			<h4>Subject: {mail.subject}</h4>
			<span style={{fontSize:"20px", fontWeight:"bold"}}>to: {mail.to}</span>{" "}
			<span style={{fontSize:"16px"}}>{toMail}</span>	
			<p style={{marginTop:"20px"}}>{mail.content}</p>
		</div>
	)
}

export default SentboxView;