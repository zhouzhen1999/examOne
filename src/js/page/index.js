require(["./js/config.js"], function() {
    require(["jquery"], function() {
        $.ajax({
            url: "/api/data",
            dataType: "json",
            success: function(res) {
                if (res.code == 0) {
                    console.log(res)
                    var str = "";
                    res.datas.forEach((i) => {
                        str += `<li>
                                <p>
                                    <span>分类名称:</span><b>${i.title}</b>
                                    <h3>添加时间：${i.time}</h3>
                                </p>

                                <p>
                                    <i class="icon iconfont icon-bianji1"></i>
                                    <i class="icon iconfont icon-shanchu-01"></i>
                                </p>
                            </li>`;
                    })

                    $(".section-main").append(str)
                }

            }
        })
        init();

        function init() {
            ajax();
        }


        function ajax() {
            $("#adds").on("touchstart", function() {
                console.log(111)
                $(".alert").show()
            })
            $(".add").on("touchstart", function() {
                var val = $("#inp").val();
                console.log(val)
                if (val) {
                    $.ajax({
                        url: "/api/list",
                        type: "post",
                        dataType: "json",
                        data: {
                            title: val
                        },
                        success: function(res) {
                            console.log(res)
                        }
                    })
                }
            })
        }
    })
})