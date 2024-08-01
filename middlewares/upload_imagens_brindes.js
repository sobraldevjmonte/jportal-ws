const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
			cb(null, "../../../projetos_react/jporta2024git/jportal-ws/img/anexos_brindes");
			cb(null, "../../../projetos_react/jporta2024git/jportal-web/public/brindes");
            
			// cb(null, "../../jportal-web/public/brindes");
            //cb(null, "../../api_profissionais/web/static/img_produtos");
        },
        filename: (req, file, cb) => {
            // cb(null, file.originalname);
            cb(null, file.originalname);
        },
    }),
});