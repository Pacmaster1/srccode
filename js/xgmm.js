$(document).ready(function() { // 当整个文档加载完成后执行此函数
  const apiUrl = 'http://localhost:8888'; // 定义API的基本URL地址
  const token = localStorage.getItem('token'); // 从本地存储获取token
  const userId = localStorage.getItem('userId'); // 从本地存储获取用户ID

  if (!token || !userId) { // 如果token或用户ID不存在
    alert('请先登录'); // 弹出提示要求先登录
    window.location.href = 'login.html'; // 跳转到登录页面
    return; // 退出函数，不进行后续操作
  }

  const oldPasswordInput = $('.oldpassword'); // 获取旧密码输入框
  const newPasswordInput = $('.newpassword'); // 获取新密码输入框
  const rNewPasswordInput = $('.rnewpassword'); // 获取确认新密码输入框
  const errorSpan = $('.error'); // 获取用于显示错误信息的元素

  // 提交表单事件
  $('form').on('submit', async function(event) {
    event.preventDefault(); // 阻止默认的表单提交行为
    const oldPassword = oldPasswordInput.val().trim(); // 获取并清除旧密码输入的前后空格
    const newPassword = newPasswordInput.val().trim(); // 获取并清除新密码输入的前后空格
    const rNewPassword = rNewPasswordInput.val().trim(); // 获取并清除确认新密码输入的前后空格

    if (newPassword !== rNewPassword) { // 检查新密码和确认新密码是否一致
      errorSpan.text('新密码和确认新密码不一致').show(); // 如果不一致，显示错误信息
      return; // 退出函数，不进行后续操作
    }

    try {
      const response = await axios.post(`${apiUrl}/users/xgmm`, { // 发送POST请求修改密码
        id: userId, // 提交的用户ID
        oldPassword: oldPassword, // 提交的旧密码
        newPassword: newPassword, // 提交的新密码
        rNewPassword: rNewPassword // 提交的确认新密码
      }, {
        headers: { 'Authorization': token } // 在请求头中添加token
      });

      if (response.data.code === 1) { // 如果服务器返回的代码为1，表示修改成功
        alert('修改密码成功，已注销登录状态，请重新登录'); // 弹出修改成功提示信息
        localStorage.removeItem('token'); // 删除本地存储中的token
        localStorage.removeItem('userId'); // 删除本地存储中的用户ID
        localStorage.removeItem('nickname'); // 删除本地存储中的用户昵称
        window.location.href = 'login.html'; // 跳转到登录页面
      } else { // 如果服务器返回的代码不是1，表示修改失败
        errorSpan.text('修改密码失败：' + response.data.message).show(); // 显示服务器返回的错误信息
      }
    } catch (error) { // 捕捉发送请求过程中发生的错误
      console.error('修改密码出错:', error); // 在控制台输出错误信息
      errorSpan.text('修改密码出错，请稍后重试').show(); // 显示通用错误信息
    }
  });
});
