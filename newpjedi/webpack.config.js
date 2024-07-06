module.exports = (env, argv) => {
  const mode = env.TARGET_ENV === 'development' ? 'development' : 'production';
  const config = require(`./webpack.${mode}.js`);

  return config(env, argv);
};
