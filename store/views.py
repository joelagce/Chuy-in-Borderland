from django.shortcuts import render
get_object_or_404, redirect
from datetime import datetime
from .models import Product, Category, Ads

# Create your views here.
'''from Apps.cart.cart import Cart
from djando.db.models import Q

def search(request):
    query = request.GET.get('query')


    products =
    Product.objects.filter(parent=None).filter(Q(title__icontains=query)Q(description__icontains=query))

    context = {
        'query': query,
        'products': products,
    }
    return render(request, 'search.html', context)

def product_detil (request, category_slug, slug):
    product = get_object_or_404(Product, slug=slug)
    product.num_visits = product.num_visits + 1
    product.last_visit = datetime.now()
    product.save()

    related_products = list(product.category.products.filter(parent=None).exclude(id=product.id))
     if len(related_products) >=3:
     related_products = random.sample(related_products, 3)

     if product.parent:
         return redirect ('product_detail',category_slug=category_slug,slug=product.parent.slug)

    imagesstring = "{'thumbnail': '%', 'image': '%'}," % (product.thumbnail.url, product.image.url)

    for image in product.images.all():
        imagesstring = imagesstring + ("{'thumbnail': '%', 'image': '%'}," % (product.thumbnail.url, product.image.url))

        cart = Cart(request)

        if cart.has_product(product.id):
            product-in_cart = True
        else:
            product.in_cart = False

        context = {
            'product': product,
            'imagesstring': imagesstring,
            'related_products': related_products

        }

        return render (request, 'view.html', context)

def category_detail(request, slug):
    category = get_object_or_404(Category,slug=slug)
    products = category.products.filter(parent=None)
    ads = category.ads.all()


    context = {
        'category': category,
        'products': products.
        'ads': ads

    }
    return render (request, 'category_detail.html',context) 
'''


         