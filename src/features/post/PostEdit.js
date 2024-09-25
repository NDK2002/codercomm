import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Container,
  IconButton,
  Modal,
  Typography,
  alpha,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { FTextField, FUploadImage, FormProvider } from "../../components/form";
import { fDate } from "../../utils/formatTime";
import { editPost } from "./postSlice";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required."),
});

function PostEdit({ post, openPostEdit, handleClosePostEdit }) {
  const [postEditImage, setPostEditImage] = useState(post.image);
  const [uploadedImage, setUploadedImage] = useState("");

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    values: { content: post.content, image: post.image, isSubmitting: false },
  });

  const { handleSubmit, setValue, watch } = methods;

  const isSubmitting = watch("isSubmitting");
  const dispatch = useDispatch();

  const onSubmit = (updatedData) => {
    setValue("isSubmitting", true);
    dispatch(editPost(post._id, updatedData));
    handleClosePostEdit();
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedImage(file);
      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRemovePostImage = () => {
    setValue("image", null);
    setPostEditImage(null);
    setUploadedImage(null);
  };

  return (
    <Modal open={openPostEdit}>
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          maxWidth: "540px",
          backgroundColor: "white",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={post?.author?.avatarUrl}
              alt={post?.author?.name}
              sx={{ width: 50, height: 50 }}
            />
          }
          title={
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              {post?.author?.name}
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary", fontSize: 14 }}
            >
              {fDate(post.updatedAt)}
            </Typography>
          }
          action={
            <IconButton onClick={handleClosePostEdit}>
              <CloseIcon sx={{ fontSize: 34 }} />
            </IconButton>
          }
        />
        <Container spacing={2} sx={{ p: 3 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FTextField
              name="content"
              multiline
              fullWidth
              sx={{
                marginBottom: "10px",
                "& fieldset": {
                  height: "100%",
                  borderWidth: "1px !important",
                  borderColor: alpha("#919EAB", 0.32),
                },
              }}
            />

            {postEditImage ? (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%",
                  position: "relative",
                  "& img": { objectFit: "cover", width: 1, height: 1 },
                }}
              >
                <img src={postEditImage} alt="post" />
                <IconButton
                  onClick={handleRemovePostImage}
                  disableRipple
                  sx={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "white",
                    color: "black",
                    padding: "4px",
                  }}
                >
                  <CloseIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%",
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={handleRemovePostImage}
                  disableRipple
                  sx={{
                    display: uploadedImage ? "flex" : "none",
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "white",
                    color: "black",
                    padding: "4px",
                    zIndex: 2,
                  }}
                >
                  <CloseIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <FUploadImage
                  name="image"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
              </Box>
            )}

            <Box sx={{ marginTop: "14px" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="small"
                loading={isSubmitting}
                sx={{
                  width: "100%",
                  padding: "6px",
                  textTransform: "capitalize",
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Save
              </LoadingButton>
            </Box>
          </FormProvider>
        </Container>
      </Card>
    </Modal>
  );
}

export default PostEdit;
