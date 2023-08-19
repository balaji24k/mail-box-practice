import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./InboxView.module.css";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { mailActions } from "../../store/MailSlice";

const InboxView = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const {id} = useParams();

	const firebaseUrl =
	"https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box";

	const userEmail = localStorage.getItem("email");
	const userName = userEmail && userEmail.split("@")[0];

	const inboxMails = useSelector(state => state.mails.inboxMails);
	const mail = inboxMails.find(i => i.id === id);
	// console.log(mail,"inbox view")

	const fromMail = mail && `<${mail.fromMail}>`;
	const backSymbol = "<-";

	const deleteMail = () => {
		history.replace("/inbox")
		dispatch(mailActions.removeInboxMail(mail));
    fetch(`${firebaseUrl}/${userName}/inbox/${mail.id}.json`, {
      method : "DELETE"
    })
		console.log("delete inbox view");
	}

	return (
		<>
			{mail && 
				<div className={classes.box}>
					<NavLink to="/inbox" className={classes.navlink}>
						<Button style={{marginBottom:"20px", padding:"5px"}}> {backSymbol}Go Back</Button>
					</NavLink>
					<h4>Subject: {mail.subject}</h4>
					<span style={{fontSize:"20px", fontWeight:"bold"}}>From: {mail.from}</span>{" "}
					<span style={{fontSize:"16px"}}>{fromMail}</span>	
					<h6 style={{marginTop: "10px"}}>
						Time: {mail.time.hours}:{mail.time.minutes} {" "}
						{mail.date.day}-{mail.date.month}-{mail.date.year} 
					</h6>
					<p style={{marginTop:"20px"}}>{mail.content}</p>
					
					{/* <NavLink to="/inbox" className={classes.navlink}> */}
						<Button 
							variant="danger" 
							onClick={deleteMail}
							style={{marginBottom:"20px", padding:"5px"}}
						> 
							Delete
						</Button>
					{/* </NavLink> */}
				</div>
			}
		</>
	)
}

export default InboxView;