import login from "../../../../pages/login";
import background from "../../../img/black.jpg";

const loginStyle = {
  backgroundPage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    marginTop: "0px",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
  },
  "card-header": {
    display: "flex",
    justifyContent: "space-between",
  },

  "card-header__title": {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "500",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  "card-header__detail": {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "0",
    marginBottom: "0",
  },
  cardFooter: {
    justifyContent: "center",
  },
};
export default loginStyle;
