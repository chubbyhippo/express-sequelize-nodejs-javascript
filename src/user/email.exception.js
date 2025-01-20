class EmailSendingFailedException extends Error {
  constructor(message = 'emailSentFailed') {
    super(message);
  }
}

export default EmailSendingFailedException;
