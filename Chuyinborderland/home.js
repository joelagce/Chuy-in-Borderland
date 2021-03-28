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
       /* var data = {
          'first_name': this.first_name,
          'last_name': this.last_name,
          'email': this.email,
          'address': this.address,
          'zipcode': this.zipcode,
          'place': this.place
        };
     
       
        fetch('/api/create_checkout_session/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
        
     })
       .then(function(response){
         return response.json()

       })
       .then(function(session){
       return stripe.redirectToCheckout({ sessionId: session.session.id})

      })
        .then(function(result){
          if(result.error){
            alert(result.error.message)
          }
        })
        .catch(function(error){
          console.log('error:', error);

        });
      



  },*/
      incrementQuantity(product_id, quantity, price) {
        console.log('Product_id', product_id);

        for(var i = 0; i < this.products.length; i++) {
          var product = this.products[i];

          if(product.id === product_id){
            if(quantity < product.num_available){
              var data = {
                'product_id': product_id, 
                'update': true,
                'quantity': parseInt(quantity) + 1
              };
              console.log(price);
       
      store.commit('increment', 1);
      store.commit('changeTotalCost', parseFloat(price));


        fetch('/api/add_to_cart/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)

         })
         .then((response) => {

         console.log(response);

         for (var i = 0; i < this.products.length; i++) {
          var product = this.products[i];

          if (product.id === product_id) {
              this.products[i].quantity = parseInt(this.products[i].quantity) + 1;
              this.products[i].total_price = parseInt(this.products[i].quantity) * parseFloat(this.products[i].price)
          }
      }

             
           

           
         })
         .then((result) => {
           if(result) {
             console.log('Added to cart');
           }
         })
         .catch(function (error) {
          console.log('Error 2');
          console.log(error);
      })
            } else {
              alert('No more avaible in stock');
                
            }
          
          }
         
        }

       
      
      
      }, 
      decrementQuantity(product_id, quantity,price) {
        console.log('Product_id', product_id);

        var data = {
          'product_id': product_id, 
          'update': true,
          'quantity': parseInt(quantity) - 1
      };

     
      
      if (parseInt(quantity) -1 == 0){
        this.removeFromCart(product_id);
      }
      else {

        store.commit('increment', -1);
        store.commit('changeTotalCost', -parseFloat(price));
      

        fetch('/api/add_to_cart/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)

         })
         .then((response) => {

         console.log(response);

         for (var i = 0; i < this.products.length; i++) {
          var product = this.products[i];

          if (product.id === product_id) {
              this.products[i].quantity = parseInt(this.products[i].quantity) - 1;
              this.products[i].total_price = parseInt(this.products[i].quantity) * parseFloat(this.products[i].price)
          }
      }

             
           

           
         })
         .then((result) => {
           if(result) {
             console.log('Added to cart');
           }
         })
         .catch(function (error) {
          console.log('Error 2');
          console.log(error);
      })
    }
      }, 
      removeFromCart(product_id){
       console.log('Product_id', product_id);

       var data = {
        'product_id': product_id
        
    };

       fetch('/api/remove_from_cart/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': '{{ csrf_token }}'
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)

       })
       .then((response) => {
         console.log(response)
         this.products = this.products.filter(product => product.id !== product_id)
       })
       
       .catch(function (error) {
        console.log('Error 2');
        console.log(error);
    })
      }
    }

 });
