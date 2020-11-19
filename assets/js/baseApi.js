// 当利用jquery发起Ajax请求时，会预先调用$.ajaxPrefilter()
// options: 当前AJAX请求的所有参数选项。
$.ajaxPrefilter(function (options) {
    // 1、将根目录和接口地址拼接
    // options.url = "http://ajax.frontend.itheima.net" + options.url;
    options.url = "http://120.27.211.140:9090" + options.url;

    // 2、为有权限的接口设置headers请求头
    // 判断请求的地址中 是否包含/my/  如果包含 则需要加headers
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 3、防止用户修改index.html来访问有权限的页面
    // 不论请求是否成功 jquery都会调用complete回调函数
    options.complete = function (res) {
        // 可以通过res.responseJSON拿到服务器返回的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // (1) 强制清空token
            localStorage.removeItem("token");
            // (2) 强制跳转到登录页面
            location.href = "/login.html";
        }
    }
})