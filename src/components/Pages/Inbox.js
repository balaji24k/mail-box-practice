import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./Inbox.module.css";
import { Row, Col, Container, Button } from "react-bootstrap";

const Inbox = () => {
  const firebaseUrl =
    "https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box";

  const userEmail = localStorage.getItem("email");
  const userName = userEmail.split("@")[0];

  const [mails, setMails] = useState([]);

  useEffect(() => {
    fetch(`${firebaseUrl}/${userName}/inbox.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data, "data after refresh Inbox");
        const loadedMails = [];
        for (let key in data) {
          let mail = { id: key, ...data[key] };
          loadedMails.push(mail);
        }
        console.log(loadedMails, "loadedMails");
        setMails(loadedMails);
      });
  }, [userName]);

  return (
    <div className={classes.inbox}>
      <h3 className={classes.inboxHeading}>Inbox</h3>
      {mails.map((mail) => (
        <NavLink className={classes.navlink} key={mail.id} to={`/inbox/${mail.id}`}>
          <Container fluid>
            <Row key={mail.id} className={classes.mail} >
              <Col className="col-4"></Col>
              <Col className="fw-bold col-2" >{mail.from}</Col>
              <Col className="col-5"><strong>{mail.subject} - </strong> {mail.content}</Col>
            </Row>
          </Container>
        </NavLink>
      ))}
      <Button className={classes.composeBtn} variant="success">
          <NavLink className={classes.navlink} to="compose-mail">
            Compose
          </NavLink>
      </Button>
    </div>
  );
};

export default Inbox;
