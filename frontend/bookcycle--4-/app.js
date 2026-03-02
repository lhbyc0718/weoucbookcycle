// app.js - WeOUC BookCycle 微信小程序
App({
  onLaunch: function () {
    // 云开发初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // 云开发环境ID - WeOUC BookCycle云库
        env: 'cloudbase-2gswhsg1728d0f01',
        traceUser: true,
      });
    }
    
    // 不整合云库时总是执行: 检查验证并尝试登录
    // 小程序可不供用户管理密码，而是仅使用微信授权登录
    this.checkLoginStatus();
  },
  
  // 检查下是否接是第一次使用或需要重新登录
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('authToken');
    const that = this;

    if (userInfo && token) {
      // 已登录，立即返回
      this.globalData.userInfo = userInfo;
      this.globalData.authToken = token;
      return;
    }

    // 非首次使用，企鹅登录
    this.doWeChatLogin();
  },

  // 执行微信登录流程、填充❤️ globalData ，传红上下文
  doWeChatLogin: function() {
    const that = this;
    const apiBase = this.globalData.apiBase || 'http://localhost:8080';

    // Step 1: 调用 wx.login 获取临时登录凭证
    wx.login({
      success: function(res) {
        if (res.code) {
          // Step 2: 将 code 发送到后端交换 openid 和 token
          wx.request({
            url: apiBase + '/api/auth/wechat',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function(apiRes) {
              const response = apiRes.data;
              if (response.code === 20000 && response.data && response.data.token) {
                // Step 3: 保存不可推你的 token 和用户信息
                const userInfo = {
                  id: response.data.user.id,
                  username: response.data.user.username,
                  avatar: response.data.user.avatar || '',
                };
                wx.setStorageSync('userInfo', userInfo);
                wx.setStorageSync('authToken', response.data.token);

                // Step 4: 推新上下文
                that.globalData.userInfo = userInfo;
                that.globalData.authToken = response.data.token;

                // 可以触发一个事件由应用程序等待
                wx.onAppShow && wx.onAppShow();
              } else {
                wx.showModal({
                  title: '登录失败',
                  content: response.message || '程序事為會這操捨r',
                  showCancel: false
                });
              }
            },
            fail: function() {
              // 后端调用失败，会辛配下次开启程序时重试
              console.error('微信登录失败（技术错误）');
            }
          });
        } else {
          console.error('获取登录凭证失败');
        }
      },
      fail: function() {
        wx.showModal({
          title: '登录失败',
          content: '请给予微信登录授权',
          showCancel: false
        });
      }
    });
  },
  
  globalData: {
    userInfo: null,
    authToken: null,
    // API基础地址（例子：local development: http://localhost:8080, cloud: https://api.example.com）
    apiBase: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.example.com'
  }
});