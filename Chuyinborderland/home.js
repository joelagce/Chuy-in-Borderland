var productapp = new Vue({
    el: '#cartapp',
      delimiters: ['[[', ']]'],
      store: store,
      data () {
        return  {
          errors: [],
          first_name: '{{ first_name }}',
          last_name: '{{ last_name }}',
          email: '{{ email }}',
          products: [{{ productsstring|safe }}]

        }
      },
    mounted() {
        el: '#cartapp',
        delimiters: ['[[', ']]'],
        store: store,
        data () {
          return  {
            errors: [],
            first_name: '{{ first_name }}',
            last_name: '{{ last_name }}',
            email: '{{ email }}',
            products: [{{ productsstring|safe }}]
  
          }
        },
  const amount = this.totalCost.toString();
  
          paypal.Buttons({
              onClick: () => {
                  if (this.validateForm() > 0) {
                      return false;
                  }
              },
              createOrder: function(data, actions) {
                  return actions.order.create({
                      purchase_units: [{
                          amount: {
                              value: amount
                          }
                      }]
                  })
              },
              onApprove: (data, actions) => {
                  const formdata = {
                      'first_name': this.first_name,
                      'last_name': this.last_name,
                      'email': this.email,
                      'address': this.address,
                      'zipcode': this.zipcode,
                      'place': this.place,
                      'gateway': 'paypal',
                      'order_id': data.orderID
                  };
  
                  return actions.order.capture().then(function(details) {
                      fetch('/api/create_checkout_session/', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'X-CSRFToken': '{{ csrf_token }}'
                          },
                          credentials: 'same-origin',
                          body: JSON.stringify(formdata)
                      })
                      .then(function(response) {
                          return response.json()
                      })
                      .then(function(result) {
                          window.location.href = '/cart/success/';
                      })
                      .catch(function(error) {
                          console.log('error:', error);
                      });
                  });
              }
          }).render('#paypal-button-container');
    }
})
