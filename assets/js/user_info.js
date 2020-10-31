$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入小于6位的昵称';
            }
        }
    })
    // 发起ajax请求  获取用户信息
    function getUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！");
                }
                // 给表单赋值
                // 参数1：给表单对应的name属性赋值
                // 参数2：对象
                form.val("formUserInfo", res.data);
            }
        })
    }
    getUserInfo();

    $("#btnReset").on("click", function (e) {
        // 阻止默认清空表单的行为
        e.preventDefault();
        // 重新还原表单数据
        getUserInfo();
    })
    $(".layui-form").on("submit", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改用户信息失败！");
                }
                layer.msg("修改用户信息成功");
                // 调用index.js的请求函数 重新获取用户信息
                window.parent.getUserinfo();
            }
        })
    })
})