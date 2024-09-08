import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import { getPosts } from "./postSlice";

function PostList({ userId }) {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);

  useEffect(() => {
    if (userId) dispatch(getPosts({ userId, page }));
  }, [userId, page, dispatch]);

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
