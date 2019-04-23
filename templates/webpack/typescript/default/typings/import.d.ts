declare module '*.pug' {
  // 根据 webpack 设置的 loader 返回数据格式
  const template: string
  export default template
}
