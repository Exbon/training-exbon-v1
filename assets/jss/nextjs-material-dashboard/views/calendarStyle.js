import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb,
} from "assets/jss/nextjs-material-dashboard.js";

const calendarStyle = {
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "0",
    marginBottom: "0",
  },

  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "500",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

export default calendarStyle;
