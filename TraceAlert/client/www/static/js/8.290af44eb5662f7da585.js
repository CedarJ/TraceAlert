webpackJsonp([8],{"K+mB":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("SSY3"),n={components:{"app-nav":function(){return e.e(12).then(e.bind(null,"Nu9K"))},"app-header":function(){return e.e(11).then(e.bind(null,"JCuE"))}},data:function(){return{user:{}}},methods:{edit:function(){this.$router.push({path:"/profile"})},signOut:function(){this.$router.push({path:"/"})},getUserInfo:function(){var t=this;Object(i.d)().then(function(s){t.user=s})}},created:function(){this.getUserInfo()}},a={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[e("app-header"),t._v(" "),e("div",{staticClass:"info-wrap w"},[e("div",{staticClass:"info-avatar"},[t._m(0),t._v(" "),e("div",{staticClass:"text"},[t._v(t._s(t.user.firstname)+" "+t._s(t.user.surname))])]),t._v(" "),e("div",{staticClass:"info-item"},[e("i",{staticClass:"el-icon-date"}),t._v(" "),e("span",[t._v(t._s(t.user.dateOfBirth))])]),t._v(" "),e("div",{staticClass:"info-item"},[e("i",{staticClass:"el-icon-mobile-phone"}),t._v(" "),e("span",[t._v(t._s(t.user.phone))])]),t._v(" "),e("div",{staticClass:"info-item"},[e("i",{staticClass:"el-icon-message"}),t._v(" "),e("span",[t._v(t._s(t.user.email))])]),t._v(" "),e("div",{staticClass:"info-item"},[e("i",{staticClass:"el-icon-location-outline"}),t._v(" "),e("span",[t._v(t._s(t.user.city))])]),t._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:t.edit}},[t._v("Edit")]),t._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:t.signOut}},[t._v("Sign Out")])],1),t._v(" "),e("app-nav")],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"image"},[s("img",{attrs:{src:"static/avatar.png",alt:""}})])}]};var r=e("C7Lr")(n,a,!1,function(t){e("wf7u")},"data-v-10df4f06",null);s.default=r.exports},wf7u:function(t,s){}});
//# sourceMappingURL=8.290af44eb5662f7da585.js.map