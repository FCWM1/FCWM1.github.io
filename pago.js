// Inicializa Stripe y crea una instancia de Elements
const stripe = Stripe('pk_test_51O88qKKKvMgHeT1chyCPCOP9aYnET99uiPvBLvZzvZ0N731nUgmHuquLBkrsm3cMFUS3BQmTjatzvcA3FiZvz6xH00JXQW968D  '); // Usa tu clave pública de Stripe aquí
const elements = stripe.elements();

// Personaliza tu elemento de Stripe y montalo en el DOM
const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

const card = elements.create('card', { style: style });
card.mount('#card-element');

// Añade un listener para manejar errores en tiempo real
card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

// Maneja el envío del formulario
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Deshabilita el botón de envío para prevenir múltiples clics
  form.querySelector('button').disabled = true;

  // Crea un PaymentMethod y captura el id para enviarlo al servidor
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: card
  });

  if (error) {
    // Informa al usuario del error
    document.getElementById('card-errors').innerText = error.message;
    
    // Re-habilita el botón de envío si el pago falla
    form.querySelector('button').disabled = false;
  } else {
    // Envía el paymentMethod.id a tu servidor para procesar el pago
    fetch('/ruta-para-procesar-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_method_id: paymentMethod.id
      }),
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(transaction) {
      // Maneja la respuesta del servidor
      if (transaction.error) {
        // Informa al usuario si hay un error
        document.getElementById('card-errors').innerText = transaction.error.message;

        // Re-habilita el botón de envío si el pago falla
        form.querySelector('button').disabled = false;
      } else {
        // La transacción ha sido procesada correctamente
        // Puedes redireccionar al usuario o mostrar un mensaje de confirmación aquí
        console.log('Pago exitoso:', transaction);
      }
    })
    .catch(function(error) {
      // Maneja errores de la red o conexión
      document.getElementById('card-errors').innerText = 'Un error de red ha ocurrido, inténtalo de nuevo.';
      
      // Re-habilita el botón de envío si el pago falla
      form.querySelector('button').disabled = false;
    });
  }
});
