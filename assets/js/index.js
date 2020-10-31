$(function () {
    getUserinfo();
    // 3、点击按钮退出
    $("#btnOut").on("click", function () {
        // 提示用户是否退出
        layer.confirm('您确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // (1)跳转到登录页面
            location.href = "/login.html";
            // (2)清空本地存储的token值
            localStorage.removeItem("token");
            layer.close(index);
        });
    })
})
// 1、获取用户信息
function getUserinfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 已在baseAPi中设置
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败")
            }
            renderUserAvatar(res.data)
        },
        // 防止用户修改index.html来访问有权限的页面
        // 不论请求是否成功 jquery都会调用complete回调函数
        // complete: function (res) {
        //     console.log(2);
        //     // 可以通过res.responseJSON拿到服务器返回的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // (1) 强制清空token
        //         localStorage.removeItem("token");
        //         // (2) 强制跳转到登录页面
        //         location.href = "/login.html";
        //     }
        // }
    })
}
// 2、渲染用户头像
function renderUserAvatar(user) {
    // 1、渲染用户名
    var name = user.nickname || user.username;
    $(".welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 2、渲染头像
    // (1)判断用户是否有头像
    if (user.user_pic !== null) {
        // (2)渲染图片头像
        $(".layui-nav-img").prop("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // (3)如果用户没有设置头像 就将用户名的第一个字母大写后 作为头像的内容
        var bigA = name[0].toUpperCase();
        $(".text-avatar").html(bigA).show();
        $(".layui-nav-img").hide();
    }
}
