import Title from "./Title";
import cam from "../assets/camera.png";
import dm from "../assets/send.png";
function Header() {
  return (
    <div className=" rounded-3xl p-3 flex justify-between items-center">
      <div className="size-14">
        <img src={cam} alt="CAMERA" />
      </div>
      <div className="">
        <Title />
      </div>
      <div className="size-12 mx-1">
        <img src={dm} alt="SEND" />
      </div>
    </div>
  );
}

export default Header;
