import { copyImageToClipboard } from "copy-image-clipboard";
import ModalImage from "react-modal-image";
import config from "../../config";

const PromotedImages = ({ promotedBlog }) => {
  return (
    <div className="col-sm-12">
      <div className="row">
        {promotedBlog.image_urls &&
          promotedBlog.image_urls.split(",").map((item, i) => (
            <div className="col m-2" key={i}>
              <ModalImage
                // small={`/images/blogImages/${initiative}/${item}`}
                small={`${config.API_ENDPOINT}/images/${item}`}
                large={`${config.API_ENDPOINT}/images/${item}`}
                alt={item}
              />
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  copyImageToClipboard(`${config.API_ENDPOINT}/images/${item}`)
                    .then(() => {
                      console.log("Image Copied");
                    })
                    .catch((e) => {
                      console.log("Error: ", e.message);
                    });
                }}
              >
                Copy
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
export default PromotedImages;
