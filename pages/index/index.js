var api = require('../../utils/api.js')
var app = getApp()

let pageData = {
  systemInfo: {},
  api: api,
  navbar: ['推荐', '商品', '新闻'],
  currentNavbar: '0',
  // in swiper view
  // item.pic: the pic url
  swipers: [],
  // hot list
  list: [],
  hot_last_id: 0,
  // latest list
  items_list: [],
  items_last_id: 0,
}

Page({

  data: pageData,

  onLoad () {
    var that = this

    app.getSystemInfo(function(res) {
      that.setData({
        systemInfo: res
      })

      // SDKVersion errMsg language model
      // pixelRatio platform screenHeight screenWidth
      // system version windowHeight windowWidth
      console.log(";; system info")
      console.log(res)
    })

    this.getSwipers()
    this.pullUpLoad()

    // api.get("http://45.77.16.172/wechat")
    //   .then(res => {
    //     console.log("asf")
    //     console.log(res.data)
    //   })

    // set data
    // this.setData({
    //   name: "asdf"
    // })
  },

  /**
   *
   */
   getSwipers () {
     api.get(api.SWIPERS)
       .then(res => {
         this.setData({
           swipers: res.data.ads
         })

         console.log(";; swipers data")
         console.log(res)
       })
   },

  /**
   * 点击跳转详情页
   */
  itemClickCallback (e) {
    if (e.currentTarget.dataset.rowId != null) {
      var targetUrl = api.PAGE_ITEM + '?rowId=' + e.currentTarget.dataset.rowId
      console.log(":flag " + targetUrl)
      wx.navigateTo({
        url: targetUrl
      })
    }
    else {
      console.error("item click callback on error target")
    }
  },

  /**
   * 切换 navbar
   */
  switchNav (e) {
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 1 && this.data.items_list.length == 0) {
      this.pullUpLoadLatest()
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh () {
    switch (this.data.currentNavbar) {
      case '0':
        this.setData({
          list: [],
          hot_last_id: 0
        })
        this.pullUpLoad()
        break
      case '1':
        this.setData({
          items_list: [],
          latest_list_id: 0
        })
        this.pullUpLoadLatest()
        break
      case '2':
        wx.stopPullDownRefresh()
        break
    }
  },

  /**
   * [推荐]上拉刷新
   */
  pullUpLoad () {
    wx.showNavigationBarLoading()
    api.get(api.HOST_IOS + api.HOT + '?last_id=' + this.data.hot_last_id)
      .then(res => {
        this.setData({
          list: this.data.list.concat(res.data.list),
          hot_last_id: res.data.last_id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
  },

  /**
   * [最新]上拉刷新
   */
  pullUpLoadLatest () {
    wx.showNavigationBarLoading()
    api.get(api.HOST_IOS + api.LATEST + '?last_id=' + this.data.items_last_id)
      .then(res => {
        this.setData({
          items_list: this.data.items_list.concat(res.data.list),
          items_last_id: res.data.last_id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
  }
})
