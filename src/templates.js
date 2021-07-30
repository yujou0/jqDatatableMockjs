// Dialog tmpl
export default {
  templates() {
    $(".container").append(`
    <div class="modal fade" id="addModal" data-backdrop="static">
<!-- modal-dialog-centered 垂直置中  -->
<!-- 調整 modal 視窗寬度，modal-xl(1140px)、modal-lg(800px)、modal-sm(300px)、沒寫 500px -->
<div class="modal-dialog modal-dialog-centered modal-sm">
  <!-- modal-content 資訊區可分為 header、body、footer -->
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="addModalLabel">新增</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form id="addForm" name="addForm" onsubmit="return validateForm()">
        <label for="addDate">Date</label>：<b id="addDate">2021-03-03</b>
      </form></br>
      <label for="name">English Name(*)</label>：<input type="text" id="name" class="inputform" />
      <div class="errorName text-danger"></div>
      <br />
      <label for="email">Email</label>：<br /><input type="text" id="email" class="inputform" />
      <div class="errorEmail text-danger"></div>
      <br />
      <label for="mobile">Phone</label>：<br /><input type="text" id="phone" class="inputform" />
      <div class="errorPhone text-danger"></div>
      <br />
      <input id="rowID" type="hidden" value="" />
      </form>
    </div>
    <div class="modal-footer">
      <!-- data-dimiss="modal" 關閉 modal -->
      <button type="button" class="btn border-secondary" data-dismiss="modal" id="closeModal">
        關閉
      </button>
      <button id="addSubmit" type="button" class="btn btn-light border-secondary">
        儲存
      </button>
      <button id="saveButton" type="button" class="btn btn-light border-secondary">
        更新
      </button>
    </div>
  </div>
</div>
</div>`);
  },
};
