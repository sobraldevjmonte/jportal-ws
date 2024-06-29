const multer = require("multer");

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
			cb(null, "../../api_durafixadm/prof/static/img_produtos");
            cb(null, "../../api_durafix/prof/static/img_produtos");
            //cb(null, './img/anexos_vendas')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
            //cb(null, Date.now().toString() + "_" + file.originalname);
        },
    }),
});