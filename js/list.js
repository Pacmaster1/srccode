document.addEventListener('DOMContentLoaded', function() { // 当整个文档加载完成后执行此函数
    // 选择 DOM 元素
    const productsContainer = document.querySelector('.list.container'); // 获取商品列表容器
    const pageNumberInput = document.querySelector('.pagination .jump'); // 获取分页输入框
    const pageSizeSelect = document.querySelector('.pagination .pagesize'); // 获取分页大小选择框
    const totalPagesDisplay = document.querySelector('.pagination .total'); // 获取总页数显示元素
    const searchInput = document.querySelector('.filter .search'); // 获取搜索输入框
    const categoriesList = document.querySelector('.category'); // 获取分类列表容器
    const filterList = document.querySelector('.filterBox'); // 获取筛选列表容器
    const discountList = document.querySelector('.saleBox'); // 获取折扣列表容器
    const sortList = document.querySelector('.sortBox'); // 获取排序列表容器
    const firstPageButton = document.querySelector('.pagination .first'); // 获取首页按钮
    const prevPageButton = document.querySelector('.pagination .prev'); // 获取上一页按钮
    const nextPageButton = document.querySelector('.pagination .next'); // 获取下一页按钮
    const lastPageButton = document.querySelector('.pagination .last'); // 获取尾页按钮

    // 初始化变量
    let activePage = 1; // 当前页码
    let itemsPerPage = 12; // 每页显示的商品数量
    let keyword = ''; // 搜索关键词
    let activeFilter = ''; // 当前筛选条件
    let activeDiscount = 10; // 当前折扣条件
    let activeSortType = 'id'; // 当前排序类型
    let activeSortMethod = 'ASC'; // 当前排序方式
    let activeCategory = ''; // 当前分类
    let totalItemsCount = 0; // 商品总数

    // 加载商品列表
    async function fetchProducts() {
        try {
            const params = {
                current: activePage, // 当前页码
                pagesize: itemsPerPage, // 每页显示的商品数量
                search: keyword, // 搜索关键词
                filter: activeFilter, // 当前筛选条件
                saleType: activeDiscount, // 当前折扣条件
                sortType: activeSortType, // 当前排序类型
                sortMethod: activeSortMethod, // 当前排序方式
                category: activeCategory // 当前分类
            };

            const response = await axios.get('http://localhost:8888/goods/list', { params }); // 发送GET请求获取商品列表
            if (response.data.code === 1) { // 如果服务器返回的代码为1，表示获取成功
                totalItemsCount = response.data.total; // 更新商品总数
                updatePaginationDisplay(); // 更新分页显示
                renderProducts(response.data.list); // 渲染商品列表
            } else {
                console.error('获取商品列表失败'); // 如果获取失败，在控制台输出错误信息
            }
        } catch (error) {
            console.error('获取商品列表出错:', error); // 捕捉请求过程中发生的错误并在控制台输出
        }
    }

    // 显示商品列表
    function renderProducts(productsList) {
        productsContainer.innerHTML = ''; // 清空商品列表容器

        if (productsList.length === 0) { // 如果没有找到相关商品
            productsContainer.innerHTML = '<p>没有找到相关商品</p>'; // 显示没有找到商品的提示
            return;
        }

        productsList.forEach(product => { // 遍历商品列表
            const productItem = document.createElement('li'); // 创建商品项
            productItem.dataset.id = product.goods_id; // 设置商品ID

            productItem.innerHTML = `
                <div class="show">
                    <img src="${product.img_big_logo}" alt="${product.title}">
                    ${product.is_hot ? '<span class="hot">热销</span>' : ''}
                    ${product.is_sale ? `<span class="sale">${product.sale_type}</span>` : ''}
                </div>
                <div class="info">
                    <p class="title">${product.title}</p>
                    <p class="price">
                        <span class="curr">¥ ${product.current_price}</span>
                        ${product.is_sale ? `<span class="old">¥ ${product.price}</span>` : ''}
                    </p>
                </div>
            `; // 设置商品项的内容

            productItem.addEventListener('click', () => { // 为商品项添加点击事件
                window.location.href = `detail.html?id=${product.goods_id}`; // 点击后跳转到商品详情页
            });

            productsContainer.appendChild(productItem); // 将商品项添加到商品列表容器中
        });
    }

    // 更新分页显示
    function updatePaginationDisplay() {
        const totalPages = totalItemsCount; // 获取总页数
        totalPagesDisplay.textContent = `${activePage} / ${totalPages}`; // 更新分页显示文本

        firstPageButton.classList.toggle('disable', activePage === 1); // 根据当前页码更新首页按钮的禁用状态
        prevPageButton.classList.toggle('disable', activePage === 1); // 根据当前页码更新上一页按钮的禁用状态
        nextPageButton.classList.toggle('disable', activePage === totalPages); // 根据当前页码更新下一页按钮的禁用状态
        lastPageButton.classList.toggle('disable', activePage === totalPages); // 根据当前页码更新尾页按钮的禁用状态
    }

    // 加载分类列表
    async function fetchCategories() {
        try {
            const response = await axios.get('http://localhost:8888/goods/category'); // 发送GET请求获取分类列表
            if (response.data.code === 1) { // 如果服务器返回的代码为1，表示获取成功
                renderCategories(response.data.list); // 渲染分类列表
            } else {
                console.error('获取分类列表失败'); // 如果获取失败，在控制台输出错误信息
            }
        } catch (error) {
            console.error('获取分类列表出错:', error); // 捕捉请求过程中发生的错误并在控制台输出
        }
    }

    // 显示分类列表
    function renderCategories(categories) {
        categoriesList.innerHTML = '<li class="active" data-type="">全部</li>'; // 初始化分类列表并添加“全部”选项
        categories.forEach(category => { // 遍历分类列表
            const categoryItem = document.createElement('li'); // 创建分类项
            categoryItem.dataset.type = category; // 设置分类项的数据类型
            categoryItem.textContent = category; // 设置分类项的文本内容
            categoriesList.appendChild(categoryItem); // 将分类项添加到分类列表容器中
        });

        document.querySelectorAll('.category li').forEach(categoryItem => { // 为每个分类项添加点击事件
            categoryItem.addEventListener('click', ({ target }) => {
                if (target.nodeName === 'LI') {
                    document.querySelectorAll('.category li').forEach(li => li.classList.remove('active')); // 清除所有分类项的活动状态
                    target.classList.add('active'); // 设置当前点击的分类项为活动状态
                    activeCategory = target.dataset.type; // 更新当前分类
                    activePage = 1; // 重置当前页码为1
                    fetchProducts(); // 加载商品列表
                }
            });
        });
    }

    // 事件监听
    filterList.addEventListener('click', ({ target }) => { // 为筛选列表添加点击事件
        if (target.nodeName === 'LI') {
            document.querySelectorAll('.filterBox li').forEach(li => li.classList.remove('active')); // 清除所有筛选项的活动状态
            target.classList.add('active'); // 设置当前点击的筛选项为活动状态
            activeFilter = target.dataset.type; // 更新当前筛选条件
            activePage = 1; // 重置当前页码为1
            fetchProducts(); // 加载商品列表
        }
    });

    discountList.addEventListener('click', ({ target }) => { // 为折扣列表添加点击事件
        if (target.nodeName === 'LI') {
            document.querySelectorAll('.saleBox li').forEach(li => li.classList.remove('active')); // 清除所有折扣项的活动状态
            target.classList.add('active'); // 设置当前点击的折扣项为活动状态
            activeDiscount = parseInt(target.dataset.type, 10); // 更新当前折扣条件
            activePage = 1; // 重置当前页码为1
            fetchProducts(); // 加载商品列表
        }
    });

    sortList.addEventListener('click', ({ target }) => { // 为排序列表添加点击事件
        if (target.nodeName === 'LI') {
            document.querySelectorAll('.sortBox li').forEach(li => li.classList.remove('active')); // 清除所有排序项的活动状态
            target.classList.add('active'); // 设置当前点击的排序项为活动状态
            activeSortType = target.dataset.type; // 更新当前排序类型
            activeSortMethod = target.dataset.method; // 更新当前排序方式
            activePage = 1; // 重置当前页码为1
            fetchProducts(); // 加载商品列表
        }
    });

    pageSizeSelect.addEventListener('change', () => { // 为分页大小选择框添加更改事件
        itemsPerPage = parseInt(pageSizeSelect.value, 10); // 更新每页显示的商品数量
        activePage = 1; // 重置当前页码为1
        fetchProducts(); // 加载商品列表
    });

    pageNumberInput.addEventListener('change', () => { // 为分页输入框添加更改事件
        activePage = parseInt(pageNumberInput.value, 10); // 更新当前页码
        fetchProducts(); // 加载商品列表
    });

    searchInput.addEventListener('input', () => { // 为搜索输入框添加输入事件
        keyword = searchInput.value; // 更新搜索关键词
        activePage = 1; // 重置当前页码为1
        fetchProducts(); // 加载商品列表
    });

    firstPageButton.addEventListener('click', () => { // 为首页按钮添加点击事件
        activePage = 1; // 更新当前页码为1
        fetchProducts(); // 加载商品列表
    });

    prevPageButton.addEventListener('click', () => { // 为上一页按钮添加点击事件
        if (activePage > 1) { // 如果当前页码大于1
            activePage--; // 将当前页码减1
            fetchProducts(); // 加载商品列表
        }
    });

    nextPageButton.addEventListener('click', () => { // 为下一页按钮添加点击事件
        if (activePage < totalItemsCount) { // 如果当前页码小于总页数
            activePage++; // 将当前页码加1
            fetchProducts(); // 加载商品列表
        }
    });

    lastPageButton.addEventListener('click', () => { // 为尾页按钮添加点击事件
        activePage = totalItemsCount; // 更新当前页码为总页数
        fetchProducts(); // 加载商品列表
    });

    // 初次加载
    fetchCategories(); // 加载分类列表
    fetchProducts(); // 加载商品列表
});
