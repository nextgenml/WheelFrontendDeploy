/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  TextField,
  Box,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import config from "../../config";
import { useState } from "react";
import { customFetch } from "../../API/index.js";
import ModalImage from "react-modal-image";
import { ToastContainer, toast } from "react-toastify";
function ShowBlog({ onClose, currentRow, hideUpdate, getUserData }) {
  const [blog, setBlog] = useState(currentRow.blog);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const onUpdate = async () => {
    const formData = new FormData();
    formData.append("transactionID", currentRow.transactionID);
    formData.append("validatedFlag", currentRow.validated_flag || 0);
    formData.append("paidFlag", currentRow.paid_flag || 0);
    formData.append("promoted", currentRow.promoted || 0);
    formData.append("blog", blog);

    if (images && images.length > 0) {
      Array.from(images).forEach((file, i) => {
        formData.append(`file-${i}`, file, file.name);
      });
    }
    const url = `${config.API_ENDPOINT}/update-blog-data`;
    let response = await customFetch(url, {
      method: "PUT",
      body: formData,
    });

    let res = await response.text();
    let data = JSON.parse(res);
    if (response.ok) {
      notify(data.msg, "success");
      getUserData();
    } else {
      notify(data.msg, "danger");
    }
  };
  const notify = (msg, toastType) => {
    if (toastType === "success") {
      toast.success(msg);
    } else if (toastType === "info") {
      toast.info(msg);
    } else {
      toast.error(msg);
    }
  };
  const onFileUpload = async (e) => {
    setImages(e.target.files);
    let flag = 1;
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if (!e.target.files[i].type.includes("image")) {
        flag = 0;
        notify("Please select valid file!", "error");
      }
      if (Math.round(e.target.files[i].size / 1024) > 500) {
        flag = 0;
        notify("Size is too big!", "error");
      }
      if (flag > 0) {
        images.push(URL.createObjectURL(e.target.files[i]));
      }
      flag = 1;
    }
    setUploadedImages(images);
  };
  return (
    <Dialog
      onClose={() => onClose()}
      open
      PaperProps={{
        style: { width: "1000px", maxWidth: "1000px" },
      }}
    >
      <DialogTitle>Blog Content</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <TextField
            value={blog}
            fullWidth
            multiline
            onChange={(e) => setBlog(e.target.value)}
          />
        </Box>
        <Box>
          <Typography variant="subtitle1">Blog Images</Typography>
          <div className="col-sm-12" sx={{ mb: 3 }}>
            <input
              className="form-control form-control-lg"
              id={`customImage`}
              multiple
              type="file"
              accept="image/*"
              onChange={onFileUpload}
            />
          </div>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {
              <div className="col-sm-12">
                <div className="row">
                  {uploadedImages.length
                    ? uploadedImages.map((item, i) => (
                        <div className="col m-2" key={i}>
                          <ModalImage
                            // small={`/images/blogImages/${initiative}/${item}`}
                            small={`${item}`}
                            large={`${item}`}
                            alt={item}
                          />
                        </div>
                      ))
                    : (currentRow.image_urls || "").split(",").map((item) => {
                        return (
                          <Grid item md={4} sm={12}>
                            <ModalImage
                              // small={`/images/blogImages/${initiative}/${item}`}
                              small={`${config.API_ENDPOINT}/images/${item}`}
                              large={`${config.API_ENDPOINT}/images/${item}`}
                              alt={item}
                            />
                          </Grid>
                        );
                      })}
                </div>
              </div>
            }
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        {!hideUpdate && (
          <Button variant="contained" onClick={onUpdate}>
            Update
          </Button>
        )}
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default ShowBlog;
