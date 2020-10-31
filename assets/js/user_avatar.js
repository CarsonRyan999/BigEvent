$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2、为上传按钮绑定点击事件
    $("#btnImage").on("click", function () {
        // 点击上传  自动触发上传文件按钮
        $("#file").click();
    })
    // 3、监测文件框的变化事件
    $("#file").on("change", function () {
        // (1) 获取上传文件的列表
        var fileList = this.files;
        if (fileList.length <= 0) {
            return layer.msg("请先上传图片");
        }
        layer.msg("上传成功");
        // (2) 拿到用户上传的文件
        var file = fileList[0];
        // (3) 通过URL对象将图片转换为URL
        var newImgUrl = URL.createObjectURL(file);
        // (4) 更换图片
        // destory：销毁旧的裁剪区域
        // 重新设置src属性 并重新初始化裁剪区域
        $image.cropper("destroy").prop("src", newImgUrl).cropper(options);
    })
    // 4、点击确定按钮 发起ajax请求 修改用户头像
    $("#btnSure").on("click", function () {
        // (1) 将裁剪区的图片转换为base64格式的字符串
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // (2) 将图片上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg("头像修改失败");
                }
                layer.msg("头像修改成功");
                // 重新获取用户信息 刷新头像
                window.parent.getUserinfo();
            }
        })
    })
})