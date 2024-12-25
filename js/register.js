$(document).ready(function() { // 当整个文档加载完成后执行此函数
  const apiUrl = 'http://localhost:8888'; // 定义API的基本URL地址

  const usernameInput = $('.username'); // 获取用户名输入框
  const passwordInput = $('.password'); // 获取密码输入框
  const rpasswordInput = $('.rpassword'); // 获取确认密码输入框
  const nicknameInput = $('.nickname'); // 获取昵称输入框
  const errorSpan = $('.error'); // 获取用于显示错误信息的元素

  // 绑定表单提交事件
  $('form').on('submit', async function(event) {
    event.preventDefault(); // 阻止默认的表单提交行为
    const username = usernameInput.val().trim(); // 获取并清除用户名输入的前后空格
    const password = passwordInput.val().trim(); // 获取并清除密码输入的前后空格
    const rpassword = rpasswordInput.val().trim(); // 获取并清除确认密码输入的前后空格
    const nickname = nicknameInput.val().trim(); // 获取并清除昵称输入的前后空格

    if (password !== rpassword) { // 检查密码和确认密码是否一致
      errorSpan.text('密码和确认密码不一致').show(); // 如果不一致，显示错误信息
      return; // 退出函数，不进行后续操作
    }

    try {
      const response = await axios.post(`${apiUrl}/users/register`, { // 发送POST请求注册用户
        username: username, // 提交的用户名
        password: password, // 提交的密码
        rpassword: rpassword, // 提交的确认密码
        nickname: nickname // 提交的昵称
      });

      if (response.data.code === 1) { // 如果服务器返回的代码为1，表示注册成功
        alert('恭喜注册成功!'); // 弹出成功提示
        window.location.href = 'login.html'; // 跳转到登录页面
      } else { // 如果服务器返回的代码不是1，表示注册失败
        errorSpan.text('注册失败：' + response.data.message).show(); // 显示服务器返回的错误信息
      }
    } catch (error) { // 捕捉发送请求过程中发生的错误
      console.error('注册出错:', error); // 在控制台输出错误信息
      errorSpan.text('注册出错，请稍后重试').show(); // 显示通用错误信息
    }
  });
});
