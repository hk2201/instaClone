import Title from "./Title";
function Header() {
  return (
    <div className=" rounded-3xl p-3 flex justify-between items-center">
      <div>Camera button/icon</div>
      <div className="">
        <Title />
      </div>
      <div>DM Button</div>
    </div>
  );
}

export default Header;
