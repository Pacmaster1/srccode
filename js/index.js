$(document).ready(() => { // 页面加载完成后执行
    const apiUrl = 'http://localhost:8888'; // API 基础地址
    const token = localStorage.getItem('token'); // 从本地存储获取 token
    const userId = localStorage.getItem('userId'); // 从本地存储获取用户 ID

    // 检查登录状态
    if (!token || !userId) {
        alert('请先登录'); // 提示用户登录
        window.location.href = 'login.html'; // 跳转到登录页面
        return; // 结束后续操作
    }

    // 显示用户信息
    const nickname = localStorage.getItem('nickname'); // 获取用户昵称
    if (nickname) {
        $('.off').hide(); // 隐藏未登录状态
        $('.on').show(); // 显示已登录状态
        $('.nickname').text(nickname); // 更新显示的昵称
    } else {
        $('.off').show(); // 显示未登录状态
        $('.on').hide(); // 隐藏已登录状态
    }

    // 动态加载轮播图
    const loadCarousel = async () => {
        try {
            const response = await axios.get(`${apiUrl}/carousel/list`, {
                headers: { 'Authorization': token } // 在请求头中附加 token
            });

            const { data } = response; // 解构响应数据
            if (data.code === 1) {
                const carouselList = data.list; // 获取轮播图列表
                const carouselContainer = $('#carousel div[carousel-item]'); // 轮播图容器
                carouselContainer.empty(); // 清空现有内容

                // 动态插入轮播图项
                carouselList.forEach(item => {
                    const carouselItem = `<div><img src="http://localhost:8888/${item.name}" alt="${item.name}"></div>`;
                    carouselContainer.append(carouselItem);
                });

                // 初始化轮播图
                layui.use(['carousel'], () => {
                    const carousel = layui.carousel;
                    carousel.render({
                        elem: '#carousel', // 容器选择器
                        width: '1200px', // 宽度
                        height: '600px', // 高度
                        arrow: 'hover', // 鼠标悬停显示箭头
                        anim: 'fade' // 切换动画效果
                    });
                });

                console.log('轮播图加载成功:', data.message); // 输出成功日志
            } else {
                console.error('轮播图加载失败:', data.message); // 输出失败信息
            }
        } catch (error) {
            console.error('轮播图请求出错:', error); // 输出错误信息
        }
    };

    // 调用加载轮播图的函数
    loadCarousel();

    // 跳转个人中心
    $('.self').on('click', () => {
        window.location.href = './self.html'; // 跳转到个人中心页面
    });

    // 退出登录
    $('.logout').on('click', () => {
        if (confirm('确认退出登录吗？')) { // 确认退出
            ['token', 'nickname', 'userId'].forEach(item => localStorage.removeItem(item)); // 清除本地存储
            $('.off').show(); // 显示未登录状态
            $('.on').hide(); // 隐藏已登录状态
        }
    });

    // 未登录状态的点击跳转
    $('.off a').on('click', () => {
        window.location.href = 'login.html'; // 跳转到登录页面
    });
});
