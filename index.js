const stripe = Stripe('pk_test_51O88qKKKvMgHeT1chyCPCOP9aYnET99uiPvBLvZzvZ0N731nUgmHuquLBkrsm3cMFUS3BQmTjatzvcA3FiZvz6xH00JXQW968D');
const elements = stripe.elements();
const card = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4'
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  });
  card.mount('#card-element');
  const form = document.getElementById('payment-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
    });
  
    if (error) {
      // Muestra los errores en el navegador
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      // Envia el paymentMethod.id a tu servidor para el proceso de pago
      const paymentMethodId = paymentMethod.id;
      // Aquí debes hacer una solicitud a tu backend
    }
  });
  fetch('/ruta-para-procesar-pago', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment_method_id: paymentMethodId,
    }),
  })
  .then((response) => response.json())
  .then((result) => {
    // Maneja el resultado aquí (incluyendo el manejo de errores del servidor)
  });

  
      