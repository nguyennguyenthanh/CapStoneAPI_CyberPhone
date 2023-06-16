import Api from "../services/api.js";
import Phone from "../models/phone.js";
import { CustomModal } from "./utils.js";
import Validation from "./../models/validation.js";

const api = new Api();
const validate = new Validation();
let phoneUpdateId = null;
const getEle = (id) => document.getElementById(id);

const renderUI = (data) => {
  let content = "";
  if (data && data.length > 0) {
    data.forEach((phone) => {
      content += `
      <tr>
        <td>${phone.id}</td>
        <td><strong>${phone.name}</strong></td>
        <td>${phone.price}</td>
        <td style="text-align: center">
            <img width="150" height="150" src="${phone.img}" alt="" />
        </td>
        <td>${phone.desc}</td>
        <td class="style="text-align: center">
          <button id='btnEdit' class="btn my-3 me-1" data-bs-toggle="modal"
              data-bs-target="#exampleModal" onclick="editPhone('${phone.id}')">Edit <i class="fa-solid fa-pen-to-square"></i></button>
          <button id='btnDelete' class="btn" onclick="removePhone('${phone.id}')">Delete <i class="fa-solid fa-trash"></i></button>
        </td>
    </tr>
    `;
    });
  }
  getEle("tbodyPhone").innerHTML = content;
};

const getInforPhone = () => {
  let name = getEle("phoneName").value;
  let price = getEle("price").value;
  let screen = getEle("screen").value;
  let backCamera = getEle("backCamera").value;
  let frontCamera = getEle("frontCamera").value;
  let img = getEle("image").value;
  let desc = getEle("description").value;
  let type = getEle("brand").value;

  let isValid = true;

  isValid &=
    validate.kiemTraRong(name, "tbPN", "(*) Vui lòng nhập tên") &&
    validate.kiemTraDoDaiKiTu(
      name,
      "tbPN",
      "(*) Vui lòng nhập 2-10 kí tự",
      2,
      10
    );

  isValid &= validate.kiemTraRong(price, "tbPrice", "(*) Vui lòng nhập giá");

  isValid &=
    validate.kiemTraRong(screen, "tbScreen", "(*) Vui lòng nhập màn hình") &&
    validate.kiemTraDoDaiKiTu(
      screen,
      "tbScreen",
      "(*) Vui lòng nhập 2-10 kí tự",
      2,
      10
    );

  isValid &=
    validate.kiemTraRong(backCamera, "tbBC", "(*) Vui lòng nhập camera sau") &&
    validate.kiemTraDoDaiKiTu(
      backCamera,
      "tbBC",
      "(*) Vui lòng nhập 2-10 kí tự",
      2,
      10
    );

  isValid &=
    validate.kiemTraRong(
      frontCamera,
      "tbFC",
      "(*) Vui lòng nhập camera trước"
    ) &&
    validate.kiemTraDoDaiKiTu(
      frontCamera,
      "tbFC",
      "(*) Vui lòng nhập 2-10 kí tự",
      2,
      10
    );

  isValid &= validate.kiemTraRong(img, "tbIL", "(*) Vui lòng nhập hình");
  isValid &=
    validate.kiemTraRong(desc, "tbDescription", "(*) Vui lòng nhập mô tả") &&
    validate.kiemTraDoDaiKiTu(
      desc,
      "tbDescription",
      "(*) Vui lòng nhập 2-1000 kí tự",
      2,
      1000
    );

  isValid &= validate.kiemTraLoai("brand", "tbBrand", "(*) Vui lòng chọn loại");

  if (!isValid) {
    return null;
  }

  const phone = new Phone(
    "",
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  return phone;
};

const getListPhone = () => {
  api
    .callApi("PhoneStore", "get", null)
    .then((result) => renderUI(result))
    .catch((err) => console.log(err));
};
getListPhone();

const addPhone = () => {
  let phone = getInforPhone();
  if (!phone) return;

  api
    .callApi("PhoneStore", "post", phone)
    .then(() => {
      getListPhone();
      CustomModal.alertSuccess("Add phone successfully");
      document.getElementsByClassName("close")[0].click();
    })
    .catch((err) => console.log(err));
};

const editPhone = (id) => {
  getEle("btnAddPhone").style.display = "none";
  getEle("btnUpdate").style.display = "block";
  api
    .callApi(`PhoneStore/${id}`, "get", null)
    .then((phone) => {
      getEle("phoneName").value = phone.name;
      getEle("price").value = phone.price;
      getEle("screen").value = phone.screen;
      getEle("backCamera").value = phone.backCamera;
      getEle("frontCamera").value = phone.frontCamera;
      getEle("description").value = phone.desc;
      getEle("brand").value = phone.type;
      phoneUpdateId = phone.id;
    })
    .catch((err) => console.log(err));
};
window.editPhone = editPhone;

const removePhone = async (id) => {
  const result = await api.callApi(`PhoneStore/${id}`, "delete", null);
  let res = await CustomModal.alertDelete(
    `This phone will be deleted, you can't undo this action`
  );
  if (res.isConfirmed) {
    getListPhone(result);
    CustomModal.alertSuccess(`Delete phone successfully`);
    document.getElementsByClassName("close")[0].click();
  }
};
window.removePhone = removePhone;

getEle("btnAddPhone").onclick = function () {
  addPhone();
};

getEle("btnAdd").onclick = function () {
  getEle("btnAddPhone").style.display = "block";
  getEle("btnUpdate").style.display = "none";
  document.getElementById("modal__form").reset();
};

getEle("btnUpdate").onclick = function () {
  const phone = getInforPhone();
  api
    .callApi(`PhoneStore/${phoneUpdateId}`, "put", phone)
    .then(() => {
      getListPhone();
      CustomModal.alertSuccess("Add phone successfully");
      document.getElementsByClassName("close")[0].click();
    })
    .catch((err) => console.log(err));
};

const searchPhoneByName = async (phoneName) => {
  try {
    const phones = await api.callApi(`PhoneStore`, "get", null);
    const filterPhones = phones.filter((phone) =>
      phone.name.toLowerCase().includes(phoneName.toLowerCase())
    );
    renderUI(filterPhones);
  } catch (err) {
    console.log(err);
  }
};

getEle("searchButton").addEventListener("click", () => {
  const searchInput = getEle("searchInput").value;
  const phoneName = searchInput;

  if (phoneName.trim() !== "") {
    searchPhoneByName(phoneName);
  }
});

getEle("searchInput").addEventListener("keyup", () => {
  const searchInput = getEle("searchInput").value;
  if (searchInput.trim() === "") {
    getListPhone();
  }
});

getEle("default").addEventListener("click", async () => {
  getEle("default").style.display = "none";
  getEle("sortUp").style.display = "inline-block";
  getEle("sortDown").style.display = "none";
  try {
    const result = await api.callApi("PhoneStore", "get", null);
    const sortUp = result.sort((a, b) => b.price - a.price);
    renderUI(sortUp);
  } catch (err) {
    console.log(err);
  }
});

getEle("sortUp").addEventListener("click", async () => {
  getEle("default").style.display = "none";
  getEle("sortUp").style.display = "none";
  getEle("sortDown").style.display = "inline-block";
  try {
    const result = await api.callApi("PhoneStore", "get", null);
    const sortUp = result.sort((a, b) => a.price - b.price);
    renderUI(sortUp);
  } catch (err) {
    console.log(err);
  }
});

getEle("sortDown").addEventListener("click", () => {
  getEle("default").style.display = "inline-block";
  getEle("sortUp").style.display = "none";
  getEle("sortDown").style.display = "none";
  getListPhone();
});
