$(document).ready(function () {
  const apiUrl = 'http://localhost:8888'; // 后端服务地址
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    alert('请先登录');
    window.location.href = 'login.html';
    return;
  }

  const usernameInput = $('.username');
  const ageInput = $('.age');
  const genderSelect = $('.gender');
  const nicknameInput = $('.nickname');

  async function loadUserInfo() {
    try {
      console.log('加载用户信息请求:', `${apiUrl}/users/info?id=${userId}`);
      console.log('Token:', token);
      console.log('User ID:', userId);

      const response = await axios.get(`${apiUrl}/users/info`, {
        params: { id: userId },
        headers: { Authorization: token },
      });

      console.log('用户信息响应:', response.data);

      if (response.data && response.data.code === 1 && response.data.user) {
        const userInfo = response.data.user;
        usernameInput.val(userInfo.username || '加载中...');
        ageInput.val(userInfo.age || '');
        genderSelect.val(userInfo.gender || '');
        nicknameInput.val(userInfo.nickname || '');
        alert('获取用户信息成功！ ^_^');
      } else {
        const errorMessage = response.data?.message || '未知错误';
        console.error('获取用户信息失败:', errorMessage);
        alert(`获取用户信息失败：${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '未知错误';
      console.error('获取用户信息出错:', error);
      alert(`获取用户信息出错，请稍后重试。\n错误信息：${errorMessage}`);
    }
  }

  $('form').on('submit', async function (event) {
    event.preventDefault();
    const age = ageInput.val().trim();
    const gender = genderSelect.val();
    const nickname = nicknameInput.val().trim();

    try {
      const response = await axios.post(
        `${apiUrl}/users/update`,
        { id: userId, age, gender, nickname },
        { headers: { Authorization: token } }
      );

      console.log('用户信息更新响应:', response.data);

      if (response.data.code === 1) {
        alert('修改用户信息成功');
        localStorage.setItem('nickname', nickname);
        window.location.href = 'index.html';
      } else {
        alert('修改用户信息失败：' + response.data.message);
      }
    } catch (error) {
      console.error('修改用户信息出错:', error);
      alert('修改用户信息出错，请稍后重试');
    }
  });

  loadUserInfo();
});
