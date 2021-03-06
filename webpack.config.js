const path = require('path')
const webpack = require('webpack')//启用热更新的第二步
//导入在内存中生成HTML页面的插件
//只要是插件，都一定要放到plugins节点中去
//这个插件的两个作用：
//1.自动在内存中根据指定页面生成一个内存的页面
//2.自动，把打包好的bundle.js追加到页面中去
const htmlWebpackPlugin = require('html-webpack-plugin')

//这个配置文件，起始就是一个JS文件，通过Node中的模块操作，向外暴露了一个配置对象
module.exports = {
    //大家已经学会了举一反三，大家觉得，在配置文件中，需要手动指定入口和出口
    entry: path.join(__dirname, './src/main.js'),//入口，表示，要使用的webpack打包哪个文件
    output:{  //输出文件相关的配置
        path: path.join(__dirname, './dist'), //指定打包好的文件，输出到哪个目录中去
        filename: 'bundle.js' //这是指定输出的文件的名称
    },

    devServer: {  //这是配置dev-server命令参数的第二种形式，相对来说，这种方式麻烦一些
        //--open --port 3000 --contentBase src --hot
        open: true, //自动打开浏览器
        port: 3000,  //设置启动时候的运行端口
        contentBase: 'src', //指定托管的根目录
        hot: true //启用热更新的第一步
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(), //new一个热更新的模块对象，这是启用热更新的第三步
        new htmlWebpackPlugin({  //创建一个在内存中生成HTML页面的插件
            template: path.join(__dirname, './src/index.html'), //指定模板页面，将来会根据指定的页面路径，去生成内存中的页面
            filename:'index.html'
        })
    ],
    module:{ //这个节点，用于配置所有第三方模块加载器
        rules:[ //所有第三方模块的匹配规则
            { test:/\.css$/, use: ['style-loader', 'css-loader'] }, //配置处理.css文件的第三方loader规则
            { test:/\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, //配置处理.less文件的第三方loader规则
            { test:/\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, //配置处理.scss文件的第三方loader规则
            { test:/\.(jpg|png|gif|bmp|jpeg)$/, use:'url-loader?limit=20000&name=[hash:8]-[name].[ext]' }, //处理图片路径的loader
            //limit给定的值，是图片的大小，单位是byte,如果我们引用的图片，等于给定的limit值，则不会被转为base64格式的字符串，如果图片小于或大于给定的limit值，则会被转为base64的字符串
            { test:/\.(ttf|eot|svg|woff|woff2)$/, use:'url-loader' }, //处理字体文件的loader
            { test:/\.js$/, use: 'babel-loader', exclude:/node_modules/ }, //配置Babel来转换高级的ES语法
            { test:/\.vue$/, use: 'vue-loader' }//处理.vue文件的
        ]
    },
    resolve:{
        alias: { //设置Vue被导入时候的包的路径
            "vue$": "vue/dist/vue.js"
        }
    }
}



//当我们在控制台，直接输入webpack命令执行的时候，webpack做了以下几步：
//1.首先，webpack发现，我们并没有通过命令的形式，给它指定入口和出口
//2.webpack就会去项目的根目录中，查找一个叫'webpack.config.js'的配置文件
//3.当找到配置文件后，webpack会去解析执行这个配置文件，当解析执行完配置文件后，就得到了配置文件中，导出的配置对象
//4.当webpack拿到配置对象后，就拿到了配置对象中，指定的入口和出口，然后进行打包构建；