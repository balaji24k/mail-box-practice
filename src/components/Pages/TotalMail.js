import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./TotalMail.module.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { Button } from "react-bootstrap";

const TotalMail = () => {
	const userEmail = localStorage.getItem("email");
	const userName = userEmail.split("@")[0]
	const {id} = useParams();

	const [mail,setMail] = useState({});
	// console.log(mail,"mail total mail")

	useEffect(() => {
		fetch(
			`https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box/${userName}/inbox/${id}.json`
		)
		.then(response => {
			return response.json()
		})
		.then(data => {
			// console.log(data,"total mail");
			setMail(data);
		})
	}, [id, userName])


	const fromMail = `<${mail.fromMail}>`;

	const backSymbol = "<-"

	return (
		<div className={classes.box}>
			<NavLink to="/inbox" className={classes.navlink}>
				<Button style={{marginBottom:"20px", padding:"5px"}}> {backSymbol}Go Back</Button>
			</NavLink>
			<h4>Subject: {mail.subject}</h4>
			<span style={{fontSize:"20px", fontWeight:"bold"}}>From: {mail.from}</span>{" "}
			<span style={{fontSize:"16px"}}>{fromMail}</span>	
			<p style={{marginTop:"20px"}}>{mail.content}</p>
		</div>
	)
}

export default TotalMail;