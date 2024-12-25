$(document).ready(function() { // 当整个文档加载完成后执行此函数
  $('form').on('submit', function(event) { // 为表单提交事件绑定处理函数
    event.preventDefault(); // 防止表单默认提交行为

    // 获取表单中的用户名和密码
    const username = $('.username').val().trim(); // 获取并清除用户名输入的前后空格
    const password = $('.password').val().trim(); // 获取并清除密码输入的前后空格

    // 验证输入
    if (!username || !password) { // 如果用户名或密码为空
      alert('请填写用户名和密码'); // 弹出提示信息
      return; // 退出函数，不进行后续操作
    }

    // 准备发送的数据
    const loginData = {
      username: username, // 用户名
      password: password // 密码
    };

    // 发送POST请求到登录API
    axios.post('http://localhost:8888/users/login', loginData)
      .then(function(response) { // 处理成功响应
        const data = response.data;
        if (data.code === 1) { // 如果服务器返回的代码为1，表示登录成功
          alert(data.message); // 弹出登录成功提示信息
          // 保存token和nickname到localStorage
          localStorage.setItem('token', data.token); // 保存token
          localStorage.setItem('nickname', data.user.nickname); // 保存用户昵称
          localStorage.setItem('userId', data.user.id); // 保存用户ID
          console.log(data.token); // 输出token到控制台
          // 重定向到index页面
          window.location.href = './index.html'; // 跳转到首页
        } else { // 如果服务器返回的代码不是1，表示登录失败
          // 显示错误信息
          $('.error').text(data.message).show(); // 显示服务器返回的错误信息
        }
      })
      .catch(function(error) { // 处理错误响应
        console.error('登录请求出错：', error); // 在控制台输出错误信息
        $('.error').text('用户名或密码错误！').show(); // 显示通用错误信息
      });
  });
});
