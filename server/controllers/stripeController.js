import stripe from "stripe";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const myStripe = stripe(process.env.STRIPE_SECRET_KEY);

export const createConnectAccount = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  try {
    if (!user.stripe_account_id) {
      const account = await myStripe.accounts.create({
        type: "custom",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: req.connection.remoteAddress,
        },
      });

      user.stripe_account_id = account.id;

      await user.save();

      res.status(200).json({
        message: "Stripe account created",
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export const getRequiredFields = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  const account = await myStripe.accounts.retrieve(user.stripe_account_id);

  const required_fields = account.requirements.currently_due;

  res.status(200).json({
    message: "Required fields sent",
    required_fields,
    success: true,
  });
};

export const getAccountStatus = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  const account = await myStripe.accounts.retrieve(user.stripe_account_id);

  console.log("USER ACCOUNT RETRIEVE => ", account);

  // update our local user

  res.status(200).json({
    message: "Account status updated",
    stripe_seller: account,
    success: true,
  });
};

export const sendStripeKey = async (req, res) => {
  res.send(process.env.STRIPE_API_KEY);
};

export const createBankAccount = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  try {
    const bankAccount = await myStripe.accounts.createExternalAccount(
      user.stripe_account_id,
      {
        external_account: {
          object: "bank_account",
          country: "US",
          currency: "usd",
          account_holder_type: "individual",
          routing_number: req.body.routing_number,
          account_number: req.body.account_number,
        },
      }
    );
    await myStripe.accounts.update(user.stripe_account_id, {
      business_type: "individual",
      individual: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: {
          city: req.body.city,
          country: req.body.country,
          line1: req.body.line1,
          postal_code: req.body.postal_code,
          state: req.body.state,
        },
        dob: {
          day: req.body.day,
          month: req.body.month,
          year: req.body.year,
        },
      },
    });

    console.log(bankAccount);

    res.status(200).json({
      message: "Bank account created",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export const createPayout = async (req, res) => {
  const seller = await User.findById(req.body.sellerId).exec();

  try {
    const paymentIntent = await myStripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      payment_method_types: ["card"],
      application_fee_amount: Math.round((req.body.amount * 0.05) / 100), // 5% of the total amount
      transfer_data: {
        destination: seller.stripe_account_id,
      },
    });

    const { client_secret } = paymentIntent;

    res.status(200).json({
      message: "Payout created",
      client_secret,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
