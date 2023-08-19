import React, { useState, useRef } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Button, Card, Form, FloatingLabel, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { mailActions } from "../../store/MailSlice";

const ComposeMail = () => {
  const dispatch = useDispatch();

	const userEmail = useSelector(state => state.auth.userEmail);
	const userName = userEmail && userEmail.split("@")[0];

	const firebaseUrl = "https://react-projects-aaebd-default-rtdb.firebaseio.com/mail-box";

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const toEmailRef = useRef();
	const subjectRef = useRef();

  const onEditorStateChange = (editorState) => {
    // console.log(editorState.getCurrentContent().getPlainText(), "editorstate");
    setEditorState(editorState);
  };

	const SubmitHandler = (event) => {
    event.preventDefault();

    // sending data to the outbox
    const receiverEmail = toEmailRef.current.value;
    const receiverName = receiverEmail.split("@")[0];

    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth()+1; // +1 Because Months are 0-indexed
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const date = {day,month,year};
    const time = {hours, minutes};

    console.log(date,"date compose");
    console.log(time, "time compose");

    const sentMessage = {
      date : date,
      time : time,
      toMail : receiverEmail,
      to: receiverName,
      subject: subjectRef.current.value,
      content: editorState.getCurrentContent().getPlainText(),
    };

    fetch(`${firebaseUrl}/${userName}/sentbox.json`, {
			method : "POST",
			body : JSON.stringify(sentMessage)
		})
		.then(response => {
			// console.log(response);
			toEmailRef.current.value = "";
			subjectRef.current.value = "";
			setEditorState("");
      return response.json()
		})
    .then(data => {
      const sentData = { id : data.name, ...sentMessage}
      dispatch(mailActions.addSentboxMail(sentData));
    })
		.catch((error) => {
			console.log(error);
		});
		
    //Sending data to inbox of the user
		const receiverMessage = {
      date : date,
      time : time,
			from: userName,
      fromMail : userEmail,
			subject: subjectRef.current.value,
			content: editorState.getCurrentContent().getPlainText(),
			isRead: false,
		}

    fetch(`${firebaseUrl}/${receiverName}/inbox.json`, {
			method : "POST",
			body : JSON.stringify(receiverMessage)
		})
		.then(response => {
			return response.json()
		})
		.then(data => {
      const receiverData = {...receiverMessage, id:data.name};
      dispatch(mailActions.addInboxMail(receiverData));
			// console.log(data,"data")
      alert("Mail sent succesfully")
		})
  };


  return (
    <Form onSubmit={SubmitHandler}>
      <Card
        style={{
          width: "90%",
          padding: "2rem",
          marginLeft: "5rem",
          marginTop: "2rem",
        }}
      >
        <Card.Title className="fw-bold">
          Compose Email
        </Card.Title>
        <FloatingLabel label="To:">
          <FormControl type="Email" placeholder="To" ref={toEmailRef} />
        </FloatingLabel>
        <FloatingLabel label="Subject">
          <FormControl type="text" placeholder="Subject" ref={subjectRef} />
        </FloatingLabel>
        <Card.Body>
          <strong>Compose Email</strong>
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
        </Card.Body>
        <Button type="submit">
          Send
        </Button>
      </Card>
    </Form>
  );
};

export default ComposeMail;
