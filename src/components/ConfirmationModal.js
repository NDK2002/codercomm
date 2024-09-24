import { LoadingButton } from "@mui/lab";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

export default function DeleteConfirmation({
  title,
  openConfirmModal,
  handleCloseConfirmModal,
  deleteAction,
}) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleDelete = () => {
    handleCloseConfirmModal();
    deleteAction();
  };

  const handleCancel = () => {
    handleCloseConfirmModal();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openConfirmModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openConfirmModal}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {`Delete ${title}`}
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {`Are you sure you want to delete this ${title}?`}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              onClick={handleDelete}
              sx={{
                width: "100%",
                padding: "6px",
                textTransform: "capitalize",
                fontWeight: 500,
                fontSize: "1.1rem",
                borderRadius: 0,
                boxShadow: "none",
                "&.MuiLoadingButton-root:hover": {
                  boxShadow: "none",
                },
              }}
            >
              {" "}
              Delete
            </LoadingButton>

            <Button
              disableRipple
              fullWidth
              onClick={handleCancel}
              sx={{
                padding: "10px",
                color: "black",
                textTransform: "capitalize",
                fontSize: "1.1rem",
                "&.MuiButton-root:hover": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              }}
            >
              {" "}
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
