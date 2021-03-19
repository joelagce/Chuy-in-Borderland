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
    },
    computed: {
        numItems: function() {
         return store.state.numItems
        },
        totalCost: function(){
          return store.state.totalCost
        }
      },
     
      methods: {
        validateForm() {
          this.errors = [];

          if (this.first_name === '') {
              this.errors.push('First name is empty');
          }

          if (this.last_name === '') {
              this.errors.push('Last name is empty');
          }

          if (this.email === '') {
              this.errors.push('Email is empty');
          }

          if (this.address === '') {
              this.errors.push('Address is empty');
          }

          if (this.zipcode === '') {
              this.errors.push('Zip code is empty');
          }

          if (this.place === '') {
              this.errors.push('Place is empty');
          }

          if (this.phone === '') {
              this.errors.push('Phone is empty');
          }

          return this.errors.length;
      },
        buy(gateway) {
          var data = {
              'first_name': this.first_name,
              'last_name': this.last_name,
              'email': this.email,
              'address': this.address,
              'zipcode': this.zipcode,
              'place': this.place,
              'gateway': gateway
          };

          if (this.validateForm() === 0) {
            if (gateway === 'stripe') {
                var stripe = Stripe('{{ pub_key }}');

                fetch('/api/create_checkout_session/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}'
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    return response.json()
                })
                .then(function(session) {
                    return stripe.redirectToCheckout({ sessionId: session.session.id })
                })
                .then(function(result) {
                    if (result.error) {
                        alert(result.error.message)
                    }
                })
                .catch(function(error) {
                    console.log('Error:', error);
                });
              }
            } 

      },
})
