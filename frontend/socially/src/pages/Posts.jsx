import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCards from "../components/PostCards";
import { useStoreContext } from "../context/storeContext";
import { usePostContext } from "../context/postContext";

function HomePage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { fetchPosts } = useStoreContext();
  const { addDum } = usePostContext();
  const { posts } = useStoreContext();

  function receiveImage(img, caption) {
    addDum(img, caption, groupId); // Update state correctly
  }

  useEffect(() => {
    fetchPosts(groupId);
  }, []); // Runs when `dum` updates

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white size-11/12 flex flex-col h-screen">
        <Header />

        <div className="flex-1 flex flex-col items-center bg-indigo-100 rounded-xl overflow-y-auto p-4">
          <div className="flex flex-cols">
            <div>
              {posts.map((d, index) => (
                <div className="mb-4">
                  <PostCards key={index} pData={d} />
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
