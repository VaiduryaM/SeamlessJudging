function GetCurrSem(currDate, currMonth) {
  // const currDate = new Date().getDate();
  // const currYear = new Date().getFullYear();
  // const currMonth = new Date().getMonth();
  let currSem = "";
  switch (true) {
    case currMonth <= 3:
      currSem = "Spring";
      break;
    case currMonth == 4 && currDate <= 25:
      currSem = "Spring";
      break;
    case currMonth == 4 || currMonth <= 6:
      currSem = "Summer";
      break;
    case currMonth == 7 && currDate <= 25:
      currSem = "Summer";
      break;
    case 7 <= currMonth:
      currSem = "Fall";
      break;
  }
  return currSem;
}
export { GetCurrSem };
