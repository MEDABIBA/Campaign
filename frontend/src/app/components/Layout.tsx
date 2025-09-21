import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import { Header } from "./Header";
export const Layout = (props: React.PropsWithChildren) => {
  return (
    <Container style={{ margin: "25px" }}>
      <Header />
      {props.children}
    </Container>
  );
};
