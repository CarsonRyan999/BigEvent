$(function () {
    // 1、定义密码验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function (value) {
            if (value == $("[name=oldPwd]").val()) {
                return '新旧密码不能一致';
            }
        },
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码不一致';
            }
        }
    })
    // 2、发起更改密码的ajax请求
    $(".layui-form").on("submit", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改密码失败");
                }
                layer.msg("修改密码成功");
                // 清空表单
                $(".layui-form")[0].reset();
            }
        })
    })
})