import Header from "../components/Header";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-3xl border-2 size-11/12 flex flex-col">
        <Header />
        <div className="flex-1 bg-indigo-100 flex items-center justify-center">
          YOUR POSTS
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
