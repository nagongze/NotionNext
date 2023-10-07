import React from 'react'
import { init } from '@waline/client'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import '@waline/client/dist/waline.css'

const path = ''
let waline = null
/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const WalineComponent = (props) => {
  const containerRef = React.createRef()
  const router = useRouter()

  const updateWaline = url => {
    if (url !== path && waline) {
      waline.update(props)
    }
  }
  const locale = {
    profile: '個人資料',
    approved: '通過',
    waiting: '待審',
    spam: '燒毀',
    oldest: '按倒序',
    latest: '按正序',
    hottest: '按熱門度',
    sticky: '釘選',
    unsticky: '取消釘選',
    login: '登入',
    logout: '登出',
    admin: '雫雫',
    anonymous: '陌生人',
    nick: '暱稱',
    mail: '信箱',
    link: '網址',
    placeholder: '1. 暱稱留空可變匿名留言。\n2. 填寫信箱可收到Email通知。\n3. 圖片可直接貼上。\n4. 想修改留言需要登入帳號。',
    sofa: '目前還沒有留言，來當第一個吧！',
    submit: '傳送',
    reply: '回覆',
    cancelReply: '取消回覆',
    comment: '留言',
    preview: '預覽',
    emoji: '表情',
    seconds: '秒前',
    minutes: '分鐘前',
    hours: '小時前',
    days: '天前',
    now: '剛剛',
    word: '字',
    more: '載入更多...',
    gifSearchPlaceholder: '搜尋GIF...',
    uploadImage: '上傳圖片',
    uploading: '正在上傳...',
    mailError: '請填寫正確的信箱地址',
    nickError: '暱稱不能少於3個字符',
    wordHint: '留言字數應在 $0 到 $1 字之間！\n當前字數：$2'
  }

  React.useEffect(() => {
    if (!waline) {
      waline = init({
        ...props,
        el: containerRef.current,
        locale,
        serverURL: BLOG.COMMENT_WALINE_SERVER_URL,
        emoji: false,
        meta: ['nick', 'mail'],
        search: false,
        imageUploader: function (file) {
          const myHeaders = new Headers()
          myHeaders.append('Authorization', 'Client-ID ' + BLOG.IMGUR_CLIENT_ID)
          const formdata = new FormData()
          formdata.append('image', file)
          const requestOptions = {
            async: true,
            crossDomain: true,
            processData: false,
            contentType: false,
            method: 'POST',
            headers: myHeaders,
            body: formdata
          }
          return fetch('https://api.imgur.com/3/image', requestOptions)
            .then((resp) => resp.json())
            .then((resp) => resp.data.link)
        }
      })
    }

    // 跳转评论
    router.events.on('routeChangeComplete', updateWaline)
    const anchor = window.location.hash
    if (anchor) {
      // 选择需要观察变动的节点
      const targetNode = document.getElementsByClassName('wl-cards')[0]

      // 当观察到变动时执行的回调函数
      const mutationCallback = (mutations) => {
        for (const mutation of mutations) {
          const type = mutation.type
          if (type === 'childList') {
            const anchorElement = document.getElementById(anchor.substring(1))
            if (anchorElement && anchorElement.className === 'wl-item') {
              anchorElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
              setTimeout(() => {
                anchorElement.classList.add('animate__animated')
                anchorElement.classList.add('animate__bounceInRight')
                observer.disconnect()
              }, 300)
            }
          }
        }
      }

      // 观察子节点 变化
      const observer = new MutationObserver(mutationCallback)
      observer.observe(targetNode, { childList: true })
    }

    return () => {
      if (waline) {
        waline.destroy()
        waline = null
      }
      router.events.off('routeChangeComplete', updateWaline)
    }
  }, [])

  return <div ref={containerRef} />
}

export default WalineComponent
