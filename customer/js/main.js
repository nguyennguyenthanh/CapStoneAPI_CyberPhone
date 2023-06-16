import { Api } from "../services/phoneServices.js";
import { renderPhoneList, getEle, renderCart } from "../controller/controller.js";
import CartItem from "../model/product.js";
import Phone from "../model/phone.js";

/**
 * RENDER TABLE
 */
var api = new Api();
function fetchPhoneList() {
  var promise = api.callApi("PhoneStore", "GET", null);
  promise.then((function (res) {
    renderPhoneList(res.data);
  })).catch(function (err) {
    console.log(err);
  });
}
fetchPhoneList();

/**
 * FILTER SELECT
 */
function fecthFilter(nameType) {
  var promise = api.callApi("PhoneStore", "GET", null);
  promise.then((function (res) {
    var iphoneType = res.data.filter((phone) => phone.type === nameType);
    renderPhoneList(iphoneType);
  })).catch(function (err) {
    console.log(err);
  });
}
getEle("selectList").addEventListener("change", function () {
  if (getEle("selectList").value === "Apple") {
    fecthFilter("iphone");
  } else if (getEle("selectList").value === "Samsung") {
    fecthFilter("Samsung");
  } else {
    fetchPhoneList();
  }
});
/***
 * ADD CART
 */
//Mảng cart chứa 1 object gồm: {product:name,price,...  ;quantity}
let cart = [];

function btnAddToCart(id) {
  var promise = api.callApi(`PhoneStore/${id}`, "GET", null)
  promise.then((res) => {
    let index = cart.findIndex(item => item.product.id === id);
    //nếu có rồi thì cộng số lượng thêm 1
    //nếu không, tạo 1 đối tượng mới gồm pro và key số lượng=1
    if (index < 0) {
      let newItem = new CartItem(res.data, 1);
      cart.push(newItem);
    } else {
      cart[index].quantity += 1;
    }
    renderCart(cart);
  }).catch((err) => {
    console.log(err);
  })
}
window.btnAddToCart = btnAddToCart;

/****
 * Button Minus
 */
const product = new CartItem();
function btnMinus(id) {
  api.callApi(`PhoneStore/${id}`, "GET", null)
    .then(() => {
      var index = cart.findIndex((item) => item.product.id === id);
      cart[index].quantity -= 1;
      renderCart(cart);
    })
    .catch((err) => {
      console.log(err);
    })
}
window.btnMinus = btnMinus;

/****
 * Button Plus
 */
function btnAdd(id) {
  api.callApi(`PhoneStore/${id}`, "GET", null)
    .then(() => {
      var index = cart.findIndex((item) => item.product.id === id);
      cart[index].quantity += 1;
      renderCart(cart);
    })
    .catch((err) => {
      console.log(err);
    })
}
window.btnAdd = btnAdd;
/**
 * Total price Cart
 */
function totalCart(cart) {
  let sum = 0;
  cart.forEach((cart) => {
    sum += cart.product.price * cart.quantity;
  });
  return sum;
}
window.totalCart = totalCart;

/***
 * SAVE CART TO LOCALSTORAGE
 */
function setLocalStorage() {
  var promise = api.callApi("PhoneStore", "GET", null);
  promise.then((res) => {
    var dataString = JSON.stringify(res.data);
    localStorage.setItem("CART", dataString);
  }).catch((err) => {
    console.log(err);
  });
}
setLocalStorage();
window.setLocalStorage = setLocalStorage;
/***
 * CLEAR CART
 */

getEle("emptyCart").addEventListener("click", () => {
  cart = [];
  renderCart(cart);
});
/**
 * Button Pay Now
 */
getEle("payCart").addEventListener("click", () => {
  cart = [];
  renderCart(cart);
});

/***
 * Remove Product from cart
 */
function btnRemove(id) {
      var index = cart.findIndex((item) => item.product.id === id);
      cart.splice(index, 1);
      renderCart(cart);   
}
window.btnRemove = btnRemove;


