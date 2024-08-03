import Logo from "../../assets/images/logo_anime.png";
import "./Title.css";

function Title() {
  return (
    <div className="container-title">
      <img className="image-logo" src={Logo} alt="" />
    </div>
  );
}

export default Title;
