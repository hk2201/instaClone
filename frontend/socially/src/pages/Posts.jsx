import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCards from "../components/PostCards";

function HomePage() {
  const dum = [
    { img: "/images.jpeg" },
    { img: "/images.jpeg" },
    { img: "/images.jpeg" },
  ];
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white size-11/12 flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center bg-indigo-100 overflow-y-auto p-4">
          {dum.map((d, index) => (
            <div className="mb-4">
              <PostCards key={index} img={d.img} />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
