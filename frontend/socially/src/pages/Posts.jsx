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
      <div className="bg-white shadow-xl rounded-3xl border-2 size-11/12 flex flex-col h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center bg-indigo-100 size-11/12 w-full overflow-auto">
          {dum.map((d) => (
            <PostCards img={d.img} />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
