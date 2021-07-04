function CheckIfLoggedIn() {
  if (
    localStorage.getItem("logged") === "" ||
    localStorage.getItem("logged") === null
  ) {
    return false;
  } else {
    return true;
  }
}

export default CheckIfLoggedIn;
