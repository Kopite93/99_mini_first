$(document).ready(function () {
  show_find();
});

function get_query() {
  var url = document.location.href;
  var qs = url.split("?")[1].split("&");
  for (var i = 0, result = {}; i < qs.length; i++) {
    area = qs[i].split("=")[1];
    price = qs[i].split("=")[1];
    result[qs[i].split("=")[0]] = decodeURIComponent(area);
  }
  return result;
}
let guname = get_query()["area"];
let urlprice = get_query()["price"];

function show_find() {
  $.ajax({
    type: "POST",
    url: "/search",
    data: { guname_give: guname, price_give: urlprice },
    success: function (response) {
      let rows = response["final_list"];
      for (let key in rows) {
        let name = key;
        let url = rows[key];
        console.log(key);
        let temp_html = `<div class="desc_list" onclick="location.href='/store_desc?name=${name}'">
                            <div class="store_img" style="background-image: url('${url}');">
                            </div>
                            <div class="store_name">
                            ${name}
                            </div>
                          </div>`;
        $("#list_box").append(temp_html);
      }
    },
  });
}

function getInputValue() {
  let area = $("#area").val();
  let price = $("#price").val();
  $("#list_box").empty();
  if (area == "") {
    alert("현재 위치를 입력해주세요");
  } else {
    if (price == "") {
      alert("원하시는 가격을 입력해주세요");
    } else {
      location.href = "search_desc?area=" + area + "&price=" + price;
    }
  }
}
