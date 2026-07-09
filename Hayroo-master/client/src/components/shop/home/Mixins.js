export const isWish = (id, wList) => {
  // Safe guard: If wList is not a valid array, fetch it directly from localStorage
  let list = Array.isArray(wList)
    ? wList
    : localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];

  if (list && Array.isArray(list) && list.includes(id) === true) {
    return true;
  }
  return false;
};

export const isWishReq = (e, id, setWlist) => {
  let list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];
  if (list.length > 0) {
    if (list.includes(id) !== true) {
      list.push(id);
      localStorage.setItem("wishList", JSON.stringify(list));
      if (typeof setWlist === "function") setWlist(list);
    }
  } else {
    list.push(id);
    localStorage.setItem("wishList", JSON.stringify(list));
    if (typeof setWlist === "function") setWlist(list);
  }
};

export const unWishReq = (e, id, setWlist) => {
  let list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];
  if (list.length > 0) {
    if (list.includes(id) === true) {
      list.splice(list.indexOf(id), 1);
      localStorage.setItem("wishList", JSON.stringify(list));
      if (typeof setWlist === "function") setWlist(list);
    }
  }
};

export const nextSlide = (totalImg, slide, setSlide) => {
  if (slide === totalImg - 1) {
    setSlide(0);
  } else if (slide < totalImg) {
    setSlide(slide + 1);
  }
};

export const prevSlide = (totalImg, slide, setSlide) => {
  if (slide === 0) {
    setSlide(totalImg - 1);
  } else if (slide === totalImg - 1) {
    setSlide(0);
  }
};

export const totalCost = () => {
  let total = 0;
  let cart = JSON.parse(localStorage.getItem("cart")) || []; 
  if (cart.length > 0) {
    cart.forEach((item) => {
      total += (item.price || 0) * (item.quantity || item.quantitiy || 0);
    });
  }
  return total;
};