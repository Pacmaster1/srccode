document.addEventListener('DOMContentLoaded', () => { // 当文档完全加载后执行
    // 定义获取页面元素的函数，避免重复查询 DOM
    const getElement = (selector) => document.querySelector(selector);

    // 页面中商品信息相关的元素
    const elements = {
        productImage: getElement('.middleimg'), // 商品图片
        productTitle: getElement('.title'), // 商品标题
        productOldPrice: getElement('.old'), // 商品原价
        productDiscount: getElement('.discount'), // 商品折扣信息
        productCurrentPrice: getElement('.curprice'), // 商品现价
        productDescription: getElement('.desc') // 商品描述
    };

    // 从 URL 中获取商品 ID
    const getProductIdFromUrl = () => new URLSearchParams(window.location.search).get('id');

    // 获取商品详情的异步函数
    const fetchProductDetails = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8888/goods/item/${productId}`);
            const { data } = response;

            if (data?.code === 1) { // 如果返回成功
                updateProductDetails(data.info); // 更新商品详情
            } else {
                console.error(`获取商品详细信息失败: ${data?.message || '未知错误'}`);
            }
        } catch (error) {
            console.error('获取商品详细信息出错:', error);
        }
    };

    // 更新页面中的商品详情
    const updateProductDetails = (product = {}) => {
        const {
            productImage,
            productTitle,
            productOldPrice,
            productDiscount,
            productCurrentPrice,
            productDescription
        } = elements;

        // 使用可选链操作符和空值合并操作符提供默认值
        productImage.src = product.img_big_logo ?? '';
        productTitle.textContent = product.title ?? '无标题';
        productOldPrice.textContent = product.price ?? '暂无';
        productDiscount.textContent = product.sale_type ?? '无折扣';
        productCurrentPrice.textContent = product.current_price ?? '暂无';
        productDescription.innerHTML = product.goods_introduce ?? '暂无描述';
    };

    // 主流程：获取商品 ID 并加载商品详情
    const productId = getProductIdFromUrl();

    if (productId) {
        fetchProductDetails(productId); // 获取并更新商品详情
    } else {
        console.error('商品ID不存在，请检查URL参数。');
    }
});
