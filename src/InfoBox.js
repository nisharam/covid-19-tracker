import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

// rfc helps us to create the functional data.
function InfoBox({ title, cases, total,isRed, active, ...props }) {
  // will pass the props as objects which we need to display.
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        {/* title */}
        <Typography color="textSecondary" className="infoBox_title">
          {title}
        </Typography>
        {/*  number of cases */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
        {/* total number of case */}
        <Typography color="textSecondary" className="infoBox_total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
