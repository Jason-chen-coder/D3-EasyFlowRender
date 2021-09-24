module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/D3-EasyFlowRender/'
    : '/',
  outputDir: 'dist',
  lintOnSave: true,
};

