$(document).ready(function () {
  show_store();
});
function show_store() {
  $.ajax({
    type: "GET",
    url: "/store",
    data: {},
    success: function (response) {
      console.log(response);
      let rows = response["stores_list"];
      for (let i = 0; i < rows.length; i++) {
        let name = rows[i]["name"];
        let address = rows[i]["address"];
        let store_img = rows[i]["img"];
        let temp_html = `<div class="desc_list" onclick="location.href='/store_desc?name=${name}'">
                          <div class="store_img" style="background-image: url(${store_img});">
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
  $("#list_box").empty();
  let area = $("#area").val();
  let price = $("#price").val();
  localStorage.setItem("key", price);
  if (area === "") {
    alert("현재 위치를 입력해주세요");
  } else {
    if (price === "") {
      alert("원하시는 가격을 입력해주세요");
    } else {
      $.ajax({
        type: "POST",
        url: "/search",
        data: { guname_give: area, price_give: price },
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
  }
}
