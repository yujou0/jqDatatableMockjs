// 宣告驗證規則
let nameRule = /^.{1,}$/;
let emailRule =
  /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
let phoneRule = /^09\d{2}-\d{6}$/;

import { assign } from "./lib.js";
export default {
  // 更新 TableCRUD 實例
  updateOptions(updateOpt = {}) {
    this.init(updateOpt);
  },
  // 動態設置 TableCRUD 選項參數
  setOptions(setOpt = {}) {
    let { options } = this;
    const currentOptions = assign(
      {},
      options,
      $.isPlainObject(setOpt) && setOpt
    );
    this.updateOptions(currentOptions);
  },

  /**
   * 分頁功能
   * @param {object[]} data
   * @param {string} perPage
   */
  perPage(data = {}, perPage) {
    const { options } = this;
    // 每頁顯示幾筆資料
    let pageCount = perPage;
    //容器，總筆數切成好幾批存放，每批是一組陣列 1~10，11~20，21~30，31~40 ....
    let pageBox = [];
    // 第幾頁
    let pageIndex = 1;

    let totalPage = Math.ceil(data.length / pageCount);
    // 分頁欄
    let pageNav = $(`<nav id="pages" class="">
    <a id="firstPage" class="page-link" href="#"> << </a>
    <a id="prev" class="page-link" href="#"> < </a>
    <ul
      id="allPage"
      class="pagination justify-content-center align-items-center mb-0"
    ></ul>
    <a id="next" class="page-link" href="#">></a>
    <a id="lastPage" class="page-link" href="#">>></a>
  </nav>`);

    $("#showPageNav").empty();

    $("#allPage").empty();
    if (options.showPage) $("#showPageNav").append(pageNav);
    for (let i = 1; i <= totalPage; i++) {
      // 將總筆數資料切成好幾批，使用二維陣列紀錄它，1~10，11~20，21~30 ...
      pageBox[i] = data.slice(0 + pageCount * (i - 1), i * pageCount);
      // 顯示有幾頁
      $("#allPage").append(
        `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
      );
    }

    /**
     * 依顯示筆數渲染到表格
     * @param {object[]} array
     */
    function page(array) {
      $("#DataTable tbody").empty();
      if (array && array.length) {
        for (const item of array) {
          $("#DataTable tbody").append(`
         <tr id="${item.id}">
           <td><div class="th__item--show"><b>English Name</b></div>${item.name}</td>
           <td><div class="th__item--show"><b>Email</b></div>${item.email}</td>
           <td><div class="th__item--show"><b>Phone</b></div>${item.phone}</td>
           <td><div class="th__item--show"><b>Date</b></div>${item.date}</td>
           <td style="width:20%;" data-id="${item.id}">
           <a class="btn btn-success edit-btn">Edit</a> | <a class="btn btn-danger delete-btn">Delete</a></td>
         </tr>
       `);
       $(".edit-btn").on("click", function (e) {
        // $tr是修改按鈕的所有父元素
        const $tr = $(this).parents();
        // _id是修改按鈕的父元素的id
        const _id = $(this).parent().data("id");
        let rowData = {};
  
        $.each(options.data, function (index, data) {
          if (parseInt(_id) === parseInt(data.id)) {
            rowData = {
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              date: data.date,
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
      } else {
        $("#DataTable tbody").append(`
         <tr>
           <td colspan="5">No Result</td>
         </tr>
     `);
      }
    }
    // 頁數長度
    let pageLen = pageBox.length - 1;
    // 第一頁
    $("#firstPage").on("click", function (e) {
      e.preventDefault();
      page(pageBox[1]);
      $("#allPage li").removeClass("active");
      $("#allPage li")
        .eq((pageIndex = 0))
        .addClass("active");
        console.log(options)
    });

    // 最後一頁
    $("#lastPage").on("click", function (e) {
      e.preventDefault();
      pageIndex = pageLen;
      page(pageBox[pageLen]);
      $("#allPage li").removeClass("active");
      $("#allPage li")
        .eq(pageIndex - 1)
        .addClass("active");
    });
    // 上一頁
    $("#prev").on("click", function (e) {
      e.preventDefault();
      pageIndex--;
      if (pageIndex >= 1) {
        page(pageBox[pageIndex]);
        $("#allPage li").removeClass("active");
        $("#allPage li")
          .eq(pageIndex - 1)
          .addClass("active");
      } else {
        pageIndex = 1;
      }
    });
    // 下一頁
    $("#next").on("click", function (e) {
      e.preventDefault();
      pageIndex++;
      if (pageIndex <= totalPage) {
        page(pageBox[pageIndex]);
        $("#allPage li").removeClass("active");
        $("#allPage li")
          .eq(pageIndex - 1)
          .addClass("active");
      } else {
        pageIndex = totalPage;
      }
    });

    // 點數字換頁
    $("#allPage a").each(function (index) {
      $(this).on("click", function (e) {
        e.preventDefault();
        pageIndex = index + 1;
        page(pageBox[pageIndex]);
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
      });
    });
    // 開始顯示第一頁資料
    page(pageBox[pageIndex]);
    // this.bind(options)
    // 開始第一筆 active
    $("#allPage li").eq(0).addClass("active");
  },
  /**
   * 表單新增
   * @param {object[]} data
   */
  addItem(newItem) {
    const { options } = this;

    this.refetchTable(options.data);
    // 新值加入data
    options.data.push(newItem);
    // 加入新值後重新渲染畫面
    this.perPage(options.data, options.perPage);
    this.bind(options)
    if (options.showInfo)
      $(".dataTotalNum").html(
        "<div>" + "共" + options.data.length + "筆資料" + "</div>"
      );
    // 送出後欄位清空
    $("#name,#email,#phone").val("");

    // return options.data[options.data.length - 1];
  },
  /**
   * 關鍵字搜尋
   * @param {string} value
   * @param {object[]} _array
   * @return {object[]} 回傳符合搜尋結果的物件陣列
   */
  filterKeywords(value, _array) {
    // 字串不限制大小寫與去除空白
    const regexpResult = new RegExp($.trim(value), "ig");
    // 篩選物件陣列
    const result = _array.filter((obj) => {
      // 組合一個新字串
      const scanValue = Object.keys(obj).reduce((res, key) => {
        // 排除id欄位
        return key !== "id" ? res + obj[key] : res;
      }, "");
      // 比對正則條件字串
      return scanValue.match(regexpResult);
    });

    // 依搜尋後資料重新渲染表格
    this.refetchTable(result);
    this.perPage(result, $("#ItemQuantity").val());
    this.bind(this.options);

    if (this.options.showInfo)
      $(".dataTotalNum").html(
        "<div>" + "共" + result.length + "筆資料" + "</div>"
      );

    // 如果關鍵字欄是空的，把items的值改回一開始的值重新渲染畫面
    if (!value) {
      this.refetchTable(_array);
      this.perPage(_array, $("#ItemQuantity").val());
      this.bind(this.options);

      if (this.options.showInfo)
        $(".dataTotalNum").html(
          "<div>" + "共" + _array.length + "筆資料" + "</div>"
        );
    }
    return result;
  },
};
