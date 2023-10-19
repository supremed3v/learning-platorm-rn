import { Router } from "express";
import {
  createBankAccount,
  createConnectAccount,
  createPayout,
  getAccountStatus,
  getRequiredFields,
} from "../controllers/stripeController.js";
import { authCheck, adminCheck } from "../middlewares/auth.js";

const router = Router();

router
  .route("/stripe/create-connect-account")
  .post(authCheck, createConnectAccount);

router.route("/stripe/get-required-fields").get(authCheck, getRequiredFields);
router.route("/stripe/create-bank-account").post(authCheck, createBankAccount);
router.route("/stripe/get-account-status").post(authCheck, getAccountStatus);
router.route("/stripe/create-payment-intent").post(authCheck, createPayout);

export default router;
