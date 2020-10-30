// 当利用jquery发起Ajax请求时，会预先调用$.ajaxPrefilter()
// options: 当前AJAX请求的所有参数选项。
$.ajaxPrefilter(function (options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url;
})