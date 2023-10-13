import { createSlice } from "@reduxjs/toolkit";

const initialMails = {
    inboxMails : [],
    sentboxMails : []
}

const MailSlice = createSlice({
    name : "mails",
    initialState : initialMails,
    reducers : {
        addInboxMail(state,action) {
            // console.log(action.payload,"inbox slice");
            state.inboxMails.push(action.payload);
        },
        removeInboxMail(state,action) {
            const updatedInbox = state.inboxMails.filter(
                i => i.id !== action.payload.id
            );
            state.inboxMails = updatedInbox;
        },
        addSentboxMail(state,action) {
            state.sentboxMails.push(action.payload);
        },
        removeSentboxMail(state,action) {
            const updatedSentbox = state.sentboxMails.filter(
                i => i.id !== action.payload.id
            );
            state.sentboxMails = updatedSentbox;
        },
        updateInboxMail (state,action) {
            // console.log(action.payload,"update slice")
            const mail = action.payload;
            const updatedMail = { ...mail, isRead: true };
            const mailIndex = state.inboxMails.findIndex((i) => i.id === mail.id);
            const updatedMails = [...state.inboxMails];
            updatedMails[mailIndex] = updatedMail;
            state.inboxMails = updatedMails;
        },
        replaceInboxMail(state,action) {
            // console.log(action.payload,"replace inbox slice");
            state.inboxMails = action.payload;
        },
        replaceSentboxMail(state,action) {
            // console.log(action.payload,"replace sentbox slice")
            state.sentboxMails = action.payload;
        },
        
    }
});

export const mailActions = MailSlice.actions;

export default MailSlice;