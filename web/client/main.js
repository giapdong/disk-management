import _ from "lodash";

window.onload = async function () {
  console.log("log in loaded");
  let data = [1, 2, 3];
  data = _.map(data, (item) => item);
  console.log(data);
  console.log("abcden");
};
