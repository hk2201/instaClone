import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import PostCards from "../components/PostCards";

function HomePage() {
  const [dum, setDum] = useState([
    { img: "/images.jpeg" },
    { img: "/images.jpeg" },
    { img: "/images.jpeg" },
  ]);

  function receiveImage(val) {
    setDum((prevDum) => [...prevDum, { img: val }]); // Update state correctly
    console.log("From Posts");
    console.log(val);
  }

  useEffect(() => {
    console.log("Dum updated:", dum);
  }, [dum]); // Runs when `dum` updates

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white size-11/12 flex flex-col h-screen">
        <Header />

        <div className="flex-1 flex flex-col items-center bg-indigo-100 rounded-xl overflow-y-auto p-4">
          <div className="flex flex-cols">
            <div>
              {dum.map((d, index) => (
                <div className="mb-4">
                  <PostCards key={index} img={d.img} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer getImage={receiveImage} />
      </div>
    </div>
  );
}

export default HomePage;
