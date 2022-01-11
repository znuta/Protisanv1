import RNPaystack from 'react-native-paystack';

export const SetupPayment = (formvalues, cb) => async (dispatch, getState) => {
  console.log('====iside paymentS');
  const {expiry, cardNumber, cvv, amount} = formvalues;
  const result = expiry.split('/');
  const payStackValues = {
    expiryMonth: result[0],
    expiryYear: result[1],
    cvc: cvv,
    cardNumber,
    email: getState().auth.userData.email,
    amountInKobo:amount?amount*100 : 50,
    subAccount: '',
  };

  console.log("__PAYMENT___", payStackValues)

  try {
    const {reference} = await RNPaystack.chargeCard(payStackValues);
    /* adding ref ID to phastmoney server */
    console.log("__CARD___",reference);

    cb(reference);
  } catch (error) {
    //console.log(error.response.data);
    // dispatch(showNotification(error.response.data.responseCode, error.response.data.responseMessage))
    // dispatch(showNotification('ERR', error.message));

    console.log('====error', error); // error is a javascript Error object
    console.log('====error message', error.message);
    console.log('====error code', error.code);
    cb();
  }
};
