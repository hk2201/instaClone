export default function PostCards(props) {
  return (
    <div className="w-full max-w-2xl  bg-white border border-gray-200 rounded-lg size-full">
      <div className="bg-red-200 size-11/12 w-full">
        <img
          src={props.img}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {console.log(props)}
      </div>
      <div>
        <div className="">
          <div>like</div>
          <div>Comment</div>
        </div>
      </div>
    </div>
  );
}
