$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var id = location.search.replace(/\?/, '') || null;
    // 1、义initCate函数发起ajax请求
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败");
                }
                // 调用模板引擎 渲染下拉选择框
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 调用form.render()方法 让layui重新渲染form表单
                form.render();
                editData();
            }
        })
    }
    initCate();
    // 8、发起ajax请求 填充表单数据
    function editData() {
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章数据失败");
                }
                var art = res.data;
                form.val("article-pub", art);
                // 2、初始化富文本编辑器
                initEditor();
                // 3、初始化图片裁剪器
                var $image = $('#image');
                $image.prop("src", "http://120.27.211.140" + art.cover_img);
                // 3.1 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                }
                // 3.2 初始化裁剪区域
                $image.cropper(options);
            }
        })
    }
    // 点击选择封面按钮 触发选择文件框
    $("#btnFile").on("click", function () {
        $("#coverFile").click();
    })
    // 4、监听文件选择框的change事件
    $("#coverFile").on("change", function () {
        var files = this.files;
        if (files.length === 0) {
            return layer.msg("请先选择文件");
        }
        layer.msg("文件上传成功");
        // 4.1 根据用户选择的文件 创建一个url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 4.2 先销毁原来的裁剪区域 然后重新设置src属性 再创建新的裁剪区域
        $("#image").cropper('destroy').prop("src", newImgURL).cropper({
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        });
    })
    // 5、定义文章默认状态
    var art_state = null;
    // 点击草稿按钮时 将状态更改
    $("#btnSave").on("click", function () {
        art_state = '草稿';
    })
    $("#btn-pub").on("click", function () {
        art_state = '已发布';
    })
    // 6、监听表单提交事件
    $("#form-pub").on("submit", function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // (1)基于form表单   来创建一个FormData对象 
        var fd = new FormData($(this)[0]);
        // (2)将文章状态添加到FormData对象中
        fd.append("state", art_state);
        // (3)创建一个 Canvas 画布
        $("#image").cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // (4) 将 Canvas 画布上的内容，转化为文件对象blob   
            // (5) 将转化后的文件对象blob 添加到FormData对象中
            fd.append("cover_img", blob);
            // (6) 发起ajax请求
            publishArticle(fd);
        })
    })
    // 7、定义一个发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            // 注意：如果数据是FormData格式
            // 必须设置这两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败");
                }
                layer.msg("发布文章成功");
                // 跳转到文章列表页面
                location.href = "/article/art_list.html";
            }
        })
    }
})