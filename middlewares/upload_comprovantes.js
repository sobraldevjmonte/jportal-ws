const multer = require("multer");

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "../../prof/static/anexos");
            //cb(null, './img/anexos_vendas')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
            // cb(null, Date.now().toString() + "_" + file.originalname);
        },
    }),
    /* fileFilter: (req, file, cb) => {
              const extesaoImg = ["image/png", "image/jpg", "image/jpeg"].find(formatoAceito => formatoAceito == file.mimetype);
              if (extesaoImg) {
                  return cb(null, true);
              }
              return cb(null, false);
          }, */
});