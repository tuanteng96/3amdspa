import React from "react";
import {
  Link,
  ListInput,
  ListItem,
  Navbar,
  Page,
  Sheet,
  Toolbar,
} from "framework7-react";
import ReportRender from "./ReportRender";
import ToolBarBottom from "../../components/ToolBarBottom";

export default class ReportingDate extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {}

  render() {
    return (
      <Page name="employee-service" noNavbar>
        <ReportRender />
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
