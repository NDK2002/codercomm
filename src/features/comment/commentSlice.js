import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
  isLoading: false,
  error: null,
  commentsById: {},
  commentsByPost: {},
  currentPageByPost: {},
  totalCommentsByPost: {},
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    getCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, comments, count, page } = action.payload;
      comments.forEach(
        (comment) => (state.commentsById[comment._id] = comment)
      );
      state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse();
      state.totalCommentsByPost[postId] = count;
      state.currentPageByPost[postId] = page;
    },
    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, reactions } = action.payload;
      state.commentsById[commentId].reactions = reactions;
    },
    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { post, _id } = action.payload;
      state.commentsById[_id] = null;
      state.commentsByPost[post] = state.commentsByPost[post].filter(
        (item) => item !== _id
      );
    },
  },
});

export default slice.reducer;

export const createComment =
  ({ postId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post("/comments", {
        content,
        postId,
      });
      dispatch(slice.actions.createCommentSuccess(response.data));
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const getComments =
  ({ postId, page = 1, limit = COMMENTS_PER_POST }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        page: page,
        limit: limit,
      };
      const response = await apiService.get(`/posts/${postId}/comments`, {
        params,
      });
      dispatch(
        slice.actions.getCommentSuccess({ ...response.data, postId, page })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const sendCommentReaction =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      dispatch(
        slice.actions.sendCommentReactionSuccess({
          commentId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const deleteComment = (commentId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/comments/${commentId}`);
    dispatch(
      slice.actions.deleteCommentSuccess({ ...response.data, commentId })
    );
    toast.success("Comment deleted successfully!");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};
