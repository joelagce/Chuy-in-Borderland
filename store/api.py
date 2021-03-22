import json
import stripe

from django.http import jsonResponse
from django.shortcuts import
get_object_or_404, redirect
from django.conf import settings
from Apps.cart.cart import Cart
from Apps.order.utils import checkout

from paypalcheckoutsdk.core import
PayPalHttpClient, SandboxEnvironment
from paypalcheckoutsdk.orders import
OrdersCaptureRequest
from .models import Product
from Apss .order .models import Order
from .utilites import
decrement_product_quantity

def create_checkout_session (request):
    data = json.loads (request.body)

    #

    cart = Cart (request)
    items = []

    for item in cart:
        product = item ['product']

        price = int('product.price * 100')

        obj = {
            'price_data': {
                'currency': 'mxn',
                'product_data': {
                    'name': product.tittle
                },
                'unit_amount': price
            },
            'quantity': item['quantity']
        }

        items.append(obj)
    
    gatewat = data ['gateway']
    session = ''
    order_id = ''
    payment_intent = ''

    if gateway == 'stripe':
        stripe.api.key = 
settings.STRIPE_API_KEY_HIDDEN
        session =
stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=items,
            mode= 'payment',
succes_url='http://127.0.0.1:8000/cart/succes/',

cancel_url='http://127.0.0.1:8000/cart/'
        )
        payment_intent = session.payment_intent
    
    #
    # Create order 

    orderid = checkout (request,
data ['first_name'], data['last_name'],
data['email'], data['address'],
datta['zipcode'], data ['place'])
   
     total_price = 0.00

     for item in cart:
         product = item['product']
         total_price = total_price +
(float(product.price) * int(item['quantity']))

    if gateway == 'razorpray':
        order_amount = total_price * 100
        order_currency = 'INR'
        client = razorpray.Client(auth=
(settings.RAZORPRAY.API.KEY.HIDDEN))
         data = {
             'amount': order_amount,
             'currency': order_currency
         }

         payment_intent =
client.order.create (data=data)
    
    #PayPal

    if gateway == 'paypal':
        order_id = data['order_id']
        environrment =
SandboxEnvironment(client_id=setting-PAYPAL_API_KEY_PUBLISHABLE,
client_secret=setting.PAYPAL_API_KEY_HIDDEN)
        client = PayPalHttpClient(environrment)

        request = 
OrdersCaptureRequest(order_id)
        response = client.execute(request)

        order = Order.objetcts.get(pk=orderid)
        order.paid_amount = total_price



        if response.results.status == 'COMPLETED':
            order.paid = True
            order.payment_intent = order_id
            order.save()
            decrement_product_quantity(order)
            send_order_confirmation(order)
        else:
            order.paid = False
            order.save()
    else:
        order = Order.objects.get(pk=orderid)
        if gateway == 'razorpray':
            order.payment_intent =
payment_intent['id']
        else:
            order.pament_intent = 
payment_intent
        order.paid_amount = total_price

        order.save()
    
    #

    return JsonResponse ({'session': session,'order': payment_intent})





def api_add_to_cart(request):
    data = json.loads(request.body)
    jsonresponse = {'success':True}
    product_id = data['product_id']
    update = data['update']
    quantity = data['quantity']

    cart = Cart(request)

    product = get_object_or_404(product, pk=product_id)

    if not update:
        cart.add(product=product, quantity=1,
        update_quantity=False)
        else:
            cart.add(product=product,
            quantity=quantity, update_quantity=True)

            return JsonResponse(jsonresponse)

def api_remove_from_cart(request):
    data = json.loads(request.body)
    jsonResponse = {'success': True}
    product_id = str(data['product_id'])

    cart = Cart(request)
    cart.remove(product_id)

    return JsonResponse(jsonresponse)    