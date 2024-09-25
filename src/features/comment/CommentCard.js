import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ConfirmationModal from "../../components/ConfirmationModal";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import { deleteComment } from "./commentSlice";

function CommentCard({ comment }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseDelConfirm = () => {
    setOpenConfirmModal(false);
  };

  const commentOptionsMenu = (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleOpenConfirmModal} sx={{ mx: 1 }}>
        Delete
      </MenuItem>
      <ConfirmationModal
        title="comment"
        openConfirmModal={openConfirmModal}
        handleCloseConfirmModal={handleCloseDelConfirm}
        deleteAction={() => dispatch(deleteComment(comment._id))}
      />
    </Menu>
  );

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disable" }}>
            {fDate(comment.createdAt)}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <CommentReaction comment={comment} />
          </Box>
        </Stack>
      </Paper>

      <IconButton aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon sx={{ fontSize: 30 }} />
      </IconButton>
      {commentOptionsMenu}
    </Stack>
  );
}

export default CommentCard;
