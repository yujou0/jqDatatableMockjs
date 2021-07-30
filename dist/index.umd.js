(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DataTable = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  // DEFAULT options
  var DEFAULT = {
    // 表格內容資料
    data: [],
    // 是否顯示自訂筆數
    showPerPage: true,
    // 是否顯示搜尋輸入框
    showSearch: true,
    // 是否顯示總筆數資訊
    showInfo: true,
    // 是否顯示分頁導航
    showPage: true,
    // 初始分頁數
    perPage: 5,
    onEdit: null,
    onDelete: null
  };

  /**
   * Extend object
   * @param {*} target - The target object to extend.
   * @param {*} args - The rest objects for merging to the target object.
   * @returns {Object} The extended object.
   */
  var assign = Object.assign || function assign(target) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if ($.isPlainObject(target) && args.length > 0) {
      args.forEach(function (arg) {
        if ($.isPlainObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            target[key] = arg[key];
          });
        }
      });
    }

    return target;
  };

  var methods = {
    // 更新 TableCRUD 實例
    updateOptions: function updateOptions() {
      var updateOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.init(updateOpt);
    },
    // 動態設置 TableCRUD 選項參數
    setOptions: function setOptions() {
      var setOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = this.options;
      var currentOptions = assign({}, options, $.isPlainObject(setOpt) && setOpt);
      this.updateOptions(currentOptions);
    },

    /**
     * 分頁功能
     * @param {object[]} data
     * @param {string} perPage
     */
    perPage: function perPage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var perPage = arguments.length > 1 ? arguments[1] : undefined;
      var options = this.options; // 每頁顯示幾筆資料

      var pageCount = perPage; //容器，總筆數切成好幾批存放，每批是一組陣列 1~10，11~20，21~30，31~40 ....

      var pageBox = []; // 第幾頁

      var pageIndex = 1;
      var totalPage = Math.ceil(data.length / pageCount); // 分頁欄

      var pageNav = $("<nav id=\"pages\" class=\"\">\n    <a id=\"firstPage\" class=\"page-link\" href=\"#\"> << </a>\n    <a id=\"prev\" class=\"page-link\" href=\"#\"> < </a>\n    <ul\n      id=\"allPage\"\n      class=\"pagination justify-content-center align-items-center mb-0\"\n    ></ul>\n    <a id=\"next\" class=\"page-link\" href=\"#\">></a>\n    <a id=\"lastPage\" class=\"page-link\" href=\"#\">>></a>\n  </nav>");
      $("#showPageNav").empty();
      $("#allPage").empty();
      if (options.showPage) $("#showPageNav").append(pageNav);

      for (var i = 1; i <= totalPage; i++) {
        // 將總筆數資料切成好幾批，使用二維陣列紀錄它，1~10，11~20，21~30 ...
        pageBox[i] = data.slice(0 + pageCount * (i - 1), i * pageCount); // 顯示有幾頁

        $("#allPage").append("<li class=\"page-item\"><a class=\"page-link\" href=\"#\">".concat(i, "</a></li>"));
      }
      /**
       * 依顯示筆數渲染到表格
       * @param {object[]} array
       */


      function page(array) {
        $("#DataTable tbody").empty();

        if (array && array.length) {
          var _iterator = _createForOfIteratorHelper(array),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              $("#DataTable tbody").append("\n         <tr id=\"".concat(item.id, "\">\n           <td><div class=\"th__item--show\"><b>English Name</b></div>").concat(item.name, "</td>\n           <td><div class=\"th__item--show\"><b>Email</b></div>").concat(item.email, "</td>\n           <td><div class=\"th__item--show\"><b>Phone</b></div>").concat(item.phone, "</td>\n           <td><div class=\"th__item--show\"><b>Date</b></div>").concat(item.date, "</td>\n           <td style=\"width:20%;\" data-id=\"").concat(item.id, "\">\n           <a class=\"btn btn-success edit-btn\">Edit</a> | <a class=\"btn btn-danger delete-btn\">Delete</a></td>\n         </tr>\n       "));
              $(".edit-btn").on("click", function (e) {
                // $tr是修改按鈕的所有父元素
                var $tr = $(this).parents(); // _id是修改按鈕的父元素的id

                var _id = $(this).parent().data("id");

                var rowData = {};
                $.each(options.data, function (index, data) {
                  if (parseInt(_id) === parseInt(data.id)) {
                    rowData = {
                      id: data.id,
                      name: data.name,
                      email: data.email,
                      phone: data.phone,
                      date: data.date
                    };
                  }

                  if ($.isFunction(options.onEdit)) {
                    options.onEdit($tr, rowData);
                  }
                });
              });
              $(".delete-btn").on("click", function (e) {
                if ($.isFunction(options.onDelete)) {
                  options.onDelete(e.target, e.target.parentNode.parentNode);
                } else {
                  console.error("Must be a function.");
                }
              });
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          $("#DataTable tbody").append("\n         <tr>\n           <td colspan=\"5\">No Result</td>\n         </tr>\n     ");
        }
      } // 頁數長度


      var pageLen = pageBox.length - 1; // 第一頁

      $("#firstPage").on("click", function (e) {
        e.preventDefault();
        page(pageBox[1]);
        $("#allPage li").removeClass("active");
        $("#allPage li").eq(pageIndex = 0).addClass("active");
        console.log(options);
      }); // 最後一頁

      $("#lastPage").on("click", function (e) {
        e.preventDefault();
        pageIndex = pageLen;
        page(pageBox[pageLen]);
        $("#allPage li").removeClass("active");
        $("#allPage li").eq(pageIndex - 1).addClass("active");
      }); // 上一頁

      $("#prev").on("click", function (e) {
        e.preventDefault();
        pageIndex--;

        if (pageIndex >= 1) {
          page(pageBox[pageIndex]);
          $("#allPage li").removeClass("active");
          $("#allPage li").eq(pageIndex - 1).addClass("active");
        } else {
          pageIndex = 1;
        }
      }); // 下一頁

      $("#next").on("click", function (e) {
        e.preventDefault();
        pageIndex++;

        if (pageIndex <= totalPage) {
          page(pageBox[pageIndex]);
          $("#allPage li").removeClass("active");
          $("#allPage li").eq(pageIndex - 1).addClass("active");
        } else {
          pageIndex = totalPage;
        }
      }); // 點數字換頁

      $("#allPage a").each(function (index) {
        $(this).on("click", function (e) {
          e.preventDefault();
          pageIndex = index + 1;
          page(pageBox[pageIndex]);
          $(this).parent().siblings().removeClass("active");
          $(this).parent().addClass("active");
        });
      }); // 開始顯示第一頁資料

      page(pageBox[pageIndex]); // this.bind(options)
      // 開始第一筆 active

      $("#allPage li").eq(0).addClass("active");
    },

    /**
     * 表單新增
     * @param {object[]} data
     */
    addItem: function addItem(newItem) {
      var options = this.options;
      this.refetchTable(options.data); // 新值加入data

      options.data.push(newItem); // 加入新值後重新渲染畫面

      this.perPage(options.data, options.perPage);
      this.bind(options);
      if (options.showInfo) $(".dataTotalNum").html("<div>" + "共" + options.data.length + "筆資料" + "</div>"); // 送出後欄位清空

      $("#name,#email,#phone").val(""); // return options.data[options.data.length - 1];
    },

    /**
     * 關鍵字搜尋
     * @param {string} value
     * @param {object[]} _array
     * @return {object[]} 回傳符合搜尋結果的物件陣列
     */
    filterKeywords: function filterKeywords(value, _array) {
      // 字串不限制大小寫與去除空白
      var regexpResult = new RegExp($.trim(value), "ig"); // 篩選物件陣列

      var result = _array.filter(function (obj) {
        // 組合一個新字串
        var scanValue = Object.keys(obj).reduce(function (res, key) {
          // 排除id欄位
          return key !== "id" ? res + obj[key] : res;
        }, ""); // 比對正則條件字串

        return scanValue.match(regexpResult);
      }); // 依搜尋後資料重新渲染表格


      this.refetchTable(result);
      this.perPage(result, $("#ItemQuantity").val());
      this.bind(this.options);
      if (this.options.showInfo) $(".dataTotalNum").html("<div>" + "共" + result.length + "筆資料" + "</div>"); // 如果關鍵字欄是空的，把items的值改回一開始的值重新渲染畫面

      if (!value) {
        this.refetchTable(_array);
        this.perPage(_array, $("#ItemQuantity").val());
        this.bind(this.options);
        if (this.options.showInfo) $(".dataTotalNum").html("<div>" + "共" + _array.length + "筆資料" + "</div>");
      }

      return result;
    }
  };

  var DATA = [{
    id: 1,
    name: 'George Maria Anderson',
    email: 'f.lhp@izxld.to',
    phone: ['0996-001371'],
    date: '2021-03-01'
  }, {
    id: 2,
    name: 'Scott Dorothy Lewis',
    email: 'x.uqtt@eoeuyhtxs.com.cn',
    phone: ['0956-127745'],
    date: '2021-03-02'
  }, {
    id: 3,
    name: 'Donna Timothy Brown',
    email: 'y.dnfhyk@odu.th',
    phone: ['0959-871815'],
    date: '2021-03-05'
  }, {
    id: 4,
    name: 'Brenda Mary Miller',
    email: 'v.bxtk@tjmpxkwbr.fo',
    phone: ['0948-327435'],
    date: '2021-03-10'
  }, {
    id: 5,
    name: 'Steven Jose Martin',
    email: 'o.gxs@tlcv.de',
    phone: ['0953-745908'],
    date: '2021-03-15'
  }, {
    id: 6,
    name: 'Michelle Lisa Harris',
    email: 'g.bxci@irqoiy.re',
    phone: ['0931-155138'],
    date: '2021-03-02'
  }, {
    id: 7,
    name: 'Richard Scott Young',
    email: 'c.synbon@qyouvyx.az',
    phone: ['0934-303587'],
    date: '2021-03-03'
  }, {
    id: 8,
    name: 'Robert Jeffrey Allen',
    email: 'i.bsyehyz@hiznxb.gi',
    phone: ['0946-244714'],
    date: '2021-03-06'
  }, {
    id: 9,
    name: 'Melissa Karen Johnson',
    email: 'p.riefbalc@boqmwc.lu',
    phone: ['0905-131221'],
    date: '2021-03-21'
  }, {
    id: 10,
    name: 'Dorothy Karen Harris',
    email: 'k.fdu@ymrjgxs.lk',
    phone: ['0970-944111'],
    date: '2021-03-30'
  }, {
    id: 11,
    name: 'John Linda Anderson',
    email: 's.rwdrw@jnbsdplf.pm',
    phone: ['0922-782576'],
    date: '2021-03-31'
  }, {
    id: 12,
    name: 'Larry Christopher Hernandez',
    email: 'k.cctncwn@kpwpkoor.museum',
    phone: ['0927-842481'],
    date: '2021-03-01'
  }, {
    id: 13,
    name: 'Karen Nancy Thomas',
    email: 'n.xlnl@hkpg.mp',
    phone: ['0953-883864'],
    date: '2021-03-22'
  }, {
    id: 14,
    name: 'Anthony Sarah Harris',
    email: 'w.lipm@qmexko.ye',
    phone: ['0974-331398'],
    date: '2021-03-24'
  }, {
    id: 15,
    name: 'Angela William Garcia',
    email: 'm.ovcmohtpb@akzovhh.de',
    phone: ['0966-210234'],
    date: '2021-03-11'
  }, {
    id: 16,
    name: 'Sandra David Taylor',
    email: 'y.hwzpr@qoame.ke',
    phone: ['0993-787941'],
    date: '2021-03-17'
  }, {
    id: 17,
    name: 'David Laura Anderson',
    email: 'z.zicwf@grtwucgkt.ly',
    phone: ['0973-644816'],
    date: '2021-03-05'
  }, {
    id: 18,
    name: 'Jason Dorothy Rodriguez',
    email: 'u.ykeweu@jsoqrxte.pf',
    phone: ['0957-447222'],
    date: '2021-03-04'
  }, {
    id: 19,
    name: 'Kevin Steven Robinson',
    email: 'o.zcvql@ixojb.gn',
    phone: ['0909-131886'],
    date: '2021-03-09'
  }, {
    id: 20,
    name: 'Betty Sharon Jackson',
    email: 's.mtrlx@wnivluqes.ki',
    phone: ['0930-335482'],
    date: '2021-03-10'
  }, {
    id: 21,
    name: 'Robert Donald Harris',
    email: 'l.njhlplihy@ulioq.ci',
    phone: ['0918-582288'],
    date: '2021-03-29'
  }, {
    id: 22,
    name: 'Joseph Sharon Lopez',
    email: 'e.nciqeidv@qzoinaudbx.pw',
    phone: ['0938-217401'],
    date: '2021-03-18'
  }, {
    id: 23,
    name: 'Steven Mark Jones',
    email: 'j.zmanq@axmsx.tn',
    phone: ['0931-283902'],
    date: '2021-03-19'
  }, {
    id: 24,
    name: 'Sandra Eric Thomas',
    email: 'k.svhwbemp@mjnmh.ma',
    phone: ['0999-821075'],
    date: '2021-03-20'
  }, {
    id: 25,
    name: 'Deborah Daniel Walker',
    email: 'p.giszzjsg@ixqfmlnxo.cy',
    phone: ['0930-744958'],
    date: '2021-03-03'
  }];

  var TableCRUD = /*#__PURE__*/function () {
    function TableCRUD(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, TableCRUD);

      this.$element = element; // 繼承外部客製選項

      this.options = Object.freeze($.extend(true, {}, DEFAULT, options)); // 暫存 Table Data

      this.saveData = []; // 初始化

      this.init(options);
    }

    _createClass(TableCRUD, [{
      key: "init",
      value: function init() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.options = options;
        this.refetchTable(options.data);
        this.saveData = options.data;
        this.perPage(this.saveData, options.perPage);
        this.creatToolBar();
        this.bind(options);
      }
      /**
       * 重新渲染 Table
       * @param {object} =[] items
       */

    }, {
      key: "refetchTable",
      value: function refetchTable(items) {
        var $element = this.$element,
            options = this.options;
        var tableContent = $("<thead>\n    <tr>\n      <th scope=\"col\">English Name</th>\n      <th scope=\"col\">Email</th>\n      <th scope=\"col\">Phone</th>\n      <th scope=\"col\">Date</th>\n      <th scope=\"col\">Actions</th>\n    </tr>\n    </thead>\n    <tbody></tbody>");
        $("#DataTable").empty();
        $("#DataTable").append(tableContent);
        if (options.showInfo) $(".dataTotalNum").html("<div>" + "共" + items.length + "筆資料" + "</div>");
        $element.empty();
        $.each(items, function (key, item) {
          var row = $("<tr id=\"".concat(item.id, "\"></tr>"));
          row.append($("<td></td>").html(item.name));
          row.append($("<td></td>").html(item.email));
          row.append($("<td></td>").html(item.phone));
          row.append($("<td></td>").html(item.date));
          row.append($("<td style=\"width:20%;\" data-id=\"".concat(item.id, "\"><a class=\"btn btn-success edit-btn\">Edit</a> | <a class=\"btn btn-danger delete-btn\">Delete</a></td>")));
          $element.append(row);
        });
      }
      /**
       * 渲染顯示筆數欄和搜尋欄
       */

    }, {
      key: "creatToolBar",
      value: function creatToolBar() {
        var options = this.options;
        var selectTool = $(" <label id=\"ItemQuantityLabel\" for=\"ItemQuantity\"\n    >\u986F\u793A\u7B46\u6578:\n    <select id=\"ItemQuantity\">\n      <option id=\"initPageValue\" value=\"5\" selected>5</option>\n      <option value=\"10\">10</option>\n      <option value=\"15\">15</option>\n      <option value=\"20\">20</option>\n      <option value=\"25\">25</option>\n    </select></label\n  >");
        var searchTool = $("<label id=\"searchTxtLabel\" for=\"searchTxt\" class=\"searchTxtLabel\"\n      ><span>\u7D9C\u5408\u641C\u5C0B\uFF1A</span>\n      <input\n        id=\"searchTxt\"\n        class=\"w-50\"\n        type=\"text\"\n        placeholder=\"\u95DC\u9375\u5B57\"\n    /></label>");
        var selectAndSearch = $(" <div class=\"d-flex align-items-center\">\n      <div class=\"showSelect\">\n      </div>\n      <div class=\"showSearch\">\n      </div>\n      </div>");
        $("#toolBar").empty();
        $("#toolBar").append(selectAndSearch);
        if (options.showPerPage) $(".showSelect").append(selectTool);
        if (options.showSearch) $(".showSearch").append(searchTool);
      }
      /**
       * 資料更新
       * @param {object} feedbackData
       * @param {object[]} saveData
       */

    }, {
      key: "updateData",
      value: function updateData() {
        var feedbackData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var saveData = arguments.length > 1 ? arguments[1] : undefined;

        // 單筆回傳資料
        // 找到saveData裡面 id符合回傳資料id的第一筆資料，parseInt字串轉數字
        var _index = saveData.findIndex(function (item) {
          return parseInt(item.id) === parseInt(feedbackData.id);
        }); // 撈savaData找到的那筆資料把內容換成feedbackData


        saveData[_index].name = feedbackData.name;
        saveData[_index].email = feedbackData.email;
        saveData[_index].phone = feedbackData.phone; // 更新資料

        this.refetchTable(saveData);
        this.perPage(saveData, $("#ItemQuantity").val());
        this.bind(this.options);
      }
      /**
       * 刪除單筆資料
       * @param {object} feedbackData
       * @param {object} rowData
       */

    }, {
      key: "removeData",
      value: function removeData(saveData, rowData) {
        var id = rowData.id;
        saveData.forEach(function (obj, i) {
          if (parseInt(obj.id) === parseInt(id)) {
            saveData.splice(i, 1);
          }
        });
        this.refetchTable(saveData);
        this.perPage(saveData, $("#ItemQuantity").val());
        this.bind(this.options);
      }
      /**
       * 綁定事件
       * @param {Object} [options={}] - 變更的選項參數
       */

    }, {
      key: "bind",
      value: function bind() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        /**
         * 顯示搜尋結果
         * @param {string} value
         * @param {object[]} arr
         */
        var showSearchResult = function showSearchResult(value) {
          var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          $("#jsonResult").empty().html("<pre>".concat(JSON.stringify(demo.filterKeywords(value, arr), null, 1), "</pre>"));
        }; // === 偵測搜尋input ===


        $("#search").on("keyup", function () {
          var _this = this;

          var value = $(this).val(); // 事件延遲1秒執行, 減少reflow

          setTimeout(function () {
            _this.search(value, _this.data, options);
          }, 1000);
        }); // 搜尋

        $("#searchTxt").on("keyup", function () {
          var _value = $(this).val(); // 事件延遲0.5秒執行, 減少reflow


          setTimeout(function () {
            showSearchResult(_value, DATA);
          }, 500);
        });
        $(".edit-btn").on("click", function (e) {
          // $tr是修改按鈕的所有父元素
          var $tr = $(this).parents(); // _id是修改按鈕的父元素的id

          var _id = $(this).parent().data("id");

          console.log(_id);
          console.log($tr[0]);
          var rowData = {};
          $.each(options.data, function (index, data) {
            if (parseInt(_id) === parseInt(data.id)) {
              console.log(data);
              rowData = {
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                date: data.date
              };
            }

            if ($.isFunction(options.onEdit)) {
              options.onEdit($tr, rowData);
            }
          });
        });
        $(".delete-btn").on("click", function (e) {
          if ($.isFunction(options.onDelete)) {
            options.onDelete(e.target, e.target.parentNode.parentNode);
          } else {
            console.error("Must be a function.");
          }
        });
      }
    }]);

    return TableCRUD;
  }();

  Object.assign(TableCRUD.prototype, methods);

  return TableCRUD;

})));
