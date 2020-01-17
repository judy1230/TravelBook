# Project
<h3>TravelBook</h3>


# Getting Start
<pre><code>
[~/] $ git clone https://github.com/judy1230/expense_recorder.git
[~/] $ npm i express
[~/] $ npm run dev
</pre></code>
<p>open browser with http://localhost:3000/</p>
<p>default account/password: root@example.com/12345678, user1@example.com/12345678 </p>

#User Story
<ul>//一般使用者
<li>user可以在網頁中找到所在地的熱門景點 (目前只有台北縣市)</li>
<li>user可以在網頁中找到所在地的熱門餐廳  (目前只有台北縣市)</li>
<li>user可以在網頁中找到所在地的熱門購物 伴手禮名店 (目前只有台北縣市)</li>
<li>user可從收藏頁面中找到目前收藏的項目並顯示的所需路程時間</li>
<li>user可從每個餐廳/ 景點/  購物 伴手禮名店 顯示目前營業中/ 休息中 等開放狀態</li>
<li>user可從每個餐廳/ 景點/  購物 伴手禮名店 顯示評價星等</li>
</ul>
<ul>//會員功能
<li>member 可以新增行程</li>
<li>member 可以修改行程</li>
<li>member 可以刪除行程</li>
<li>member可評論餐廳/  景點 /  購物 伴手禮名店 </li>
<li>member可收藏餐廳 /  景點 /  購物  伴手禮名店 </li>
<li>member可 收藏/取消收藏 餐廳/  景點 /   購物 伴手禮名店 </li>
<li>member可在profile頁面中檢視已加入收藏的項目</li>
<li>member可透過景點/  餐廳 /  購物 伴手禮名店 規劃行程按鈕加入行程 </li>
<li>member 可透過 預設的行程規劃結果加以修改 起程時間, 地點</li>
<li>member可透過 預設的行程規劃結果 儲存行程</li>
<li>member可編輯已儲存的行程</li>
<li>member可刪除已儲存的行程</li>
<li>member可在profile頁面中檢視已儲存的行程</li>
<li>member可在 profile頁面中檢視已儲存的行程 中 所用的到景點/ 餐廳/  購物 伴手禮名店 </li>
</ul>


# Features
|                               |                   Description               | 相關資料:               |
| -------------------------------------|-------------------------------------------- |----------------------------------------|
| /restaurants, /attractions, /shops   |         首頁顯示台北縣市的景點/餐廳/ 購物 名店 |restaurants(/attractions/shops).handlebars,  controllers/tourControl.getRestaurants(getAttractions/getShops)|
| /restaurant, /attraction, /shop      |   景點/餐廳/ 購物 名店 詳細資料|restaurant(/attraction/shop).handlebars,  controllers/tourControl.getRestaurant(/getAttraction/getShop)|                                                                                            
| /favorites   |         顯示會員已收藏的項目 |favorites.handlebars, controllers/user.getFavorites  |                      
|get /restaurants(/attractions/shops/)/:rest_id(/:attraction_id/:shop_id)/favorite/| 會員收藏項目 | controllers/userControl.addFavoriteRest(/addFavoriteAttraction/addFavoriteShop)|
|delete /restaurants(/attractions/shops/)/:rest_id(/:attraction_id/:shop_id)/favorite/| 會員取消收藏項目 | controllers/userControl.removeFavoriteRest(/removeFavoriteAttraction/removeFavoriteShop)                        
|get /users/:rest_id(/:attraction_id/:shop_id)/restaurant(/attraction/shop)/component| 會員規劃項目 | restaurants(/attractions/shops, restaurant/attraction/shop).handlebars, controllers/userControl.addRestComponent(/addAttractionComponent/addShopComponent)|
|delete /users/:rest_id(/:attraction_id/:shop_id)/restaurant(/attraction/shop)/component| 會員取消規劃項目 | restaurants(/attractions/shops, restaurant/attraction/shop).handlebars, controllers/userControl.removeRestaurantComponent(/removeAttractionComponent/removeShopComponent)                        
|put /users/:rest_id(/:attraction_id/:shop_id)/restaurant(/attraction/shop)/component| 會員些改規劃項目stayTime | /views/dailytour.handlebars, controllers/userControl.putRestComponent(/putAttractionComponent/putShopComponent)|
| /dailytour   |         會員加入欲規劃的項目按下規劃行程按鈕平台會顯示規劃好的行程 |views/dailyTour.handlebars, controllers/calculate  | 
| /users/id/profile   |         會員個人頁面 |views/profile.handlebars, controllers/userController.getProfile  | 
| /users/id/profile/Edit( in Progress)   |         編輯會員個人頁面 || 
| /users/id/( in Progress)   |         編輯會員個人頁面 || 
# Authors
  <li>Judy</li> <p>first edited on 10/07/2019</p>
