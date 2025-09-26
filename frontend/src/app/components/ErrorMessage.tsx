import { Message, MessageHeader } from "semantic-ui-react";

export default function ErrorMessage({ error }: { error: Error | boolean | null }) {
  if (typeof error == "boolean") {
    return (
      !error && (
        <Message size="big" negative>
          <MessageHeader>Oops!</MessageHeader>
          <p>Incorrect number </p>
        </Message>
      )
    );
  } else if (error instanceof Error) {
    return error ? (
      <Message size="big" negative>
        <MessageHeader>Oops!</MessageHeader>
        <p style={{ overflow: "auto" }}>{error.message} </p>
      </Message>
    ) : null;
  }
}
