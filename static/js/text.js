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
