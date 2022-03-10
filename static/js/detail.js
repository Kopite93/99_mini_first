$(document).ready(function () {
  show_detail();
  show_review();
});

function show_detail() {
  if (localStorage.getItem("key")) {
    let lastData = localStorage.getItem("key");
    $.ajax({
      type: "GET",
      url: "/store",
      data: {},
      success: function (response) {
        let rows = response["stores_list"];
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["name"] === name) {
            let name = rows[i]["name"];
            let address = rows[i]["address"];
            let store_img = rows[i]["img"];
            let menu = rows[i]["menu"];
            let temp_html = `<div class="main-list">
                              <div class="img"
                                style="background-image: url('${store_img}');">
                              </div>
                              <div class="restaurant-menu">
                                <div class="detail-info">
                                  <div id ="restaurant_info">
                                    <p>식당이름 : ${name}</p>
                                    <p>위치, 주소 : ${address}</p>
                                  </div>
                                  <div id="menu_list">
                                  </div>
                                </div>
                              </div>
                            </div>`;
            $("#food-board").append(temp_html);

            for (let j = 0; j < menu.length; j++) {
              let name_menu = menu[j][0];
              let price_menu = menu[j][1];

              let list_html = "";

              if (lastData === price_menu) {
                list_html += `<p class="red">${name_menu} : ${price_menu}</p>`;
              } else {
                list_html += `<p>${name_menu} : ${price_menu}</p>`;
              }
              $("#menu_list").append(list_html);
            }
          }
        }
      },
    });
  }
}

function get_query() {
  var url = document.location.href;
  var qs = url.substring(url.indexOf("?") + 1).split("&");
  for (var i = 0, result = {}; i < qs.length; i++) {
    qs[i] = qs[i].split("=");
    result[qs[i][0]] = decodeURIComponent(qs[i][1]);
  }
  return result;
}
let name = get_query()["name"];

function review() {
  let review_text = $("#input-content").val();
  $.ajax({
    type: "POST",
    url: "/review",
    data: { review_text_give: review_text, name_give: name },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}

function show_review() {
  $.ajax({
    type: "GET",
    url: "/review",
    data: {},
    success: function (response) {
      let rows = response["reviews"];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i]["name"] == name) {
          let review_text = rows[i]["review_text"];
          let temp_html = `<div class="review-box">
                          <div id="post-box" class="review-content">
                            <p>${review_text}</p>
                          </div>
                        </div>`;
          $("#review").append(temp_html);
        }
      }
    },
  });
  
  // function show_detail() {
//   $.ajax({
//     type: "GET",
//     url: "/store",
//     data: {},
//     success: function (response) {
//       let rows = response["stores_list"];
//       for (let i = 0; i < rows.length; i++) {
//         if (rows[i]["name"] === name) {
//           let name = rows[i]["name"];
//           let address = rows[i]["address"];
//           let store_img = rows[i]["img"];
//           let menu = rows[i]["menu"];

//           let temp_html = `<div class="main-list">
//                             <div class="img"
//                               style="background-image: url('${store_img}');">
//                             </div>
//                             <div class="restaurant-menu">
//                               <div class="detail-info">
//                                 <div id ="restaurant_info">
//                                   <p>식당이름 : ${name}</p>
//                                   <p>위치, 주소 : ${address}</p>
//                                 </div>
//                                 <div id="menu_list">
//                                 </div>
//                               </div>
//                             </div>
//                           </div>`;
//           $("#food-board").append(temp_html);

//           for (let j = 0; j < menu.length; j++) {
//             let name_menu = menu[j][0];
//             let price_menu = menu[j][1];
//             console.log(menu);
//             let list_html = `<p>${name_menu} : ${price_menu}</p>`;
//             $("#menu_list").append(list_html);
//           }
//         }
//       }
//     },
//   });
// }
