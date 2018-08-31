import React, { Component } from "react";
import TitleBar from "../TitleBar";
import {Typography} from "@material-ui/core";

class NotFound extends Component {
  render() {
    return (
      <div>
        <TitleBar />
        <Typography variant="display1" gutterBottom>
          404: page not found
        </Typography>
      </div>
    );
  }
}

export default NotFound;
