import RNPaystack from 'react-native-paystack';

export const SetupPayment = (formvalues, cb) => async (dispatch, getState) => {
  console.log('====iside paymentS');
  const {expiry, cardNumber, cvv} = formvalues;
  const result = expiry.split('/');
  const payStackValues = {
    expiryMonth: result[0],
    expiryYear: result[1],
    cvc: cvv,
    cardNumber,
    email: getState().user.email,
    amountInKobo: 50,
    subAccount: '',
  };
  try {
    const {reference} = await RNPaystack.chargeCard(payStackValues);
    /* adding ref ID to phastmoney server */
    console.log(reference);

    cb();
  } catch (error) {
    //console.log(error.response.data);
    // dispatch(showNotification(error.response.data.responseCode, error.response.data.responseMessage))
    dispatch(showNotification('ERR', error.message));

    console.log('====error', error); // error is a javascript Error object
    console.log('====error message', error.message);
    console.log('====error code', error.code);
    cb();
  }
};
