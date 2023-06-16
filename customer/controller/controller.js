var getEle = function (id) {
  return document.getElementById(id);
}
export { renderPhoneList, getEle, renderCart };
/**
 * FUNCTION RENDER PHONE LIST
 */
var renderPhoneList = function (phoneArr) {
  var contentPhone = "";
  for (var i = 0; i < phoneArr.length; i++) {
    var ele = phoneArr[i];
    contentPhone += ` 
    <div class="col-lg-3 col-md-6 mb-4">
      <div class="card text-black h-100">
        <div class="content-overlay"></div>
        <img src="./../../img/img-phone/phone-${i}.png" class="card-img" alt="Phone Image" />
        <div class="content-details fadeIn-top">
          <h3 class ='pb-5'>Specifications</h3>
          <div class="d-flex justify-content-start py-1">
              <span class='text-light'><b>Screen:</b></span>
              <span class='text-light'>&nbsp ${ele.screen}</span>
          </div>
          <div class="d-flex justify-content-start py-1">
              <span class='text-light'><b>Back Camera:</b> ${ele.backCamera}</span>
          </div>
          <div class="d-flex justify-content-start py-1">
              <span class='text-light'><b>Front Camera:</b> ${ele.frontCamera}</span>
          </div>
          <p class = 'pt-5'><u>click here for more details</u></p>
      </div>
      <div class="card-body">
        <div class="text-center">
          <h5 class="card-title pt-3">${ele.name}</h5>
          <span class="text-muted mb-2">$${ele.price}</span>
          <span class="text-danger"><s>$${Number(ele.price) + 300}</s></span>
        </div>
        <div class="mt-3 brand-box text-center">
          <span>${ele.type}</span>
        </div>
        <div class="d-flex justify-content-start pt-3">
          <span><b>Description:</b> ${ele.desc}</span>
        </div>
        <div class="d-flex justify-content-between pt-3">
          <div class="text-warning">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
          </div>
          <span class = 'text-success'><b>In Stock</b></span>
        </div>
        <button id="btnAdd" type="button" class="btn btn-block w-50" onclick ="btnAddToCart(${ele.id})">Add to cart</button>
      </div>
    </div>
  </div>`;
  }
  getEle("phoneList").innerHTML = contentPhone;
}


/**
 * RENDER CART
 */
const renderCart = (cart) => {
  let content = '';
  cart.forEach((ele) => {
    content += `<div class="product">
  <div class="product__1">
    <div class="product__thumbnail">
      <img src=${ele.product.img}
        alt="Phone image">
    </div>
    <div class="product__details">
      <div style="margin-bottom: 8px;"><b>${ele.product.name}</b></div>
      <div style="font-size: 90%;">Screen: <span class="tertiary">${ele.product.screen
      }</span></div>
      <div style="font-size: 90%;">Back Camera: <span class="tertiary">${ele.product.backCamera
      }</span></div>
      <div style="font-size: 90%;">Front Camera: <span class="tertiary">${ele.product.frontCamera
      }</span></div>
      <div style="margin-top: 8px;"><a href="#!" onclick ="btnRemove('${ele.product.id
      }')">Remove</a></div>
    </div>
  </div>
  <div class="product__2">
    <div class="qty">
      <span><b>Quantity:</b> </span> &nbsp &nbsp
      <span class="minus bg-dark" onclick ="btnMinus('${ele.product.id}')">-</span>
      <span class="quantityResult mx-2">${ele.quantity}</span>
      <span class="plus bg-dark" onclick ="btnAdd('${ele.product.id}')">+</span>
    </div>
    <div class="product__price"><b>$${ele.quantity * ele.product.price}</b></div>
  </div>
</div>`;
  });
  getEle('cartList').innerHTML = content;

  /**
   * Total Phone
   */
  let cartCount = 0;
  cart.forEach((item) => {
    cartCount += item.quantity;
  });
  const uiTotal = totalCart(cart);
  const shipping = uiTotal > 0 ? 50 : 0;
  getEle('cartCount').innerHTML = cartCount;
  getEle('shipping').innerHTML = '$' + shipping;
  getEle('subTotal').innerHTML = '$' + uiTotal;
  getEle('tax').innerHTML = '$' + Math.floor(uiTotal * 0.1);
  getEle('priceTotal').innerHTML = '$' + Math.floor(uiTotal * 1.1 + shipping);
};
