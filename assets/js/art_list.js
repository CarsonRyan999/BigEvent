$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 3、定时美化时间的过滤器
    template.defaults.imports.dateFormate = function (data) {
        var date = new Date(data);

        var y = date.getFullYear();
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());

        var hh = padZero(date.getHours());
        var mm = padZero(date.getMinutes());
        var ss = padZero(date.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 定义补零函数
    function padZero(t) {
        return t < 10 ? '0' + t : t;
    }
    // 1、定义查询参数对象
    var q = {
        pagenum: 1, // 页码值 默认显示第1页
        pagesize: 2, // 每页显示几条 默认显示2条
        cate_id: '', // 文章分类id  默认所有分类
        state: ''   // 文章发布状态  默认所有状态
    }
    // 2、发起ajax请求 获取文章列表数据
    function initArtList() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                // 调用模板引擎
                var htmlStr = template("tpl-list", res);
                // 渲染数据
                $("tbody").html(htmlStr);
                // 列表数据渲染完成后 就渲染分页
                renderPage(res.total);
            }
        })
    }
    initArtList();
    // 4、发起ajax请求 获取文章分类
    function getArtCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败");
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通知layui  重新渲染表单
                form.render();
            }
        })
    }
    getArtCate();
    // 5、点击筛选按钮 发起ajax请求
    $("#cate_filter").on("submit", function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 获取选择框的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 将选择框里的值赋值存储到q对象
        q.cate_id = cate_id;
        q.state = state;
        // 重新初始化文章列表
        initArtList();
    })
    // 6、定义渲染分页的方法
    function renderPage(total) {
        // 渲染分页
        laypage.render({
            elem: "page", // 容器id
            count: total, // 数据的总条数
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 默认显示在第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 当切换分页时就会触发该jump回调
            // 触发jump回调的两种方法:
            // (1) 点击分页触发
            // (2) 调用laypage.render方法触发
            // 当通过方法一触发时：first为false
            // 当通过方法二触发时：first为true
            jump: function (obj, first) {
                // (1)将最新的页码值 赋值给查询参数对象q
                q.pagenum = obj.curr;
                // (3)将最新的条目数 赋值给查询参数对象q
                q.pagesize = obj.limit;
                // (2)利用最新的查询参数对象q  再次获取列表数据
                // 如果是利用laypage.render触发的 就不调用initArtList方法
                if (!first) {
                    initArtList();
                }
            }
        })
    }
    // 7、点击删除按钮 发起ajax请求
    $("tbody").on("click", ".btn-delete", function () {
        var len = $(".btn-delete").length;
        var id = $(this).attr("data-id");
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    layer.msg("删除文章成功");
                    // 当删除完后 需要判断当前页面是否还有数据
                    // 如果没有数据 应该让页码值-1 然后再调用initArtList方法
                    // 当len等于1时 就代表页面只有一条数据 
                    // 删除完后  页面就没有数据了
                    if (len === 1) {
                        // q.pagenum最小值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 重新刷新文章列表
                    initArtList();
                    // 关闭弹出层
                    layer.close(index);
                }
            })
        });
    })
    // 8、点击编辑按钮 携带id  跳转到文章发表页面
    $("tbody").on("click", "#btn-edit", function () {
        var id = $(this).attr("data-id");
        location.href = '/article/art_edit.html?' + id;
    })
})