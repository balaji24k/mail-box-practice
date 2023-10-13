import React, { useState, useRef } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Button, Card, Form, FloatingLabel, FormControl, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { mailActions } from "../../store/MailSlice";
import useHttp from "../../hooks/useHttp";

const ComposeMail = () => {
  const dispatch = useDispatch();

  const sendRequest = useHttp();

	const userEmail = useSelector(state => state.auth.userEmail);
	const userName = userEmail && userEmail.split("@")[0];

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const toEmailRef = useRef();
	const subjectRef = useRef();

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const [isLoading, setIsLoading] = useState(false);

	const SubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const receiverEmail = toEmailRef.current.value;
      const subject = subjectRef.current.value;
  
      const receiverName = receiverEmail.split("@")[0];
  
      toEmailRef.current.value = "";
      subjectRef.current.value = "";
      setEditorState("");
  
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth()+1; // +1 Because Months are 0-indexed
      const day = dateObj.getDate();
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
  
      const date = {day,month,year};
      const time = {hours, minutes};
  
      // sending to sentbox
      const sentMessage = {
        date : date,
        time : time,
        toMail : receiverEmail,
        to: receiverName,
        subject: subject,
        content: editorState.getCurrentContent().getPlainText(),
      };
      // custom hook
      const data = await sendRequest({
        endPoint : `${userName}/sentbox`,
        method : "POST",
        body : sentMessage,
      });
      // console.log(data, "after post")
      const sentData = { id : data.name, ...sentMessage}
      dispatch(mailActions.addSentboxMail(sentData));
  
      //Sending data to inbox of the user
      const receiverMessage = {
        date : date,
        time : time,
        from: userName,
        fromMail : userEmail,
        subject: subject,
        content: editorState.getCurrentContent().getPlainText(),
        isRead: false,
      }
  
      // custom hook
      await sendRequest({
        endPoint : `${receiverName}/inbox`,
        method : "POST",
        body : receiverMessage,
      });
      setIsLoading(false);
      // console.log(data, "after post")
    } catch (error) {
      console.log(error,"at compose mail");
    }
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
        {isLoading ?   
          <span>
            Sending...
            <Spinner 
              as="span" 
              animation="border" 
              size="sm" 
              role="status" 
              aria-hidden="true"
            />
          </span>
          : 
          'Send'
        }
        </Button>
      </Card>
    </Form>
  );
};

export default ComposeMail;
