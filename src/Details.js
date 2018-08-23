/**
 * Created by glazewska on 22/08/2018.
 */
import React, {Component} from "react";
import "./App.css";

class Details extends Component {

  render() {
    return (
      <div className="backdrop">

        {this.props.children}

      </div>
    );
  }
}

export default Details;
