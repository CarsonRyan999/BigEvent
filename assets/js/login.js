$(function () {
    // 点击去注册
    $("#go-reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击去登陆
    $("#go-login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })
    // 获取form对象
    var form = layui.form;
    // 获取layer对象
    var layer = layui.layer;
    // 通过form.verify() 自定义校验规则
    form.verify({
        // 自定义密码校验规则
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 验证两次密码是否一致
        repass: function (value) {
            // value: 再次确认密码框的值
            // 获取第一个密码框的值
            var pwd = $(".reg-box [name=password]").val();
            if (pwd != value) {
                return '两次密码输入不一致';
            }
        }
    })
    // 发送注册Ajax请求
    $("#reg_form").on("submit", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起请求
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $("#reg_form [name=username]").val(),
                password: $("#reg_form [name=password]").val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("注册成功，请登录！");
                // 自动点击登录
                $("#go-login").click();
            }
        })
    })
    // 发起登录Ajax请求
    $("#login_form").on("submit", function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功！");
                // 将token存储到本地
                localStorage.setItem("token", res.token);
                // 登录成功后 跳转到登录页面
                location.href = "/index.html";
            }
        })
    })
})