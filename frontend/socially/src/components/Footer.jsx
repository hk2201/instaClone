import cam from "../assets/camera.png";
import dm from "../assets/send.png";
import logout from "../assets/logout.png";
function Footer() {
  return (
    <div className=" rounded-3xl p-3 flex justify-between items-center">
      <div className="size-12 mx-1">
        <img src={dm} alt="SEND" />
      </div>
      <div className="size-14">
        <img src={cam} alt="CAMERA" />
      </div>

      <div className="size-10 mx-1">
        <img src={logout} alt="LOGOUT" />
      </div>
    </div>
  );
}

export default Footer;
