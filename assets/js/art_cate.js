$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 1、发起Ajax请求 获取文章数据
    function initArtCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }
    initArtCate();
    // 2、点击弹出
    var index = null;
    $("#addCate").on("click", function () {
        index = layer.open({
            // 页面类型
            type: 1,
            // 弹出层宽高
            area: ['500px', '250px'],
            // 弹出层位置 [y,x]
            offset: ['160px', '400px'],
            title: '添加文章分类',
            content: $("#tpl-dialog").html()
        });
    })
    // 3、通过代理的形式为表单绑定 提交事件
    $("body").on("submit", "#form-dialog", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败");
                }
                // 重新获取数据并渲染
                initArtCate();
                // 关闭弹出层
                layer.close(index);
            }
        })
    })
    // 4、通过代理的形式给编辑按钮绑定点击事件
    var indexEdit = null;
    $("tbody").on("click", "#btn-edit", function (e) {
        indexEdit = layer.open({
            // 页面类型
            type: 1,
            // 弹出层宽高
            area: ['500px', '250px'],
            // 弹出层位置 [y,x]
            offset: ['160px', '400px'],
            title: '修改文章分类',
            content: $("#tpl-edit").html()
        });
        // 获取当前按钮的id
        var id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取数据失败");
                }
                form.val("form-edit", res.data);
            }
        })
    })
    // 5、通过代理的形式给表单绑定提交事件
    $("body").on("submit", "#form-edit", function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新文章分类失败");
                }
                layer.msg("更新文章分类成功");
                // 重新获取数据 
                initArtCate();
                // 关闭弹出层
                layer.close(indexEdit);
            }
        })
    })
    // 6、通过代理的形式给删除按钮绑定点击事件
    $("tbody").on("click", "#btn-delete", function () {
        var id = $(this).attr("data-id");
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    layer.msg("删除文章分类成功");
                    // 重新获取数据并刷新页面
                    initArtCate();
                    // 关闭弹出层
                    layer.close(index);
                }
            })
        });
    })
})