webpackJsonp([1],{"0Q+t":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("SSY3"),c={components:{"app-nav":function(){return n.e(12).then(n.bind(null,"Nu9K"))},"app-header":function(){return n.e(11).then(n.bind(null,"JCuE"))}},methods:{toDetail:function(t){this.$router.push({path:"/vished/detail/"+t})},dateFormat:function(t){return Object(a.b)(Date(t),!0)}},created:function(){var t=this;Object(a.c)().then(function(e){t.contacts=e,console.log(e)})},data:function(){return{contacts:[]}},computed:{totalPeoples:function(){var t=0;return this.contacts.forEach(function(e){t+=e.contact.length}),t}}},s={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("app-header"),t._v(" "),n("div",{staticClass:"vished-wrap w"},[n("h2",[t._v("Places Vished")]),t._v(" "),n("h5",[t._v("since "+t._s(t.dateFormat(new Date)))]),t._v(" "),n("ul",{staticClass:"vished-ul"},t._l(t.contacts,function(e,a){return n("li",{key:a,staticClass:"vished-ul-li",on:{click:function(e){return t.toDetail(a)}}},[n("div",{staticClass:"vished-ul-li-title"},[n("span",[t._v(t._s(e.locationInfo.name))]),t._v(" "),n("span",{staticClass:"vished-ul-li-number"},[t._v(t._s(e.contact.length))])]),t._v(" "),n("p",[t._v("Last time visited: "+t._s(t.dateFormat(e.contact[e.contact.length-1].time)))])])}),0),t._v(" "),n("p",[t._v("Total number of places: "+t._s(t.contacts.length))]),t._v(" "),n("p",[t._v("Total number of people met: "+t._s(t.totalPeoples))])]),t._v(" "),n("app-nav")],1)},staticRenderFns:[]};var o=n("C7Lr")(c,s,!1,function(t){n("2ZAm")},null,null);e.default=o.exports},"2ZAm":function(t,e){}});
//# sourceMappingURL=1.e679e11ad19ed1785054.js.map