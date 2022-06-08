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
      Count: 1
    };
  }

  componentDidMount() {
    this.setState({ Count: 2 })
  }

  render() {
    const { Count } = this.state;
    return (
      <Page name="employee-service" noNavbar>
        <ReportRender f7={this.$f7} />
        <div></div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
