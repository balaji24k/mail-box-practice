import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./Inbox.module.css";
import { Row, Col, Button } from "react-bootstrap";

const Inbox = () => {
  const firebaseUrl =
    "https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box";

  const userEmail = localStorage.getItem("email");
  const userName = userEmail.split("@")[0];

  const [mails, setMails] = useState([]);

  let countUnReadMails = 0;
  for (let mail of mails) {
    if (!mail.isRead) {
      countUnReadMails++;
    }
  }

  // console.log(countUnReadMails,"count");

  useEffect(() => {
    fetch(`${firebaseUrl}/${userName}/inbox.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data, "data after refresh Inbox");
        const loadedMails = [];
        for (let key in data) {
          let mail = { id: key, ...data[key] };
          loadedMails.push(mail);
        }
        // console.log(loadedMails, "loadedMails");
        setMails(loadedMails);
      });
  }, [userName]);

  const openMail = (mail) => {
    // console.log(mail,"main inbox");
    const updatedMail = { ...mail, isRead: true };
    const mailIndex = mails.findIndex((i) => i.id === mail.id);
    const updatedMails = [...mails];
    updatedMails[mailIndex] = updatedMail;
    setMails(updatedMails);
    // console.log(updatedMail,"updatedMail");
    fetch(`${firebaseUrl}/${userName}/inbox/${mail.id}.json`, {
      method: "PUT",
      body: JSON.stringify(updatedMail),
    });
  };

  const deleteMail = (mail) => {
    const updatedMails = mails.filter((i) => i.id !== mail.id);
    setMails(updatedMails);

    fetch(`${firebaseUrl}/${userName}/inbox/${mail.id}.json`, {
      method : "DELETE"
    })
  };

  return (
    <div className={classes.inbox}>
      <h3 className={classes.inboxHeading}>
        Inbox ({countUnReadMails} - unread mails)
      </h3>
      {mails.map((mail) => (
        <Row key={mail.id} className={
          mail.isRead ? classes.openedMail : classes.notOpenedMail
        }>
          <Col className="col-11">
            <NavLink className={classes.navlink} to={`/inbox/${mail.id}`}>
              <Row onClick={openMail.bind(null, mail)}>
                <Col className="col-1"></Col>
                <Col className="fw-bold col-2">{mail.from}</Col>
                <Col className="col-9">
                  <div className={classes.content}>
                    <strong>{mail.subject} - </strong> {mail.content}
                  </div>
                </Col>
              </Row>
            </NavLink>
          </Col>
          <Col className="col-1">
            <Button
              onClick={deleteMail.bind(null, mail)}
              style={{ padding: "0px 5px" }}
              variant="danger"
            >
              Delete
            </Button>
          </Col>
        </Row>
      ))}
      <NavLink className={classes.navlink} to="/compose-mail">
        <Button className={classes.composeBtn} variant="success">
          Compose
        </Button>
      </NavLink>
    </div>
  );
};

export default Inbox;
