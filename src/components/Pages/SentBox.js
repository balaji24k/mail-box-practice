import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./Inbox.module.css";
import { Row, Col, Button } from "react-bootstrap";

const SentBox = () => {
  const firebaseUrl =
    "https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box";

  const userEmail = localStorage.getItem("email");
  const userName = userEmail.split("@")[0];

  const [mails, setMails] = useState([]);


  useEffect(() => {
    fetch(`${firebaseUrl}/${userName}/sentbox.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data, "data after refresh sentbox");
        const loadedMails = [];
        for (let key in data) {
          let mail = { id: key, ...data[key] };
          loadedMails.push(mail);
        }
        // console.log(loadedMails, "loadedMails");
        setMails(loadedMails);
      });
  }, [userName]);

  const deleteMail = (mail) => {
    const updatedMails = mails.filter((i) => i.id !== mail.id);
    setMails(updatedMails);

    fetch(`${firebaseUrl}/${userName}/sentbox/${mail.id}.json`, {
      method : "DELETE"
    })
  };

  return (
    <div className={classes.inbox}>
      <h3 className={classes.inboxHeading}> SentBox</h3>
      {mails.map((mail) => (
        <Row key={mail.id} className={ classes.openedMail }>
          <Col className="col-11">
            <NavLink className={classes.navlink} to={`/sentbox/${mail.id}`}>
              <Row>
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

export default SentBox;
