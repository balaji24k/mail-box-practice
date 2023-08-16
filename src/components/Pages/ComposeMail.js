import React, { useState, useRef } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Button, Card, Form, FloatingLabel, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ComposeMail = () => {

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
   
    const receiverEmail = toEmailRef.current.value;
    const receiverName = receiverEmail.split("@")[0];
    const sentMessage = {
      to: toEmailRef.current.value,
      subject: subjectRef.current.value,
      content: editorState.getCurrentContent().getPlainText(),
    };
    // sending data to the outbox
    fetch(`${firebaseUrl}/${userName}/sentbox.json`, {
			method : "POST",
			body : JSON.stringify(sentMessage)
		})
		.then(response => {
			console.log(response);
			toEmailRef.current.value = "";
			subjectRef.current.value = "";
			setEditorState("");
		})
		.catch((error) => {
			console.log(error);
		});
		
    //Sending data to inbox of the user
		const receiverMessage = {
			from: userEmail,
			subject: subjectRef.current.value,
			content: editorState.getCurrentContent().getPlainText(),
			read: false,
		}
    fetch(`${firebaseUrl}/${receiverName}/inbox.json`, {
			method : "POST",
			body : JSON.stringify(receiverMessage)
		})
		.then(response => {
			return response.json()
		})
		.then(data => {
			console.log(data,"data")
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
