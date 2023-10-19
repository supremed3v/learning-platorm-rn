import multer from "multer";

const storage = multer.memoryStorage();
const singleFile = multer({ storage }).single("file");

export default singleFile;
