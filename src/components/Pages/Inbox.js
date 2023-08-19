// import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import classes from "./Inbox.module.css";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { mailActions } from "../../store/MailSlice";

const Inbox = () => {
  const dispatch = useDispatch();

  const mails = useSelector(state => state.mails.inboxMails);

  const firebaseUrl =
    "https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box";

  const userEmail = localStorage.getItem("email");
  const userName = userEmail.split("@")[0];

  // const [mails, setMails] = useState([]);

  // let countUnReadMails = 0;
  // for (let mail of mails) {
  //   if (!mail.isRead) {
  //     countUnReadMails++;
  //   }
  // }
  // console.log(countUnReadMails,"count");

  // const fetchData = useCallback(() => {
  //   fetch(`${firebaseUrl}/${userName}/inbox.json`)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     // console.log(data, "data after refresh Inbox");
  //     const loadedMails = [];
  //     for (let key in data) {
  //       let mail = { id: key, ...data[key] };
  //       loadedMails.push(mail);
  //     }
  //     console.log(loadedMails, "loadedMails");
  //     setMails(loadedMails);
  //   });
  // },[userName]);

  // useEffect(() => {
  //   fetchData();
  //   setInterval(fetchData(), 3000)
  // }, [fetchData]);

  // const date = new Date();
  // // const fullDate = date.split();
  // console.log(date.getFullYear(),"date Inbox");

  const openMail = (mail) => {
    dispatch(mailActions.updateInboxMail(mail))
    fetch(`${firebaseUrl}/${userName}/inbox/${mail.id}.json`, {
      method: "PUT",
      body: JSON.stringify({...mail, isRead: true}),
    });
  };

  const deleteMail = (mail) => {
    dispatch(mailActions.removeInboxMail(mail));
    fetch(`${firebaseUrl}/${userName}/inbox/${mail.id}.json`, {
      method : "DELETE"
    })
  };

  // console.log(mails,"inbox")
  return (
    <div className={classes.inbox}>
      <h3 className={classes.inboxHeading}>Inbox</h3>
      {mails.map((mail) => (
        <Container fluid key={mail.id}>
          <Row key={mail.id} className={
            mail.isRead ? classes.openedMail : classes.notOpenedMail
          }>
            <Col className="col-11">
              <NavLink className={classes.navlink} to={`/inbox/${mail.id}`}>
                <Row onClick={openMail.bind(null, mail)}>
                  <Col className="fw-bold col-2">{mail.from}</Col>
                  <Col className="col-8">
                    <div className={classes.content}>
                      <strong>{mail.subject} - </strong> {mail.content}
                    </div>
                  </Col>
                  <Col className="col-2">
                    <strong>
                      {mail.time.hours}:{mail.time.minutes} {" "}
                      {mail.date.day}-{mail.date.month}-{mail.date.year} 
                    </strong>
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
        </Container>
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
