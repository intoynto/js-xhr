const path=require("path");
const TerserWebpackPlugin = require('terser-webpack-plugin');
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dev=require("./wp.dev");

module.exports=function(env,args)
{
    const isProd=args && args.mode && args.mode==="production"?true:false;
    const mode=isProd?"production":"development";
    console.log("wp.mode ",mode," env ",env);

    const conf=
    {        
        output:{
            path:path.resolve(__dirname,"dist"),
            chunkFilename: '[name].js',
            filename: '[name].js',
            libraryTarget: 'umd',
            library: `${dev.MODUL_NAME}`,
            umdNamedDefine: true
        },
        devtool:'source-map',
        resolve: { extensions: ['.ts'] },
        plugins:[
            new CleanWebpackPlugin(),       
            new TypescriptDeclarationPlugin({
                out:`${dev.MODUL_NAME}.d.ts`,
            }),       
        ],
        module:{
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_module|dist)/,
                    use:[
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                            },
                        },
                        {
                            loader: 'ts-loader',
                        }                       
                    ],
                }
            ]
        },
        optimization:{
            minimizer:[
                new TerserWebpackPlugin()
            ],
        }
    };

    conf.entry={};
    conf.entry[`${dev.MODUL_NAME}`]=path.resolve(__dirname,"src/index.ts");
    return conf;
};